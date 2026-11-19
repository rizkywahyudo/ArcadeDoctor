import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arcade Doctors — Pusat Diagnostik & Pengetahuan Arcade",
  description: "Pusat pencarian manual, kalkulator elektronika, dan asisten troubleshooting mesin arcade.",
  applicationName: "Arcade Doctors"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
