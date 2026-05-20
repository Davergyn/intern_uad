"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { User, ShieldAlert, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

type ProfileData = {
  fullName: string;
  phone: string;
  bio: string;
  avatar: string;
};

const AVATAR_OPTIONS = [
  { id: "avatar-red", name: "Red Flare", class: "bg-gradient-to-tr from-[#CB2229] to-rose-400" },
  { id: "avatar-blue", name: "Ocean Breeze", class: "bg-gradient-to-tr from-blue-600 to-sky-400" },
  { id: "avatar-emerald", name: "Emerald Mint", class: "bg-gradient-to-tr from-emerald-600 to-teal-400" },
  { id: "avatar-violet", name: "Violet Magic", class: "bg-gradient-to-tr from-violet-600 to-indigo-400" },
  { id: "avatar-amber", name: "Sunset Gold", class: "bg-gradient-to-tr from-amber-500 to-orange-500" },
  { id: "avatar-dark", name: "Carbon Slate", class: "bg-gradient-to-tr from-slate-800 to-slate-550" },
];

export default function SettingsPage() {
  const { userEmail } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].id);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toast / Feedback State
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Load Profile from LocalStorage
  useEffect(() => {
    if (userEmail) {
      const stored = localStorage.getItem(`profile_${userEmail}`);
      if (stored) {
        try {
          const parsed: ProfileData = JSON.parse(stored);
          setFullName(parsed.fullName ?? "");
          setPhone(parsed.phone ?? "");
          setBio(parsed.bio ?? "");
          setSelectedAvatar(parsed.avatar ?? AVATAR_OPTIONS[0].id);
        } catch (e) {
          console.error("Error parsing stored profile:", e);
        }
      } else {
        // Default based on email
        const emailPrefix = userEmail.split("@")[0];
        setFullName(emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
      }
    }
  }, [userEmail]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!userEmail) return;

    const data: ProfileData = {
      fullName,
      phone,
      bio,
      avatar: selectedAvatar,
    };

    localStorage.setItem(`profile_${userEmail}`, JSON.stringify(data));
    setSuccessMsg("Profil Anda berhasil diperbarui!");
    
    // Clear toast after 4s
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!userEmail) return;

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Kata sandi baru minimal 6 karakter.");
      return;
    }

    // Check if current password is correct (checking against localStorage override or default json password)
    const storedOverride = localStorage.getItem(`password_${userEmail}`);
    // For mock users, user@gmail.com is "user123"
    const expectedCurrent = storedOverride || (userEmail === "user@gmail.com" ? "user123" : "");

    if (expectedCurrent && currentPassword !== expectedCurrent) {
      setErrorMsg("Kata sandi saat ini salah.");
      return;
    }

    // Save override
    localStorage.setItem(`password_${userEmail}`, newPassword);
    setSuccessMsg("Kata sandi Anda berhasil diperbarui!");
    
    // Reset password form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    // Clear toast after 4s
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const currentAvatarBg = AVATAR_OPTIONS.find((a) => a.id === selectedAvatar)?.class ?? AVATAR_OPTIONS[0].class;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">Pengaturan & Profil</h1>
        <p className="mt-1 text-slate-500">Kelola akun, edit profil, dan ganti kata sandi Anda.</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab("profile");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all ${
            activeTab === "profile"
              ? "border-[#CB2229] text-[#CB2229]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <User size={16} />
          Ubah Profil
        </button>
        <button
          onClick={() => {
            setActiveTab("password");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all ${
            activeTab === "password"
              ? "border-[#CB2229] text-[#CB2229]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <ShieldAlert size={16} />
          Keamanan Akun
        </button>
      </div>

      {/* Notification Toast */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <p className="text-sm font-semibold">{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <p className="text-sm font-semibold">{errorMsg}</p>
        </div>
      )}

      {/* Tab Contents */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {activeTab === "profile" ? (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              {/* Profile Avatar Showcase */}
              <div className="flex flex-col items-center gap-3">
                <div className={`grid h-24 w-24 place-items-center rounded-3xl ${currentAvatarBg} text-3xl font-black text-white shadow-lg`}>
                  {fullName ? fullName.charAt(0).toUpperCase() : (userEmail?.[0].toUpperCase() ?? "U")}
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avatar Utama</span>
              </div>

              {/* Avatar Options Picker */}
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-bold text-slate-800">Pilih Tema Avatar</label>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedAvatar(opt.id)}
                      className={`relative h-12 rounded-xl transition duration-150 ${opt.class} ${
                        selectedAvatar === opt.id
                          ? "ring-4 ring-offset-2 ring-[#CB2229]/50 scale-95"
                          : "opacity-85 hover:opacity-100 hover:scale-105"
                      }`}
                      title={opt.name}
                    >
                      {selectedAvatar === opt.id && (
                        <span className="absolute inset-0 flex items-center justify-center text-white">
                          <CheckCircle2 size={18} className="drop-shadow-sm" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Profile Inputs */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-bold text-slate-800">
                  Nama Lengkap
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#CB2229]"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-bold text-slate-800">
                  Nomor Telepon
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#CB2229]"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="bio" className="mb-2 block text-sm font-bold text-slate-800">
                  Bio Singkat
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tulis sedikit profil tentang Anda..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#CB2229]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#CB2229] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-700"
              >
                <Sparkles size={16} />
                Simpan Perubahan
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPass" className="mb-2 block text-sm font-bold text-slate-800">
                  Kata Sandi Saat Ini
                </label>
                <input
                  id="currentPass"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#CB2229]"
                />
              </div>

              <hr className="border-slate-100 my-4" />

              <div>
                <label htmlFor="newPass" className="mb-2 block text-sm font-bold text-slate-800">
                  Kata Sandi Baru
                </label>
                <input
                  id="newPass"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#CB2229]"
                />
              </div>

              <div>
                <label htmlFor="confirmPass" className="mb-2 block text-sm font-bold text-slate-800">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  id="confirmPass"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#CB2229]"
                />
              </div>
            </div>

            <div className="flex justify-start">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#CB2229] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-700"
              >
                Ganti Kata Sandi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
