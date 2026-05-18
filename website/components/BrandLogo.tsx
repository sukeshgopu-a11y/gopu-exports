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
  variant = "default",
}: BrandLogoProps) {
  const src = markOnly ? "/logos/gopu-mark.svg" : "/logos/gopu-exports-logo.svg";
  const alt = markOnly ? "GOPU Exports logo mark" : "GOPU Exports";

  return (
    // SVG logos render more reliably as plain images across navbar, footer, and dashboard chrome.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      width={markOnly ? 56 : 220}
      height={markOnly ? 56 : 72}
      className={`${markOnly ? "h-12 w-12" : "h-12 w-auto"} object-contain ${variant === "light" ? "brightness-0 invert" : ""} ${className}`}
    />
  );
}
