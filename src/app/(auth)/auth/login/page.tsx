"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeroSection from "../hero_section";
import { useAuth } from "@/lib/authContext";
import { loginUser } from "@/lib/actions/auth";

export default function LoginPage() {
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

    // Panggil Server Action untuk login
    const result = await loginUser({
      email: normalizedEmail,
      password,
    });

    if (result.success) {
      setSuccessMessage("Login berhasil! Mengalihkan...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else {
      setIsLoading(false);
      setError(result.message || "Email atau password salah");
    }
  };

  const handleGoogleLogin = () => {
    // Implementasi Google OAuth
    console.log("Login dengan Google");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Red Background */}
      <HeroSection />

      {/* Right Section - White Background */}
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
          onClick={handleGoogleLogin}
          className="mt-8 w-full max-w-md py-3 border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.461,2.268,15.365,1.40,12.545,1.40 c-6.321,0-11.444,5.123-11.444,11.449s5.123,11.449,11.444,11.449c11.094,0,11.585-11.015,11.585-11.049h-11.585V10.239z"
            />
          </svg>
          Masuk dengan Google
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
    </div>
  );
}
