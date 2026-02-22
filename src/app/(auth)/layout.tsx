export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-aurora relative flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <p className="mx-auto inline-flex rounded-full border border-brand-navy/20 bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-brand-navy/70">
            Internal Staff Workspace
          </p>
          <h1 className="mt-4 bg-gradient-to-r from-brand-navy via-brand-navy-light to-brand-yellow-dark bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            VN Phone
          </h1>
          <p className="mt-1 text-sm text-brand-navy/65">Staff Tool</p>
        </div>
        {children}
      </div>
    </div>
  );
}
