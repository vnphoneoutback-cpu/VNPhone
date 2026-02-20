export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-yellow tracking-tight">
            VN Phone
          </h1>
          <p className="text-white/60 text-sm mt-1">Staff Tool</p>
        </div>
        {children}
      </div>
    </div>
  );
}
