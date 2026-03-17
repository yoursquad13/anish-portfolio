import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Preloader } from "@/components/Preloader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Anish Khatri | Freelance Web Developer & Security Researcher",
    template: "%s | Anish Khatri"
  },
  description: "Explore the portfolio of Anish Khatri, a passionate Freelance Web Developer and Security Researcher. Discover amazing projects, clean code, and cutting-edge security solutions.",
  keywords: ["Anish Khatri", "Web Developer", "Security Researcher", "Portfolio", "Freelancer", "Full Stack Developer", "Cybersecurity", "React", "Next.js"],
  authors: [{ name: "Anish Khatri" }],
  creator: "Anish Khatri",
  openGraph: {
    title: "Anish Khatri | Freelance Web Developer & Security Researcher",
    description: "Explore the portfolio of Anish Khatri, a passionate Freelance Web Developer and Security Researcher. Discover amazing projects, clean code, and cutting-edge security solutions.",
    url: "https://anishkhatri.com",
    siteName: "Anish Khatri Portfolio",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Anish Khatri Portfolio Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anish Khatri | Freelance Web Developer & Security Researcher",
    description: "Explore the portfolio of Anish Khatri, a passionate Freelance Web Developer and Security Researcher. Discover amazing projects, clean code, and cutting-edge security solutions.",
    creator: "@anishkhatri",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          <Preloader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
