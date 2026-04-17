export default function VulnCard({
  title,
  vulnerable,
  children,
}: {
  title: string;
  vulnerable: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-gray-900 p-5 rounded-xl border border-gray-700 w-full max-w-3xl">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span
          className={`text-sm font-bold ${
            vulnerable ? "text-red-500" : "text-green-500"
          }`}
        >
          {vulnerable ? "VULNERABLE" : "SAFE"}
        </span>
      </div>

      <div className="text-sm text-gray-300">{children}</div>
    </div>
  );
}