interface StatCardProps {
  title: string;
  value: string;
}

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition duration-300">

      <p className="text-gray-500 text-lg mb-4">
        {title}
      </p>

      <h2 className="text-6xl font-extrabold text-[#0F172A]">
        {value}
      </h2>

    </div>
  );
}