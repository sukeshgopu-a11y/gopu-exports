type DataPoint = { month: string; inquiries: number };

const DATA: DataPoint[] = [
  { month: "Jan", inquiries: 18 },
  { month: "Feb", inquiries: 24 },
  { month: "Mar", inquiries: 32 },
  { month: "Apr", inquiries: 27 },
  { month: "May", inquiries: 41 },
  { month: "Jun", inquiries: 38 },
  { month: "Jul", inquiries: 52 },
  { month: "Aug", inquiries: 46 },
  { month: "Sep", inquiries: 60 },
  { month: "Oct", inquiries: 55 },
  { month: "Nov", inquiries: 70 },
  { month: "Dec", inquiries: 64 },
];

export default function InquiryChart() {
  const max = Math.max(...DATA.map((d) => d.inquiries));

  return (
    <div className="w-full">
      <div className="flex items-end gap-1.5 h-48">
        {DATA.map(({ month, inquiries }) => {
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
        {DATA.map(({ month }) => (
          <div key={month} className="flex-1 text-center text-[10px] text-gray-400">
            {month}
          </div>
        ))}
      </div>
    </div>
  );
}
