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
