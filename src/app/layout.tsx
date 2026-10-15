import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI DLC Workshop Store",
  description: "Example app for the AI DLC workshop.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="nav">
          <strong>Workshop Store</strong>
          <nav>
            <Link href="/">Search</Link>
            <Link href="/login">Login</Link>
            <Link href="/checkout">Checkout</Link>
            <Link href="/billing">Billing</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
