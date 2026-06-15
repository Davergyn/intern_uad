import React from "react";
import { db } from "@/db";
import { trainers, eventRegistrations } from "@/db/schema";
import { count, countDistinct, eq } from "drizzle-orm";

export default async function HeroSection() {
  // Query: Hitung total trainers yang aktif
  const totalTrainersResult = await db
    .select({ count: count() })
    .from(trainers)
    .where(eq(trainers.isActive, true));
  const totalTrainers = totalTrainersResult[0]?.count || 0;

  // Query: Hitung total users unik yang sudah mendaftar event
  const totalUsersResult = await db
    .select({ count: countDistinct(eventRegistrations.userId) })
    .from(eventRegistrations);
  const totalActiveUsers = totalUsersResult[0]?.count || 0;

  return (
    <section className="relative hidden min-h-screen w-full overflow-hidden bg-[#d32626] text-white lg:flex lg:w-1/2">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-28 h-[480px] w-[480px] rounded-full border border-white/16" />
        <div className="absolute -top-16 right-[-180px] h-[560px] w-[560px] rounded-full border border-white/14" />
        <div className="absolute bottom-[-240px] left-[-120px] h-[640px] w-[640px] rounded-full border border-white/14" />
      </div>

      <div className="relative flex w-full flex-col px-10 py-14 xl:px-14 xl:py-16">
        <div>
          <p className="text-3xl font-extrabold leading-none tracking-tight">
            <span className="text-white">.id</span>
            <span className="ml-1 text-white">academy</span>
          </p>

          <h1 className="mt-8 max-w-xl text-5xl font-black leading-[1.05] tracking-tight xl:text-6xl">
            Mulai Perjalanan
            <br />
            Digital Anda Hari Ini.
          </h1>

          <p className="mt-7 max-w-xl text-2xl leading-relaxed text-white/95 xl:text-3xl">
            Akses ratusan materi pembelajaran, event eksklusif, dan bergabunglah
            dengan komunitas profesional digital terbesar di Indonesia.
          </p>
        </div>

        <div className="mt-10">
          <div className="h-px w-full bg-white/28" />
          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-5">
            <div className="text-center">
              <p className="text-4xl font-black leading-none">
                {totalActiveUsers}+
              </p>
              <p className="mt-2 text-xl font-semibold text-white/95">
                Peserta Aktif
              </p>
            </div>
            <div className=" text-center ">
              <p className="text-4xl font-black leading-none">
                {totalTrainers}+
              </p>
              <p className="mt-2 text-xl font-semibold text-white/95">
                Narasumber
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black leading-none">4.9/5</p>
              <p className="mt-2 text-xl font-semibold text-white/95">
                Rating Platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
