import type { Metadata } from "next";
import "@/styles/globals.css";
import { ReactQueryProvider, SocketProvider, ThemeProvider } from "@/lib";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Instafeed",
  description:
    "Instafeed is a social media platform that allows users to share their experiences and connect with others.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-roboto">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <SocketProvider>{children}</SocketProvider>
          </ReactQueryProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
