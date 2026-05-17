import Link from "next/link";

type ButtonProps = {
  text: string;
  href: string;
};

export default function Button({
  text,
  href,
}: ButtonProps) {

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-[#0E7490] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A5A70]"
    >
      {text}
    </Link>
  );
}