import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Montserrat } from "next/font/google";
import { ClientApolloProvider } from "@/lib/apollo/ClientApolloProvider";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Toaster } from "@/components/ui/toaster"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cystic Fibrosis Association BG",
  description: "Supporting the CF community in Bulgaria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-[#fafafa] font-['Montserrat']`}
      >
        <ClientApolloProvider>
          <AuthProvider>
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Navbar />
              {children}
              <Footer />
            </div>
          </AuthProvider>
        </ClientApolloProvider>
        <Toaster />
      </body>
    </html>
  );
}
