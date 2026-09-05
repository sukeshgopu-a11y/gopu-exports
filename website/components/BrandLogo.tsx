type BrandLogoProps = {
  className?: string;
  markOnly?: boolean;
  priority?: boolean;
  variant?: "default" | "light";
};

export default function BrandLogo({
  className = "",
  markOnly = false,
  priority = false,
}: BrandLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/gopu-exports-logo-new.webp"
      alt="GOPU Exports Private Limited — India, Delivered Globally"
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      width={markOnly ? 96 : 300}
      height={markOnly ? 96 : 120}
      className={`${markOnly ? "h-14 w-14" : "h-16 w-auto"} object-contain ${className}`}
    />
  );
}
