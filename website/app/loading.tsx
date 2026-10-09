export default function RootLoading() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-sm text-slate-600">Loading page…</p>
      <div aria-hidden="true" className="h-8 w-8 animate-spin rounded-full border-4 border-[#E2E8F0] border-t-[#0E7490]" />
    </div>
  );
}
