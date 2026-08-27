import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TAFIP Framework | Trust & Security Analysis Dashboard",
  description: "Trust and Security Analysis Framework for Fintech Insights and Prediction (Parkway vs Revolut comparative study)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0b0f19] text-slate-100">{children}</body>
    </html>
  );
}
