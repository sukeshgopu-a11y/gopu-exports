import Image from "next/image";

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
    <Image
      src={src}
      alt={alt}
      width={markOnly ? 56 : 220}
      height={markOnly ? 56 : 72}
      priority={priority}
      className={`${markOnly ? "h-12 w-12" : "h-12 w-auto"} object-contain ${variant === "light" ? "brightness-0 invert" : ""} ${className}`}
    />
  );
}
