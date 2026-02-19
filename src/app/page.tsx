export const dynamic = "force-dynamic";

import Image from "next/image";
import AuthButton from "@/components/AuthButton";
import PhonePicker from "@/components/PhonePicker";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="VN Phone"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="leading-tight">
              <h1 className="text-base font-extrabold tracking-tight text-brand-navy">
                VN Phone
              </h1>
              <p className="text-[10px] font-medium text-gray-400">
                ผ่อนง่าย บัตรใบเดียว
              </p>
            </div>
          </div>
          <AuthButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-navy">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-yellow blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-brand-yellow blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-2xl px-4 py-10 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand-yellow/15 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow animate-pulse-glow" />
            <span className="text-xs font-semibold text-brand-yellow">
              เปิดรับลูกค้าทุกวัน
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            ผ่อนมือถือง่ายๆ
          </h2>
          <p className="mt-1 text-lg font-bold text-brand-yellow sm:text-xl">
            แค่บัตรประชาชนใบเดียว
          </p>
          <p className="mt-3 text-sm text-gray-300">
            เครื่องศูนย์แท้ 100% รับประกัน 1 ปีเต็ม จ่ายดาวน์รับเครื่องได้เลย
          </p>
        </div>
      </section>

      {/* USP Cards */}
      <section className="mx-auto -mt-5 max-w-2xl px-4">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: "✓", title: "ศูนย์แท้", desc: "100% ของแท้" },
            { icon: "🛡", title: "ประกัน 1 ปี", desc: "เคลมฟรี" },
            { icon: "⚡", title: "รับเครื่องเลย", desc: "จ่ายดาวน์วันนี้" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm"
            >
              <div className="mb-1 text-xl">{item.icon}</div>
              <div className="text-xs font-bold text-brand-navy">
                {item.title}
              </div>
              <div className="text-[10px] text-gray-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Phone Picker Section */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <h3 className="text-lg font-extrabold text-brand-navy">
            เช็คราคาเครื่อง
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">
            เลือกรุ่น → ความจุ → จำนวน → ดูราคา
          </p>
        </div>
        <PhonePicker />
      </main>

      {/* Contact & Branches */}
      <section className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-8">
          {/* Phone CTA */}
          <a
            href="tel:099-439-5550"
            className="mb-6 flex items-center justify-center gap-3 rounded-2xl bg-brand-navy p-4 transition active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow">
              <svg
                className="h-5 w-5 text-brand-navy"
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
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-wide text-white">
                099-439-5550
              </div>
              <div className="text-[10px] text-gray-400">
                โทรสอบถาม / นัดรับเครื่อง
              </div>
            </div>
          </a>

          {/* Branches */}
          <h4 className="mb-3 text-sm font-bold text-brand-navy">สาขา</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 bg-brand-gray p-3.5">
              <div className="mb-0.5 flex items-center gap-1.5">
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
                <span className="text-xs font-bold text-brand-navy">
                  รังสิต คลองสาม
                </span>
              </div>
              <p className="text-[10px] leading-relaxed text-gray-500">
                พหลโยธิน 65/1
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-brand-gray p-3.5">
              <div className="mb-0.5 flex items-center gap-1.5">
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
                <span className="text-xs font-bold text-brand-navy">
                  นวนคร
                </span>
              </div>
              <p className="text-[10px] leading-relaxed text-gray-500">
                ตลาดไท
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-brand-navy">
        <div className="mx-auto max-w-2xl px-4 py-5 text-center">
          <p className="text-xs text-gray-400">
            VN Phone &copy; {new Date().getFullYear()} &middot; ผ่อนมือถือ
            บัตรประชาชนใบเดียว
          </p>
        </div>
      </footer>
    </div>
  );
}
