import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aihrly — Phone Screening Platform",
  description: "Phone Screening Platform built for Remotown GmbH",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
