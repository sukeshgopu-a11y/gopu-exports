export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header skeleton */}
      <div className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
          <div className="h-4 w-32 rounded bg-[#E2E8F0] animate-pulse" />
          <div className="mt-4 h-10 w-48 rounded bg-[#E2E8F0] animate-pulse" />
          <div className="mt-4 h-4 w-96 rounded bg-[#E2E8F0] animate-pulse" />
        </div>
      </div>
      {/* Grid skeleton */}
      <div className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#D9E2EC] bg-white overflow-hidden">
              <div className="h-56 animate-pulse bg-[#E2E8F0]" />
              <div className="p-5 space-y-2">
                <div className="h-4 w-3/4 rounded bg-[#E2E8F0] animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-[#E2E8F0] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
