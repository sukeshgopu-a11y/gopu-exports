export default function BlogPostLoading() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#0F172A]">
      <article className="mx-auto max-w-4xl px-6 py-14 sm:px-8">
        <div className="h-4 w-28 animate-pulse rounded-full bg-[#D9E2EC]" />
        <div className="mt-8 h-3 w-64 animate-pulse rounded-full bg-[#D9E2EC]" />
        <div className="mt-5 h-14 animate-pulse rounded-xl bg-[#D9E2EC]" />
        <div className="mt-3 h-14 w-3/4 animate-pulse rounded-xl bg-[#D9E2EC]" />
        <div className="mt-6 h-5 animate-pulse rounded-full bg-[#D9E2EC]" />
        <div className="mt-10 h-[420px] animate-pulse rounded-2xl border border-[#D9E2EC] bg-white" />
        <div className="mt-10 space-y-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-4 animate-pulse rounded-full bg-[#D9E2EC]" />
          ))}
        </div>
      </article>
    </main>
  );
}
