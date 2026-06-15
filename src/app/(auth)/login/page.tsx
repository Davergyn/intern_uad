// Paksa halaman login menjadi dinamis agar HeroSection tidak mencoba
// query ke PostgreSQL saat build time (DATABASE_URL belum tersedia di Vercel).
export const dynamic = "force-dynamic";

import HeroSection from "../hero_section";
import LoginForm from "./_components/login-form";


export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Section - Red Background */}
      <HeroSection />

      {/* Right Section - White Background */}
      <LoginForm />
    </div>
  );
}
