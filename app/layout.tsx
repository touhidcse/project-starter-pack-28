import { Toaster } from "sonner";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // const user = await getMe() 
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {/* Navbar */}
       
        {children}
        {/* footer */}
         <Toaster position="top-right" richColors />
        </body>
    </html>
  );
}