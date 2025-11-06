import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anket Uygulaması",
  description: "Kolayik Anket Uygulaması",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
