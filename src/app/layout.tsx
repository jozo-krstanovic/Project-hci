import type { Metadata } from "next";
import { Ubuntu, Montserrat } from "next/font/google";
import "./globals.css";
import { Navigation } from "../components/navigation";

const ubuntu = Ubuntu({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu",
  display: "swap",
  fallback: ["arial", "sans-serif"],
});

const montserrat = Montserrat({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  fallback: ["arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Fitness App",
  description: "App for all your fitness needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ubuntu.variable} ${montserrat.variable} antialiased w-full max-w-screen`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
