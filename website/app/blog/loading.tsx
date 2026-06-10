export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#0F172A]">
      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
          <div className="h-3 w-36 animate-pulse rounded-full bg-[#D9E2EC]" />
          <div className="mt-5 h-14 w-48 animate-pulse rounded-xl bg-[#D9E2EC]" />
          <div className="mt-5 h-5 max-w-2xl animate-pulse rounded-full bg-[#D9E2EC]" />
        </div>
      </section>
      <section className="mx-auto grid max-w-[1450px] gap-6 px-6 py-14 sm:px-8 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm">
            <div className="h-56 animate-pulse bg-[#D9E2EC]" />
            <div className="space-y-4 p-6">
              <div className="h-3 w-28 animate-pulse rounded-full bg-[#D9E2EC]" />
              <div className="h-7 animate-pulse rounded-lg bg-[#D9E2EC]" />
              <div className="h-4 animate-pulse rounded-full bg-[#D9E2EC]" />
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-[#D9E2EC]" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
