/**
 * Layout untuk halaman autentikasi (Auth Group).
 * Route group ini TIDAK merender Navbar dan Footer.
 * Halaman auth ditampilkan full-screen tanpa element UI global.
 *
 * Route group (auth) tidak mempengaruhi URL:
 *   - (auth)/auth/login/page.tsx      → /login
 *   - (auth)/auth/registrasi/page.tsx → /registrasi
 *   - (auth)/auth/forgot-password/... → /forgot-password/...
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
