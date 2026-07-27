import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import AuthProvider from "@/context/SessionProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "AURA - Premium Tech Lifestyle Store",
  description: "Experience minimalist premium technology and ambient home lifestyle electronics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
