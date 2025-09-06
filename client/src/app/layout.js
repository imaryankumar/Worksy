import { Outfit } from "next/font/google";
import QueryProvider from "./providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

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
    <html lang="en">
      <body className={`${outfit.variable}`}>
        <QueryProvider>
          <main>{children}</main>
          <Toaster position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
