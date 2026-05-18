type DataPoint = { month: string; inquiries: number };

const EMPTY_YEAR: DataPoint[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
].map((month) => ({ month, inquiries: 0 }));

export default function InquiryChart({ data = EMPTY_YEAR }: { data?: DataPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.inquiries));

  return (
    <div className="w-full">
      <div className="flex items-end gap-1.5 h-48">
        {data.map(({ month, inquiries }) => {
          const pct = (inquiries / max) * 100;
          return (
            <div
              key={month}
              title={`${month}: ${inquiries} inquiries`}
              className="flex-1 flex flex-col items-center gap-1 group cursor-default"
            >
              <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition">
                {inquiries}
              </span>
              <div
                className="w-full rounded-t-md bg-[#0E7490]/70 group-hover:bg-[#0E7490] transition-all duration-200"
                style={{ height: `${pct}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5 mt-2">
        {data.map(({ month }) => (
          <div key={month} className="flex-1 text-center text-[10px] text-gray-400">
            {month}
          </div>
        ))}
      </div>
    </div>
  );
}
