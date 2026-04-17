import ScanForm from "@/components/ScanForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        🔐 Web Vulnerability Scanner
      </h1>

      <ScanForm />
    </main>
  );
}