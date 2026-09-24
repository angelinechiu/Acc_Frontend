import type { Metadata } from "next";

import "@/styles/common.css";
import "@/styles/super-admin.css";
import "@/styles/local-admin.css";
import "@/styles/accountant.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Accounting Intelligence | SAIC",
  description:
    "AI-Driven Invoice Processing and Automated Record Standardisation. Enterprise accounting intelligence platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}