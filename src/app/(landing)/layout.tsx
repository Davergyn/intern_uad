import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

/**
 * Layout untuk semua halaman publik (Landing Group).
 * Menyediakan Navbar dan Footer secara otomatis — halaman di dalam grup ini
 * TIDAK perlu mengimport Navbar/Footer sendiri.
 *
 * Route group (landing) tidak mempengaruhi URL:
 *   - (landing)/page.tsx        → /
 *   - (landing)/about/page.tsx  → /about
 *   - (landing)/events/...      → /events/...
 *   - dst.
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
