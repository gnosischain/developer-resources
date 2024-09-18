import type { Metadata } from "next";
import "./globals.css";
import { ConfigProvider } from "antd"; 
import PrivyProvider from "./components/privy"; 


export const metadata: Metadata = {
  title: "Gnosis App Demo",
  description: "Gnosis App Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> 
      <body>
        <ConfigProvider>
          <PrivyProvider> 
            {children} 
          </PrivyProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
