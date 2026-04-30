"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex bg-[#f3f4f6]">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-[#d32626] text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute left-0 top-0 h-[540px] w-[540px] rounded-full border border-white/40"
          />
          <div
            className="absolute left-[-60px] bottom-[-80px] h-[420px] w-[420px] rounded-full border border-white/35"
          />
          <div
            className="absolute right-[-80px] top-[220px] h-[420px] w-[420px] rounded-full border border-white/25"
          />
        </div>

        <div className="relative z-10">
          <p className="text-[38px] leading-none font-extrabold tracking-tight">
            <span className="text-white">.id</span>{" "}
            <span className="text-white/90 text-[36px] font-bold">academy</span>
          </p>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-black leading-[1.02] mb-7 max-w-xl">
            Mulai Perjalanan
            <br />
            Digital Anda Hari Ini.
          </h1>
          <p className="text-white/95 text-[34px] leading-[1.6] max-w-2xl">
            Akses ratusan materi pembelajaran, event eksklusif, dan bergabunglah
            dengan komunitas profesional digital terbesar di Indonesia.
          </p>
        </div>

        <div className="relative z-10 border-t border-white/25 pt-8 flex gap-14">
          <div>
            <p className="text-5xl font-black leading-none">5000+</p>
            <p className="text-white/90 text-[24px] mt-3">Peserta Aktif</p>
          </div>
          <div>
            <p className="text-5xl font-black leading-none">1000+</p>
            <p className="text-white/90 text-[24px] mt-3">Narasumber</p>
          </div>
          <div>
            <p className="text-5xl font-black leading-none">4.9/5</p>
            <p className="text-white/90 text-[24px] mt-3">Rating Platform</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10">
        <div className="w-full max-w-[560px] mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base font-semibold text-[#6b7280] hover:text-[#111827] transition"
          >
            <span>←</span>
            Kembali ke Beranda
          </Link>
        </div>

        <div className="w-full max-w-[560px] rounded-2xl bg-white border border-[#e5e7eb] shadow-sm p-7 sm:p-8">
          {/* Tabs */}
          <div className="mb-7 rounded-full bg-[#f7eeee] p-1 flex">
            <Link
              href="/auth/login"
              className="w-1/2 text-center rounded-full py-2.5 font-semibold text-[#6b7280] hover:text-[#111827] transition"
            >
              Masuk
            </Link>
            <button
              type="button"
              className="w-1/2 text-center rounded-full py-2.5 font-semibold bg-white text-[#111827] ring-1 ring-[#efdfdf]"
            >
              Daftar
            </button>
          </div>

          <div className="text-center mb-7">
            <h2 className="text-[40px] sm:text-[44px] font-black text-[#111827] leading-tight">
              Buat Akun Baru
            </h2>
            <p className="text-[#6b7280] text-[20px] mt-2">
              Bergabung bersama ribuan peserta lainnya.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-[15px] font-bold text-[#111827] mb-2">
                Nama Lengkap
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Osas"
                required
                className="w-full h-[52px] px-4 border border-[#e5e7eb] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#d32626] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[15px] font-bold text-[#111827] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full h-[52px] px-4 border border-[#e5e7eb] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#d32626] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[15px] font-bold text-[#111827] mb-2">
                Kata Sandi
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
                  className="w-full h-[52px] px-4 pr-12 border border-[#e5e7eb] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#d32626] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
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

            <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-[#d1d5db] accent-[#d32626]"
              />
              <span className="text-[14px] text-[#6b7280]">
                Saya setuju dengan Syarat & Ketentuan .id
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreeTerms || isLoading}
              className="w-full h-[52px] rounded-xl bg-[#d32626] text-white text-[18px] font-bold hover:bg-[#bb2323] transition disabled:opacity-60"
            >
              {isLoading ? "Memproses..." : "Daftar Sekarang"}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e7eb]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[14px] text-[#6b7280]">atau daftar dengan</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full h-[52px] rounded-xl border border-[#e5e7eb] text-[#111827] font-semibold hover:bg-[#f9fafb] transition"
            >
              Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}