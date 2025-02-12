import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/components/provider";
import SubscribeNotification from "@/components/notification";
import { ServiceWorker } from "@/components/service-worker";

export const metadata: Metadata = {
  title: "Verdicto",
  description: "Crime Reporting and Community Verification Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <QueryProvider>
          <SubscribeNotification />
          <ServiceWorker />
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
