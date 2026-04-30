import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import "./style/style.css";
// import Navbar from "@/components/Navbar";

// ========================== i temporary changed the font to lexend ==========================
const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: ".id Academy – Elevate Your Skills",
  description: "Program edukatif dari PANDI untuk pemahaman mendalam ekosistem digital Indonesia.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lexend.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
