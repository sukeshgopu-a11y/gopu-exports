"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-[48px]">⚠️</p>
      <h2 className="mt-4 text-[22px] font-bold text-[#0F172A]">Dashboard Error</h2>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        {error.message || "Something went wrong loading this dashboard page."}
      </p>
      <button
        onClick={reset}
        className="mt-5 rounded-xl bg-[#0E7490] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0A5A70]"
      >
        Retry
      </button>
    </div>
  );
}
