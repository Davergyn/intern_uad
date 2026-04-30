"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeroSection from "../hero_section";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1200);
  };

  const handleGoogleRegister = () => {
    console.log("Daftar dengan Google");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - sama style dengan login */}
      <HeroSection />
      {/* Right Section - disamakan dengan login */}
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
              href="/auth/login"
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

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-[#111827] mb-2">
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
            <label htmlFor="email" className="block text-sm font-semibold text-[#111827] mb-2">
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
            <label htmlFor="password" className="block text-sm font-semibold text-[#111827] mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                minLength={8}
                required
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d32626] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111827]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <img
                    src="/img/icon/visibility.svg"
                    alt="Hide password"
                    className="h-5 w-5"
                    style={{ filter: "brightness(0)" }}
                  />
                ) : (
                  <img
                    src="/img/icon/visibility_off.svg"
                    alt="Show password"
                    className="h-5 w-5"
                    style={{ filter: "brightness(0)" }}
                  />
                )}
              </button>
            </div>
          </div>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded border-[#d1d5db] cursor-pointer accent-[#d32626]"
            />
            <span className="ml-2 text-sm text-[#6b7280]">
              Saya setuju dengan Syarat & Ketentuan .id
            </span>
          </label>

          <button
            type="submit"
            disabled={!agreeTerms || isLoading}
            className="w-full bg-[#d32626] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#b91f1f] transition disabled:opacity-75 mt-2"
          >
            {isLoading ? "Sedang memproses..." : "Daftar Sekarang"}
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5e7eb]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#6b7280]">atau daftar dengan</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-2 border border-[#e5e7eb] text-[#111827] font-semibold py-3 px-4 rounded-lg hover:bg-[#f9fafb] transition"
          >
            Google
          </button>
        </form>
      </div>
    </div>
  );
}