export default function DashboardLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-100 border-t-[#0E7490]" />
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    </div>
  );
}
