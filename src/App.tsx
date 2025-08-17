import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar"; // Corrected to relative path
import { Footer } from "./components/layout/Footer"; // Corrected to relative path
import Home from "./pages/Home"; // Corrected to relative path
import About from "./pages/About"; // Corrected to relative path
import Shop from "./pages/Shop"; // Corrected to relative path
import Contact from "./pages/Contact"; // Corrected to relative path
import Portfolio from "./pages/Portfolio"; // Corrected to relative path
import Admin from "./pages/Admin"; // Corrected to relative path
import NotFound from "./pages/NotFound"; // Corrected to relative path
import { CartProvider } from "./contexts/CartContext"; // Corrected to relative path
import { AuthProvider } from "./contexts/AuthContext"; // Corrected to relative path
import Login from "./pages/Login"; // Corrected to relative path
import Account from "./pages/Account"; // Corrected to relative path
import Cart from "./pages/Cart"; // Corrected to relative path
import Register from "./pages/Register";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* AuthProvider and CartProvider wrap the parts of the app that need their state */}
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar /> {/* Navbar needs Cart and Auth Contexts */}
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/shop" element={<Shop />} /> {/* Shop needs Cart Context */}
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/register" element ={<Register />} />
                  <Route path="/login" element={<Login />} /> {/* Login needs Auth Context */}
                  <Route path="/account" element={<Account />} /> {/* Account needs Auth Context and user data */}
                  <Route path="/cart" element={<Cart />} /> {/* New Cart page route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
