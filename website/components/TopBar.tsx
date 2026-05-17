export default function TopBar() {

  return (
    <div className="border-b border-[#0B3A4A] bg-[#0F172A]">

      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-3 text-sm text-white lg:flex-row lg:items-center lg:justify-between">

        <div className="flex flex-wrap items-center gap-6">

          <p>
            info@gopuexports.com
          </p>

          <p>
            +91 87128 16876
          </p>

        </div>

        <div className="flex items-center gap-5 text-sm text-slate-300">

          <p>LinkedIn</p>

          <p>Facebook</p>

          <p>YouTube</p>

        </div>

      </div>

    </div>
  );
}