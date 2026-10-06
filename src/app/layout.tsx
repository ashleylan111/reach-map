import type { Metadata } from "next";
import { Figtree, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const figtree = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reach Map — Outreach lead geography",
  description:
    "Plot where your outreach leads are from and track status across the map.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full font-[family-name:var(--font-body)]">
        {children}
      </body>
    </html>
  );
}
