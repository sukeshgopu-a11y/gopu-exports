"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-[48px]">⚠️</p>
      <h2 className="mt-4 text-[24px] font-black text-[#0F172A]">Something went wrong</h2>
      <p className="mt-2 max-w-md text-[15px] text-[#64748B]">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-[#0E7490] px-6 py-3 text-[13px] font-bold text-white transition hover:bg-[#0A5A70]"
      >
        Try Again
      </button>
    </div>
  );
}
