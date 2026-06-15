"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/actions/auth";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!agreeTerms) {
      setError("Anda harus setuju dengan Syarat & Ketentuan");
      return;
    }

    setIsLoading(true);

    // Panggil Server Action untuk registrasi
    const result = await registerUser({
      fullName,
      email,
      password,
    });

    if (result.success) {
      setSuccessMessage("Akun berhasil dibuat! Mengalihkan ke login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      setIsLoading(false);
      setError(result.message || "Gagal membuat akun");
    }
  };

  const handleGoogleRegister = () => {
    console.log("Daftar dengan Google");
  };

  return (
    <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
      <div className="w-full max-w-md mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-[#6b7280] hover:text-[#111827] transition"
        >
          <span className="mr-2">←</span>
          Kembali ke Beranda
        </Link>
      </div>

      {/* Tabs style sama dengan login */}
      <div className="w-full max-w-md mb-8">
        <div className="flex gap-2 border-b border-[#e5e7eb]">
          <Link
            href="/login"
            className="px-6 py-3 font-bold text-[#9ca3af] hover:text-[#111827]"
          >
            Masuk
          </Link>
          <button className="px-6 py-3 font-bold text-[#111827] border-b-2 border-[#d32626]">
            Daftar
          </button>
        </div>
      </div>

      <div className="w-full max-w-md mb-8">
        <h2 className="text-2xl font-bold text-[#111827] mb-2">
          Buat Akun Baru
        </h2>
        <p className="text-[#6b7280] text-sm">
          Bergabung bersama ribuan peserta lainnya.
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

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-[#111827] mb-2"
          >
            Nama Lengkap
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nama lengkap"
            required
            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d32626] focus:border-transparent"
          />
        </div>

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

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-[#111827] mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required
              minLength={8}
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

        <div className="flex items-start">
          <input
            id="agreeTerms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 accent-[#d32626] cursor-pointer mt-1"
            required
          />
          <label
            htmlFor="agreeTerms"
            className="ml-2 text-sm text-[#6b7280] cursor-pointer"
          >
            Saya setuju dengan{" "}
            <span className="text-[#d32626] font-semibold">
              Syarat & Ketentuan
            </span>{" "}
            dan{" "}
            <span className="text-[#d32626] font-semibold">
              Kebijakan Privasi
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !agreeTerms}
          className="w-full py-3 bg-[#d32626] text-white font-bold rounded-lg hover:bg-[#b82020] disabled:opacity-50 transition mt-8"
        >
          {isLoading ? "Sedang Memproses..." : "Daftar"}
        </button>
      </form>

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

      <button
        onClick={handleGoogleRegister}
        className="mt-8 w-full max-w-md py-3 border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.461,2.268,15.365,1.40,12.545,1.40 c-6.321,0-11.444,5.123-11.444,11.449s5.123,11.449,11.444,11.449c11.094,0,11.585-11.015,11.585-11.049h-11.585V10.239z"
          />
        </svg>
        Daftar dengan Google
      </button>

      <p className="mt-8 text-sm text-[#6b7280]">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="text-[#d32626] font-bold hover:underline"
        >
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
