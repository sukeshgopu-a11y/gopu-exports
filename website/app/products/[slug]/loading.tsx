export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1450px] px-6 py-3 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="h-3 w-12 rounded bg-[#E2E8F0] animate-pulse" />
            <div className="h-3 w-2 rounded bg-[#E2E8F0] animate-pulse" />
            <div className="h-3 w-16 rounded bg-[#E2E8F0] animate-pulse" />
          </div>
        </div>
      </div>
      <section className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="h-[480px] rounded-2xl bg-[#E2E8F0] animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 w-24 rounded bg-[#E2E8F0] animate-pulse" />
            <div className="h-12 w-3/4 rounded bg-[#E2E8F0] animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-[#E2E8F0] animate-pulse" />
            <div className="mt-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 rounded bg-[#E2E8F0] animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
