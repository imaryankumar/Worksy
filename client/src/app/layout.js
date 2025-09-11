import { Outfit } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/common/AppProviders";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Worksy",
  description:
    "Worksy empowers teams to collaborate seamlessly and track productivity works",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <AppProviders>
          <main>{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
