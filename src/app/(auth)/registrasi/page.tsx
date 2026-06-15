import HeroSection from "../hero_section";
import RegisterForm from "./_components/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Section - sama style dengan login */}
      <HeroSection />
      {/* Right Section - disamakan dengan login */}
      <RegisterForm />
    </div>
  );
}
