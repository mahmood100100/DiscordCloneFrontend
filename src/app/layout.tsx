import { ReduxProvider } from "@/redux/provider";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import SignalRProvider from "@/signalr/signalr-provider";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Team Chat Application",
  description: "Mahmoud Freihat Team Chat Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased`} suppressHydrationWarning>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider/>
            <SignalRProvider/>
            {children}
          </ThemeProvider>
          <Toaster position="top-right" reverseOrder={false} />
        </ReduxProvider>
      </body>
    </html>
  );
}