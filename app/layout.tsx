import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ToolHive — Neighborhood Tool Sharing",
  description: "Borrow tools from your neighbors. Share yours. Build community with ToolHive — the Airbnb for tools.",
  keywords: ["tool sharing", "neighborhood", "borrow tools", "tool rental", "community"],
  openGraph: {
    title: "ToolHive — Neighborhood Tool Sharing",
    description: "Borrow tools from your neighbors. Share yours.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-50 text-gray-900 antialiased font-sans">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
