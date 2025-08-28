import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { useCart } from "../../contexts/CartContext"; 
import { useAuth } from "../../contexts/AuthContext"; 

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { cartItemCount } = useCart(); 
  const { isAuthenticated } = useAuth(); 

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About & Services", href: "/about" },
    { name: "Shop", href: "/shop" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {/* Adjusted size of the logo image */}
              <img 
                src="/logo.jpg" 
                alt="Breezer Electric Logo" 
                className="h-14 w-14 rounded-full object-cover mb-1 mt-2" 
              />
              {/* Removed redundant text as the logo image contains the full name */}
              <span className="text-xs font-bold text-primary">
                Breezer Electric & Automations <br />
                Better services for self reliance
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Cart Icon (Desktop) - Now links to /cart */}
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>

            {/* Profile Icon (Desktop) */}
            <Link to={isAuthenticated ? "/account" : "/login"} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <User className="h-6 w-6 text-gray-700" />
              <span className="sr-only">Profile</span>
            </Link>
          </div>

          {/* Mobile menu button & Icons */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Cart Icon (Mobile) - Now links to /cart */}
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>

            {/* Profile Icon (Mobile) */}
            <Link to={isAuthenticated ? "/account" : "/login"} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <User className="h-6 w-6 text-gray-700" />
              <span className="sr-only">Profile</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary p-2 rounded-full"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
