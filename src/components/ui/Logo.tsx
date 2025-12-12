"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "small" | "medium" | "large";
  linkToHome?: boolean;
}

const sizes = {
  small: { width: 120, height: 72 },
  medium: { width: 200, height: 120 },
  large: { width: 500, height: 300 },
};

export function Logo({ size = "small", linkToHome = true }: LogoProps) {
  const { width, height } = sizes[size];

  const logo = (
    <Image
      src="/logo.png"
      alt="Signal Draft"
      width={width}
      height={height}
      className="object-contain"
      priority={size === "large"}
    />
  );

  if (linkToHome) {
    return (
      <Link href="/" className="inline-block">
        {logo}
      </Link>
    );
  }

  return logo;
}
