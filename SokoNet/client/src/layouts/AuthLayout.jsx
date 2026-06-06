export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,200,83,0.16),transparent_25%)]" />
        <div className="relative w-full max-w-4xl overflow-hidden rounded-[32px] border border-slate-800/75 bg-slate-950/95 shadow-soft backdrop-blur-xl sm:px-10 sm:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
