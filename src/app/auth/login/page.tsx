"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		// Simulasi login
		setTimeout(() => {
			setIsLoading(false);
			router.push("/dashboard");
		}, 1500);
	};
    const [showPassword, setShowPassword] = useState(false);
	const handleGoogleLogin = () => {
		// Implementasi Google OAuth
		console.log("Login dengan Google");
	};

	return (
		<div className="min-h-screen flex">
			{/* Left Section - Red Background */}
			<div className="hidden lg:flex w-1/2 bg-[#d32626] text-white flex-col justify-between p-12 relative overflow-hidden">
				{/* Decorative Shapes */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute left-0 top-0 h-44 w-44 bg-white" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
					<div className="absolute right-0 top-0 h-44 w-44 rounded-bl-[7rem] bg-white" />
					<div className="absolute right-0 bottom-0 h-56 w-56 rounded-tl-[8rem] bg-white" />
					<div className="absolute left-1/2 top-[-5rem] h-40 w-40 -translate-x-1/2 rounded-full border-[22px] border-white" />
				</div>

				{/* Logo */}
				<div className="relative z-10">
					<p className="text-sm font-bold">
						<span className="text-white">.id</span>
						<span className="text-white/70"> academy</span>
					</p>
				</div>

				{/* Main Content */}
				<div className="relative z-10">
					<h1 className="text-5xl font-black leading-tight mb-6">
						Mulai Perjalanan Digital Anda Hari Ini.
					</h1>
					<p className="text-white/95 text-lg leading-8 max-w-md">
						Akses ratusan materi pembelajaran, event eksklusif, dan bergabunglah dengan komunitas profesional digital terbesar di Indonesia.
					</p>
				</div>

				{/* Stats */}
				<div className="relative z-10 flex gap-10">
					<div>
						<p className="text-4xl font-black">5000+</p>
						<p className="text-white/80 text-sm mt-1">Peserta Aktif</p>
					</div>
					<div>
						<p className="text-4xl font-black">1000+</p>
						<p className="text-white/80 text-sm mt-1">Narasumber</p>
					</div>
					<div>
						<p className="text-4xl font-black">4.9/5</p>
						<p className="text-white/80 text-sm mt-1">Rating Platform</p>
					</div>
				</div>
			</div>

			{/* Right Section - White Background */}
			<div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
				{/* Back Button */}
				<div className="w-full max-w-md mb-8">
					<Link
						href="/"
						className="inline-flex items-center text-sm text-[#6b7280] hover:text-[#111827] transition"
					>
						<span className="mr-2">←</span>
						Kembali ke Beranda
					</Link>
				</div>

				{/* Tabs */}
				<div className="w-full max-w-md mb-8">
					<div className="flex gap-2 border-b border-[#e5e7eb]">
						<button className="px-6 py-3 font-bold text-[#111827] border-b-2 border-[#d32626]">
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
					<h2 className="text-2xl font-bold text-[#111827] mb-2">
						Selamat Datang Kembali!
					</h2>
					<p className="text-[#6b7280] text-sm">
						Silakan masuk ke akun id Academy Anda.
					</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
					{/* Email Input */}
					<div>
						<label htmlFor="email" className="block text-sm font-semibold text-[#111827] mb-2">
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="mail@email.com"
							required
							className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d32626] focus:border-transparent"
						/>
					</div>

					{/* Password Input */}
					{/* Password Input */}
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
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d32626] focus:border-transparent"
        />
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111827]"
            aria-label="Toggle password visibility"
        >
            {showPassword ? (
                <img src="/img/icon/visibility.svg" alt="Hide password" className="h-5 w-5" style={{ filter: "brightness(0)" }} />
            ) : (
                <img src="/img/icon/visibility_off.svg" alt="Show password" className="h-5 w-5" style={{ filter: "brightness(0)" }} />
            )}
        </button>
    </div>
</div>

					{/* Remember Me & Forgot Password */}
					<div className="flex items-center justify-between pt-2">
						<label className="flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={rememberMe}
								onChange={(e) => setRememberMe(e.target.checked)}
								className="w-4 h-4 rounded border-[#d1d5db] cursor-pointer accent-[#d32626]"
							/>
							<span className="ml-2 text-sm text-[#6b7280]">Ingat saya</span>
						</label>
						<Link
							href="/auth/forgot-password"
							className="text-sm text-[#d32626] hover:underline font-medium"
						>
							Lupa kata sandi?
						</Link>
					</div>

					{/* Login Button */}
					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-[#d32626] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#b91f1f] transition disabled:opacity-75 mt-6"
					>
						{isLoading ? "Sedang masuk..." : "Masuk ke Dashboard"}
					</button>

					{/* Divider */}
					<div className="relative py-2">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-[#e5e7eb]"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-[#6b7280]">atau masuk dengan</span>
						</div>
					</div>

					{/* Google Login */}
					<button
						type="button"
						onClick={handleGoogleLogin}
						className="w-full flex items-center justify-center gap-2 border border-[#e5e7eb] text-[#111827] font-semibold py-3 px-4 rounded-lg hover:bg-[#f9fafb] transition"
					>
						<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
							<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
							<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
							<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
							<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
						</svg>
						<span>Google</span>
					</button>
				</form>
			</div>
		</div>
	);
}
