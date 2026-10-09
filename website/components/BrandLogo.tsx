import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  markOnly?: boolean;
  priority?: boolean;
  sizes?: string;
  variant?: "default" | "light";
};

export default function BrandLogo({
  className = "",
  markOnly = false,
  priority = false,
  sizes,
  variant = "default",
}: BrandLogoProps) {
  const src = markOnly
    ? "/logos/gopu-exports-emblem.png"
    : variant === "light"
      ? "/logos/gopu-exports-logo-full.webp"
      : "/logos/gopu-exports-logo-nav.webp";

  return (
    <Image
      src={src}
      alt={markOnly ? "GOPU Exports GE emblem" : "GOPU Exports"}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      width={markOnly ? 512 : variant === "light" ? 900 : 520}
      height={markOnly ? 512 : variant === "light" ? 555 : 267}
      sizes={sizes}
      className={`${className || (markOnly ? "h-14 w-14" : "h-16 w-auto")} object-contain`}
    />
  );
}
