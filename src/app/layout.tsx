import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "StoryCanvas",
  description:
    "StoryCanvas is a collaborative tool for creating and sharing interactive stories.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
};

export default RootLayout;
