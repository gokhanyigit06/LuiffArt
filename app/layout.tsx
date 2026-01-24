import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { RegionProvider } from "@/components/providers/RegionProvider";
import { cookies } from "next/headers";
import { REGION_COOKIE_NAME, RegionCode } from "@/types/region";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luiff Art",
  description: "Modern Art & Design Store",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const regionCookie = cookieStore.get(REGION_COOKIE_NAME);
  const initialRegion = (regionCookie?.value as RegionCode) || 'GLOBAL';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <RegionProvider initialRegion={initialRegion}>
            {children}
          </RegionProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
