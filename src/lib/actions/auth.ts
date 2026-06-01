"use server";

import { db } from "@/db";
import { users, admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

/**
 * Validasi format email
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Register User - Membuat akun user baru
 * @param formData - Object dengan email, password, fullName
 * @returns { success: boolean, message: string, data?: object, error?: string }
 */
export async function registerUser(formData: {
  fullName: string;
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: { id: number; email: string; fullName: string | null };
  error?: string;
}> {
  try {
    // ========== VALIDASI INPUT ==========
    const { fullName, email, password } = formData;

    // Validasi email format
    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        message: "Email tidak valid",
        error: "INVALID_EMAIL",
      };
    }

    // Validasi password minimal 6 karakter
    if (!password || password.length < 6) {
      return {
        success: false,
        message: "Password minimal harus 6 karakter",
        error: "WEAK_PASSWORD",
      };
    }

    // Validasi nama
    if (!fullName || fullName.trim().length === 0) {
      return {
        success: false,
        message: "Nama lengkap harus diisi",
        error: "INVALID_FULLNAME",
      };
    }

    // ========== CEK EMAIL SUDAH TERDAFTAR ==========
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        success: false,
        message:
          "Email sudah terdaftar. Silahkan gunakan email lain atau login.",
        error: "EMAIL_ALREADY_EXISTS",
      };
    }

    // ========== HASH PASSWORD ==========
    const passwordHash = await bcrypt.hash(password, 10);

    // ========== SIMPAN KE DATABASE ==========
    const result = await db
      .insert(users)
      .values({
        fullName: fullName.trim(),
        email: email.toLowerCase(),
        passwordHash,
        isActive: true,
      })
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
      });

    if (result.length === 0) {
      return {
        success: false,
        message: "Gagal membuat akun. Silahkan coba lagi.",
        error: "INSERT_FAILED",
      };
    }

    return {
      success: true,
      message: "Akun berhasil dibuat! Silahkan login.",
      data: result[0],
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat membuat akun",
      error: "INTERNAL_ERROR",
    };
  }
}

/**
 * Login User - Melakukan autentikasi user
 * @param formData - Object dengan email dan password
 * @returns { success: boolean, message: string, data?: object, error?: string }
 */
export async function loginUser(formData: {
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: { id: number; email: string; fullName: string | null };
  error?: string;
}> {
  try {
    // ========== VALIDASI INPUT ==========
    const { email, password } = formData;

    if (!email || !password) {
      return {
        success: false,
        message: "Kredensial tidak valid",
        error: "MISSING_CREDENTIALS",
      };
    }

    // ========== CARI USER DI DATABASE ==========
    const foundUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    // Jika user tidak ditemukan, return generic error untuk security
    if (foundUser.length === 0) {
      return {
        success: false,
        message: "Kredensial tidak valid",
        error: "INVALID_CREDENTIALS",
      };
    }

    const user = foundUser[0];

    // Cek apakah user aktif
    if (!user.isActive) {
      return {
        success: false,
        message: "Akun Anda telah dinonaktifkan",
        error: "USER_INACTIVE",
      };
    }

    // ========== COCOKKAN PASSWORD ==========
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Kredensial tidak valid",
        error: "INVALID_CREDENTIALS",
      };
    }

    // ========== LOGIN SUKSES ==========
    return {
      success: true,
      message: "Login berhasil!",
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat login",
      error: "INTERNAL_ERROR",
    };
  }
}

/**
 * Login Admin - Melakukan autentikasi admin
 * @param formData - Object dengan email dan password
 * @returns { success: boolean, message: string, role?: string, data?: object, error?: string }
 */
export async function loginAdmin(formData: {
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  message: string;
  role?: "admin";
  data?: { id: number; email: string; fullName: string };
  error?: string;
}> {
  try {
    const { email, password } = formData;

    if (!email || !password) {
      return {
        success: false,
        message: "Kredensial tidak valid",
        error: "MISSING_CREDENTIALS",
      };
    }

    // ========== CARI ADMIN DI DATABASE ==========
    const foundAdmin = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email.toLowerCase()))
      .limit(1);

    if (foundAdmin.length === 0) {
      return {
        success: false,
        message: "Kredensial tidak valid",
        error: "INVALID_CREDENTIALS",
      };
    }

    const admin = foundAdmin[0];

    // Cek apakah admin aktif
    if (!admin.isActive) {
      return {
        success: false,
        message: "Akun admin telah dinonaktifkan",
        error: "ADMIN_INACTIVE",
      };
    }

    // ========== COCOKKAN PASSWORD ==========
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Kredensial tidak valid",
        error: "INVALID_CREDENTIALS",
      };
    }

    // ========== LOGIN SUKSES ==========
    return {
      success: true,
      message: "Login admin berhasil!",
      role: "admin",
      data: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
      },
    };
  } catch (error) {
    console.error("Admin login error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat login admin",
      error: "INTERNAL_ERROR",
    };
  }
}
