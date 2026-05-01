"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);

		window.setTimeout(() => {
			setIsSubmitting(false);
		}, 1200);
	};

	return (
		<main className="relative min-h-screen overflow-hidden bg-white px-4 py-10 text-[#7e8aa7] sm:px-6 lg:px-8">
			<div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center">
				<section className="w-full max-w-[700px] rounded-[28px] border border-[#c51f1f] bg-[#d32626] px-6 py-12 shadow-[0_18px_45px_rgba(211,38,38,0.18)] sm:px-10 sm:py-14 lg:px-16 lg:py-16">
					<div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
						<h1 className="text-[2rem] font-semibold leading-none tracking-[0.01em] text-white sm:text-[2.25rem] lg:text-[2.5rem]">
							Account Recovery
						</h1>
						<p className="mt-4 text-[1.04rem] leading-8 text-[#f4f6ff] sm:text-[1.08rem]">
							Enter the email address associated with your account.
						</p>

						<form onSubmit={handleSubmit} className="mt-14 w-full text-left">
							<label htmlFor="email" className="mb-2 block text-[1rem] font-medium text-white">
								Email <span className="text-[#ff7189]">*</span>
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="Please input your registered email"
								required
								className="h-[62px] w-full rounded-2xl border border-[#f0b9b9] bg-white px-4 text-[1.02rem] text-[#42526b] outline-none transition placeholder:text-[#afbad0] focus:border-[#f0b9b9] focus:ring-4 focus:ring-[#f8d7d7]"
							/>

							<button
								type="submit"
								disabled={isSubmitting}
								className="mt-10 flex h-[50px] w-full items-center justify-center rounded-xl bg-white text-[1.03rem] font-medium text-[#d32626] shadow-[0_10px_22px_rgba(255,255,255,0.18)] transition hover:bg-[#f8f8f8] focus:outline-none focus:ring-4 focus:ring-[#ffdcdc] disabled:cursor-not-allowed disabled:opacity-80"
							>
								{isSubmitting ? "Sending..." : "Reset Password"}
							</button>

							<p className="mt-16 text-center text-[1.02rem] text-[#fff1f1] sm:text-[1.05rem]">
								Already have an account?{' '}
								<Link href="/auth/login" className="font-medium text-white underline-offset-4 transition hover:underline">
									Login
								</Link>
							</p>
						</form>
					</div>
				</section>
			</div>
		</main>
	);
}
