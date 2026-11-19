import type { Metadata } from "next";
import { Suspense } from "react";
import { TechLines } from "@/components/site/TechLines";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-wrap">
      {/* Left: the same water-blue background and moving water lines as the site's headers */}
      <div className="relative flex min-h-[220px] flex-[1_1_420px] items-end overflow-hidden bg-[linear-gradient(180deg,#2a7cbf_0%,#1d63a8_40%,#0e4488_75%,#0a3471_100%)] p-10 text-white">
        <TechLines />
        <div className="relative">
          <p className="text-[25px] font-extrabold leading-none">Hydraulic Program</p>
          <p className="font-display mt-3 text-[30px] leading-tight">
            <span className="block text-[22px] text-white/70">Staff</span>dashboard.
          </p>
        </div>
      </div>

      {/* Right: the form */}
      <div className="flex flex-[1_1_420px] items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-[380px]">
          <h1 className="font-display border-b-2 border-accent pb-5 text-[32px] font-medium text-navy">Log in</h1>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
      </div>
      <div className="bg-accent px-4 py-2.5 text-[11px] font-semibold text-white">
        Staff only. Ask an administrator if you need an account.
      </div>
    </div>
  );
}
