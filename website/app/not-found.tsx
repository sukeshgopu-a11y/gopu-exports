import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-[#FFF9EF] px-6 py-20 text-[#14231B]">
      <div className="mx-auto max-w-3xl border border-[#D8C7A3] bg-white p-8 sm:p-12">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#7A5A20]">Page not found</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
          This page is not available.
        </h1>
        <p className="mt-5 text-[15px] leading-8 text-[#64748B]">
          The requested page may have moved, or the product/resource may no longer be publicly available.
          You can return to the product catalogue or contact GOPU Exports with your requirement.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/products" className="rounded-md bg-[#0B5A3B] px-6 py-3 text-center text-sm font-bold text-white">
            View Products
          </Link>
          <Link href="/contact" className="rounded-md border border-[#D8C7A3] px-6 py-3 text-center text-sm font-bold text-[#14231B]">
            Contact GOPU Exports
          </Link>
          <Link href="/" className="rounded-md border border-[#D8C7A3] px-6 py-3 text-center text-sm font-bold text-[#14231B]">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
