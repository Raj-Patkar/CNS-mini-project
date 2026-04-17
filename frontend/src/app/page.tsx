import ScanForm from "@/components/ScanForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Nav */}
      <nav className="w-full px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            ShieldProbe
          </span>
          <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
            Vulnerability Scanner
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
          <span className="hover:text-slate-700 cursor-pointer transition-colors">Docs</span>
          <span className="hover:text-slate-700 cursor-pointer transition-colors">API</span>
          <button className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs hover:bg-slate-700 transition-colors">
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center pt-16 pb-10 px-4 text-center">
        <span className="text-xs font-semibold bg-red-50 text-red-500 px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
          Security Scanner
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-3">
          Web Vulnerability Scanner
        </h1>
        <p className="text-slate-400 text-base max-w-md">
          Detect SQL injection, XSS, auth bypass, and missing security headers in seconds.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-4 pb-16">
        <ScanForm />
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-300 py-6">
        VulnScan · For authorized testing only
      </div>
    </main>
  );
}
