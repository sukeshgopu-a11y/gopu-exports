import Button from "./Button";
import Container from "./Container";

export default function CTASection() {

  return (
    <section className="bg-white py-24">

      <Container>

        <div className="overflow-hidden rounded-[2.5rem] bg-[#0F172A] px-8 py-16 lg:px-16 lg:py-20">

          <div className="max-w-4xl">

            <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-[#E6F4F7]">

              Global Trade Enquiries Welcome

            </div>

            <h2 className="mt-6 text-4xl font-bold leading-tight text-white lg:text-5xl">

              Looking For A Reliable
              Long-Term Export Partner?

            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">

              Connect with GOPU Exports for premium
              agricultural commodities, export-quality
              packaging, and dependable international
              shipment support.

            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Button
                text="Send Trade Enquiry"
                href="/contact"
              />

              <Button
                text="Explore Products"
                href="/products"
              />

            </div>

          </div>

        </div>

      </Container>

    </section>
  );
}