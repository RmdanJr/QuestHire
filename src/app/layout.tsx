import type { Metadata } from "next";
import { Cinzel, Geist_Mono, Spectral } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuestHire: The Crypt of the Hiring Manager",
  description:
    "Turn your interview invite into an adventure. QuestHire builds a prep plan from your resume and job description, then makes you fight your way through it.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${spectral.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-candle focus:px-4 focus:py-2 focus:text-void"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
