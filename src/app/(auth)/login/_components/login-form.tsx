"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { loginUser, loginAdmin } from "@/lib/actions/auth";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const { loginAsAdmin, loginAsUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    // 1) Coba login sebagai admin dulu
    const adminResult = await loginAdmin({
      email: normalizedEmail,
      password,
    });

    if (adminResult.success) {
      // Set client-side auth state sebagai admin
      loginAsAdmin(normalizedEmail, password);
      setSuccessMessage("Login admin berhasil! Mengalihkan...");
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
      return;
    }

    // 2) Jika bukan admin, coba login sebagai user
    const result = await loginUser({
      email: normalizedEmail,
      password,
    });

    if (result.success) {
      loginAsUser(normalizedEmail, password);
      setSuccessMessage("Login berhasil! Mengalihkan...");
      setTimeout(() => {
        router.push("/user");
      }, 1500);
    } else {
      setIsLoading(false);
      setError(result.message || "Email atau password salah");
    }
  };

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    // Menentukan lokasi origin pengalihan yang aman untuk Vercel & Lokal
    const siteUrl = 
      process.env.NEXT_PUBLIC_SITE_URL || 
      (typeof window !== "undefined" ? window.location.origin : "https://intern-uad-hazel.vercel.app");

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/api/auth/callback`,
      },
    });

    if (error) {
      console.error("Gagal login dengan Google:", error.message);
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
      {/* Back Button */}
      <div className="w-full max-w-md mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-[#6b7280] transition hover:text-[#111827]"
        >
          <span className="mr-2">←</span>
          Kembali ke Beranda
        </Link>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-md mb-8">
        <div className="flex gap-2 border-b border-[#e5e7eb]">
          <button className="border-b-2 border-[#d32626] px-6 py-3 font-bold text-[#111827]">
            Masuk
          </button>
          <Link
            href="/auth/registrasi"
            className="px-6 py-3 font-bold text-[#9ca3af] hover:text-[#111827]"
          >
            Daftar
          </Link>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="w-full max-w-md mb-8">
        <h2 className="mb-2 text-2xl font-bold text-[#111827]">
          Selamat Datang Kembali!
        </h2>
        <p className="text-sm text-[#6b7280]">
          Silakan masuk ke akun id Academy Anda.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 w-full max-w-md rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-[#111827] mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            required
            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d32626] focus:border-transparent"
          />
        </div>

        {/* Password Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-[#111827]"
            >
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-[#d32626] hover:underline"
            >
              Lupa Password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d32626] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-[#6b7280]"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 accent-[#d32626] cursor-pointer"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 text-sm text-[#6b7280] cursor-pointer"
          >
            Ingatkan saya
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#d32626] text-white font-bold rounded-lg hover:bg-[#b82020] disabled:opacity-50 transition mt-8"
        >
          {isLoading ? "Sedang Memproses..." : "Masuk"}
        </button>
      </form>

      {/* Divider */}
      <div className="mt-8 w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5e7eb]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-[#6b7280]">atau</span>
          </div>
        </div>
      </div>

      {/* Google Login Button */}
      <button
        id="user-google-login-btn"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="mt-8 w-full max-w-md py-3 border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#d32626]" />
            <span className="text-sm font-medium text-[#6b7280]">Mengalihkan...</span>
          </>
        ) : (
          <>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-medium text-[#374151]">Masuk dengan Google</span>
          </>
        )}
      </button>

      {/* Register Link */}
      <p className="mt-8 text-sm text-[#6b7280]">
        Belum punya akun?{" "}
        <Link
          href="/auth/registrasi"
          className="text-[#d32626] font-bold hover:underline"
        >
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}