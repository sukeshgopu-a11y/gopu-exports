import Image from "next/image";

import Container from "./Container";
import Button from "./Button";

export default function ProductsPreview() {

  const products = [
    {
      name: "Guntur Red Chilli",
      image: "/products/red-chilli.jpg",
    },
    {
      name: "Turmeric Fingers",
      image: "/products/turmeric.jpg",
    },
    {
      name: "Basmati Rice",
      image: "/products/rice.jpg",
    },
  ];

  return (
    <section className="bg-[#F5F7FA] py-24">

      <Container>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-3xl">

            <div className="inline-flex rounded-full bg-[#E6F4F7] px-4 py-2 text-sm font-medium text-[#0E7490]">
              Export Product Categories
            </div>

            <h2 className="mt-6 text-4xl font-bold leading-tight text-[#0F172A]">
              High-Demand Agricultural Products For Global Buyers
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#64748B]">
              We supply carefully sourced agricultural
              commodities suitable for wholesalers,
              distributors, retailers, food processors,
              and international import businesses.
            </p>

          </div>

          <Button
            text="View All Products"
            href="/products"
          />

        </div>

        <div className="mt-16 grid gap-8 pb-24 lg:grid-cols-3">

          {products.map((product) => (

            <div
              key={product.name}
              className="overflow-hidden rounded-[2rem] border border-[#D9E2EC] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="relative h-72 overflow-hidden">

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="p-8">

                <h3 className="text-2xl font-semibold text-[#0F172A]">
                  {product.name}
                </h3>

                <p className="mt-4 leading-7 text-[#64748B]">
                  Export-quality product supplied with
                  international packaging and shipment support.
                </p>

              </div>

            </div>

          ))}

        </div>

      </Container>

    </section>
  );
}