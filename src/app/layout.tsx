import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reach Map",
  description:
    "See where your outreach leads are from — plotted on a map.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
