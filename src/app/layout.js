import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "OnlinePhotobooth",
  description: "Online Photobooth Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        
        <main>{children}</main>
      </body>
    </html>
  );
}