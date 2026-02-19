export const dynamic = "force-dynamic";

import Image from "next/image";
import AuthButton from "@/components/AuthButton";
import PhonePicker from "@/components/PhonePicker";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#f2f4fb] text-brand-navy">
      <BackgroundAura />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-brand-navy/10 bg-brand-navy/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="VN Phone"
              width={36}
              height={36}
              className="rounded-full ring-2 ring-brand-yellow/40"
            />
            <div className="leading-none">
              <span className="text-[15px] font-extrabold text-white">
                VN Phone
              </span>
              <p className="mt-0.5 text-[10px] font-medium text-brand-yellow/70">
                เช็คราคาไว ผ่อนง่าย
              </p>
            </div>
          </div>
          <AuthButton />
        </div>
      </header>

      {/* Hero */}
      <section className="relative pb-20 pt-8">
        <div className="mx-auto max-w-xl px-4">
          <div className="animate-fade-in-up rounded-[30px] border border-white/40 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy p-6 text-center shadow-[0_20px_60px_rgba(30,42,94,0.35)]">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-yellow/20 px-3 py-1 text-[11px] font-semibold text-brand-yellow">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
              เปิดรับลูกค้าทุกวัน
            </span>

            <h1 className="mt-4 text-[30px] font-black leading-[1.15] text-white sm:text-[34px]">
              ผ่อนมือถือได้ทันที
              <br />
              <span className="text-brand-yellow">ใช้แค่บัตรประชาชนใบเดียว</span>
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              เลือกรุ่นที่ต้องการ แล้วเช็คราคาได้เลยทันที เห็นยอดชัดเจนก่อนตัดสินใจ
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Usp label="ศูนย์แท้ 100%" />
              <Usp label="ประกัน 1 ปี" />
              <Usp label="รับเครื่องทันที" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2.5">
              <StatPill value="2 สาขา" label="รังสิต / นวนคร" delayMs={0} />
              <StatPill value="ศูนย์แท้" label="เครื่องแท้ 100%" delayMs={220} />
              <StatPill value="ผ่อนง่าย" label="บัตร ปชช. ใบเดียว" delayMs={440} />
            </div>
          </div>
        </div>
      </section>

      {/* Price Checker — Main Section */}
      <main className="relative mx-auto -mt-12 max-w-xl px-4 pb-10">
        <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-navy/45">
          เลือกรุ่นเพื่อเช็คราคา
        </p>
        <PhonePicker />
      </main>

      {/* Contact & Branches */}
      <section className="border-t border-brand-navy/10 bg-white/75 backdrop-blur-sm">
        <div className="mx-auto max-w-xl px-4 py-8">
          {/* Call CTA */}
          <a
            href="tel:099-439-5550"
            className="group flex items-center gap-4 rounded-3xl border border-brand-navy/10 bg-brand-navy p-5 shadow-[0_16px_40px_rgba(20,29,69,0.25)] transition-transform active:scale-[0.98]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-yellow transition-transform group-hover:scale-105">
              <PhoneIcon className="h-5 w-5 text-brand-navy" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-yellow/80">
                สายด่วน VN Phone
              </p>
              <div className="text-[22px] font-black tracking-wide text-white">
                099-439-5550
              </div>
              <div className="text-[11px] text-gray-300">
                โทรสอบถาม / นัดรับเครื่อง
              </div>
            </div>
          </a>

          {/* Branches */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <BranchCard name="รังสิต คลองสาม" detail="พหลโยธิน 65/1" />
            <BranchCard name="นวนคร" detail="ตลาดไท" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-navy/10 bg-brand-navy-dark py-5 text-center">
        <p className="text-[10px] text-gray-400">
          &copy; {new Date().getFullYear()} VN Phone | ผ่อนมือถือ บัตรประชาชนใบเดียว
        </p>
      </footer>

      {/* Floating Call Button */}
      <a
        href="tel:099-439-5550"
        aria-label="โทรหาร้าน"
        className="animate-pulse-glow fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow shadow-[0_12px_28px_rgba(255,193,7,0.45)] transition-transform active:scale-90 lg:hidden"
      >
        <PhoneIcon className="h-6 w-6 text-brand-navy" />
      </a>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function Usp({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/85">
      {label}
    </span>
  );
}

function StatPill({
  value,
  label,
  delayMs = 0,
}: {
  value: string;
  label: string;
  delayMs?: number;
}) {
  return (
    <div
      className="animate-float-soft rounded-2xl border border-white/10 bg-white/10 px-2.5 py-3"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="text-sm font-black text-brand-yellow">{value}</div>
      <div className="mt-0.5 text-[10px] font-medium text-white/65">{label}</div>
    </div>
  );
}

function BranchCard({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-brand-navy/10 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-1.5">
        <svg
          className="h-4 w-4 text-brand-yellow"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-bold text-brand-navy">{name}</span>
      </div>
      <p className="mt-1 pl-5 text-xs text-gray-500">{detail}</p>
    </div>
  );
}

function BackgroundAura() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-44 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand-yellow/25 blur-3xl" />
      <div className="absolute -right-32 top-32 h-72 w-72 rounded-full bg-brand-navy/12 blur-3xl" />
      <div className="absolute -left-28 bottom-20 h-60 w-60 rounded-full bg-brand-yellow/12 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,0.55)_100%)]" />
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
