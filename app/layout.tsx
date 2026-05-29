import type { Metadata } from "next";
import { Cormorant_Garamond, Spectral } from "next/font/google";
import "@/styles/globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"], // Türkçe karakterler için latin-ext
  weight: ["300", "400", "500"],
  variable: "--font-display",
  display: "swap",
});
const body = Spectral({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bay Terek — Türk Mitolojisinin Kayıp Dünyası",
  description:
    "Türk mitolojisinin tanrıları, ruhları ve kayıp destanları — bir ansiklopedi değil, içine girilen bir evren.",
  openGraph: {
    title: "Bay Terek — Türk Mitolojisinin Kayıp Dünyası",
    description: "Göğün altında unutulan kadim dünya.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
