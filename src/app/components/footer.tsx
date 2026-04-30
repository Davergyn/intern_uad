import React from "react";

const companyLinks = ["About us", "Careers", "Premium Tools", "Blog"];
const pageLinks = ["Login", "Register", "Add List", "Contact"];
const legalLinks = ["Terms", "Privacy", "Team"];

function SocialIcon({ children, label }: { children: React.ReactNode; label: string }) {
	return (
		<a className="footer-social-link" href="#" aria-label={label}>
			{children}
		</a>
	);
}

export default function Footer() {
	return (
		<footer className="alt1-footer">
			<div className="alt1-footer-inner">
				<div className="alt1-footer-brand">
					<div className="alt1-footer-logo">
						<span className="alt1-footer-logo-id">.id</span>
						<span className="alt1-footer-logo-academy">academy</span>
					</div>
					<p>
						pengembangan kapasitas digital oleh PANDI inspirasi indonesia yang lebih
						terhubung
					</p>
				</div>

				<nav className="alt1-footer-col" aria-label="Company">
					<h3>Company</h3>
					<ul>
						{companyLinks.map((item) => (
							<li key={item}>
								<a href="#">{item}</a>
							</li>
						))}
					</ul>
				</nav>

				<nav className="alt1-footer-col" aria-label="Pages">
					<h3>Pages</h3>
					<ul>
						{pageLinks.map((item) => (
							<li key={item}>
								<a href="#">{item}</a>
							</li>
						))}
					</ul>
				</nav>

				<nav className="alt1-footer-col" aria-label="Legal">
					<h3>Legal</h3>
					<ul>
						{legalLinks.map((item) => (
							<li key={item}>
								<a href="#">{item}</a>
							</li>
						))}
					</ul>
				</nav>

				<div className="alt1-footer-social">
					<h3>Ikuti kami</h3>
					<div className="alt1-footer-social-row">
						<SocialIcon label="Instagram">
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
								<circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
								<circle cx="16.7" cy="7.3" r="1" fill="currentColor" />
							</svg>
						</SocialIcon>
						<SocialIcon label="Twitter">
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<path d="M19.8 7.1c-.6.3-1.2.5-1.9.6.7-.4 1.2-1 1.5-1.8-.6.4-1.3.6-2 .8a3.1 3.1 0 0 0-5.5 2c0 .2 0 .5.1.7-2.6-.1-4.9-1.4-6.4-3.4-.3.5-.4 1-.4 1.6 0 1 .5 1.9 1.3 2.4-.5 0-1-.1-1.5-.4v.1c0 1.4 1 2.6 2.3 2.8-.2.1-.5.1-.8.1-.2 0-.4 0-.6-.1.4 1.2 1.5 2.1 2.8 2.2A6.2 6.2 0 0 1 4 17.3a8.7 8.7 0 0 0 4.7 1.4c5.6 0 8.8-4.7 8.8-8.8v-.4c.6-.4 1.2-1 1.6-1.6-.6.3-1.2.5-1.9.6.7-.5 1.2-1 1.6-1.8Z" fill="currentColor" />
							</svg>
						</SocialIcon>
						<SocialIcon label="YouTube">
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<rect x="4" y="6.5" width="16" height="11" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
								<path d="M10 10.2v3.6l3.5-1.8L10 10.2Z" fill="currentColor" />
							</svg>
						</SocialIcon>
					</div>
				</div>
			</div>

			<div className="alt1-footer-divider" />

			<p className="alt1-footer-copy">© 2026 Made with Love by PANDI (Pengelola Nama Domain Internet Indonesia).</p>
		</footer>
	);
}
