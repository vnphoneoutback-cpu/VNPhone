export const dynamic = "force-dynamic";

import Image from "next/image";
import AuthButton from "@/components/AuthButton";
import PhonePicker from "@/components/PhonePicker";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-navy">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="VN Phone"
              width={34}
              height={34}
              className="rounded-full ring-2 ring-brand-yellow/30"
            />
            <div className="leading-none">
              <span className="text-sm font-extrabold text-white">
                VN Phone
              </span>
              <p className="mt-0.5 text-[9px] font-medium text-brand-yellow/70">
                ผ่อนง่าย บัตรใบเดียว
              </p>
            </div>
          </div>
          <AuthButton />
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-brand-navy pb-12 pt-8">
        {/* Decorative gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-brand-yellow/5 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-brand-yellow/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-xl px-4 text-center">
          <h1 className="text-[26px] font-black leading-tight text-white sm:text-3xl">
            ผ่อนมือถือง่ายๆ
            <br />
            <span className="text-brand-yellow">บัตรประชาชนใบเดียว</span>
          </h1>
          <div className="mx-auto mt-4 flex max-w-xs items-center justify-between rounded-full bg-white/8 px-5 py-2">
            <Usp label="ศูนย์แท้ 100%" />
            <div className="h-3 w-px bg-white/20" />
            <Usp label="ประกัน 1 ปี" />
            <div className="h-3 w-px bg-white/20" />
            <Usp label="รับเครื่องทันที" />
          </div>
        </div>
      </section>

      {/* Price Checker — Main Section */}
      <main className="relative mx-auto -mt-6 max-w-xl px-4 pb-8">
        <PhonePicker />
      </main>

      {/* Contact & Branches */}
      <section className="border-t border-gray-200/60 bg-white">
        <div className="mx-auto max-w-xl px-4 py-8">
          {/* Call CTA */}
          <a
            href="tel:099-439-5550"
            className="flex items-center gap-4 rounded-2xl bg-brand-navy p-4 transition-transform active:scale-[0.98]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-yellow">
              <PhoneIcon className="h-5 w-5 text-brand-navy" />
            </div>
            <div>
              <div className="text-[22px] font-black tracking-wide text-white">
                099-439-5550
              </div>
              <div className="text-[11px] text-gray-400">
                โทรสอบถาม / นัดรับเครื่อง
              </div>
            </div>
          </a>

          {/* Branches */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <BranchCard name="รังสิต คลองสาม" detail="พหลโยธิน 65/1" />
            <BranchCard name="นวนคร" detail="ตลาดไท" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-navy-dark py-4 text-center">
        <p className="text-[10px] text-gray-500">
          &copy; {new Date().getFullYear()} VN Phone &mdash; ผ่อนมือถือ
          บัตรประชาชนใบเดียว
        </p>
      </footer>

      {/* Floating Call Button */}
      <a
        href="tel:099-439-5550"
        aria-label="โทรหาร้าน"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow shadow-lg animate-pulse-glow transition-transform active:scale-90 lg:hidden"
      >
        <PhoneIcon className="h-6 w-6 text-brand-navy" />
      </a>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function Usp({ label }: { label: string }) {
  return (
    <span className="text-[11px] font-semibold text-white/80">{label}</span>
  );
}

function BranchCard({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="rounded-xl bg-[#f8f8fa] p-3.5">
      <div className="flex items-center gap-1.5">
        <svg
          className="h-3.5 w-3.5 text-brand-yellow"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-xs font-bold text-brand-navy">{name}</span>
      </div>
      <p className="mt-0.5 pl-5 text-[10px] text-gray-400">{detail}</p>
    </div>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}
