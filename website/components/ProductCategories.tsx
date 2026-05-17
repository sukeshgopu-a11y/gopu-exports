import Image from "next/image";
import Link from "next/link";

export default function ProductCategories() {

  const products = [
    {
      title: "Basmati Rice",
      image: "/products/rice.jpg",
      description:
        "Premium export-quality rice with international packaging support.",
    },
    {
      title: "Indian Spices",
      image: "/products/red-chilli.jpg",
      description:
        "Carefully sourced spices suitable for wholesale global distribution.",
    },
    {
      title: "Turmeric Products",
      image: "/products/turmeric.jpg",
      description:
        "Export-ready turmeric products for food and retail industries.",
    },
  ];

  return (
    <section className="bg-[#F5F7FA] py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0E7490]">

              Product Categories

            </p>

            <h2 className="mt-4 text-5xl font-black leading-tight tracking-tight text-[#0F172A]">

              Export Products Built For International Buyers

            </h2>

          </div>

          <Link
            href="/products"
            className="rounded-md bg-[#0E7490] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#0A5A70]"
          >
            View All Products
          </Link>

        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">

          {products.map((product) => (

            <div
              key={product.title}
              className="overflow-hidden rounded-[2rem] border border-[#D9E2EC] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="relative h-[280px]">

                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="p-8">

                <h3 className="text-3xl font-bold text-[#0F172A]">

                  {product.title}

                </h3>

                <p className="mt-5 leading-8 text-[#64748B]">

                  {product.description}

                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}