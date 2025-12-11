import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signal Draft: Founder Edition",
  description: "Draft the future, assemble the startup. A multiplayer game for founders to generate and validate startup ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-950 text-white">
        {children}
      </body>
    </html>
  );
}
