import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

import {
  Inter,
  Istok_Web,
  Lalezar,
  Lancelot,
  Lateef,
  Montserrat,
  Raleway,
  Ramaraja,
  Urbanist,
  Vesper_Libre,
} from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./providers/queryClientProvider";
import { ReduxProvider } from "./providers/reduxProvider";
import NavigationButton from "../components/NavigationButton";
import { AuthInitializer } from "../components/AuthInitializer";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const vesper = Vesper_Libre({
  variable: "--font-vesper",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const ramaraja = Ramaraja({
  variable: "--font-ramaraja",
  subsets: ["latin"],
  weight: ["400"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const lateef = Lateef({
  variable: "--font-lateef",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const istokWeb = Istok_Web({
  variable: "--font-istokWeb",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const lalezar = Lalezar({
  variable: "--font-lalezar",
  subsets: ["latin"],
  weight: ["400"],
});

const lancelot = Lancelot({
  variable: "--font-lancelot",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.portgig.com"),
  viewport: "width=device-width, initial-scale=1", 
  keywords: [
    "Portgig",
    "Portfolio",
    "Creators",
    "Skills",
    "Opportunities",
    "Jobs",
    "Tools",
    "Portfolio Template",
    "Portfolio Builder",
    "cv Builder",
    "Portfolio Generator",
    "Portfolio Creator",
    "Portfolio Designer",
    "Portfolio Developer",
    "Portfolio Manager",
    "Portfolio Analyst",
    "Portfolio Consultant",
    "Portfolio Mentor",
    "Portfolio Guide",
    "Portfolio Coach",
    "Portfolio Mentor",
    "Portfolio Trainer",
    "Portfolio Expert",
  ],
  title: {
    default: "Portgig",
    template: "%s | Portgig",
  },
  description: "Welcome to the talents website showcasing creators and skills.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Portgig",
    description:
      "Connect with other creatives, and land your career jobs, tools, and opportunities on Portgig.",
    url: "https://www.portgig.com/",
    siteName: "Portgig",
    images: [
      {
        url: "https://www.portgig.com/assets/portgig.svg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portgig",
    description:
      "Connect with other creatives, and land your career jobs, tools, and opportunities on Portgig.",
    images: ["https://www.portgig.com/assets/portgig.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.JSX.Element | React.JSX.Element[];
}>) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.variable} ${inter.variable} ${raleway.variable} ${vesper.variable} ${ramaraja.variable} ${montserrat.variable} ${lateef.variable} ${istokWeb.variable} ${lalezar.variable} ${lancelot.variable} font-raleway`}
      >
        <ReduxProvider>
          <QueryProvider>
            <AuthInitializer>
              <div className="flex flex-col min-h-screen">
                <main className="flex-1 overflow-auto">{children}</main>
                <NavigationButton />
              </div>
            </AuthInitializer>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}