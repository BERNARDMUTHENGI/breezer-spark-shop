import React, { createContext, useState, useContext, ReactNode, useMemo,useCallback,useEffect } from 'react';
import { useToast } from "@/hooks/use-toast"; // Assuming useToast is available

// Define the Product interface as per your Shop.tsx
interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl: string | null;
  stock: number;
  isActive: boolean;
  category: { id: number; name: string; slug: string } | null;
}

// Define the CartItem interface (a Product with a quantity)
export interface CartItem extends Product {
  quantity: number;
}

// Define the shape of our CartContext
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
  cartTotal: string;
  cartItemCount: number;
}

// Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider component to wrap your application or relevant parts
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Initialize cart from localStorage if available
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  });
  const { toast } = useToast();

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = useCallback((product: Product, quantityToAdd: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Check if adding quantity exceeds stock
        if (existingItem.quantity + quantityToAdd > product.stock) {
          toast({
            title: "Out of Stock!",
            description: `Cannot add more than ${product.stock} of ${product.name} to cart.`,
            variant: "destructive",
          });
          return prevItems; // Do not update cart if stock is exceeded
        }
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      } else {
        // Check if initial quantity exceeds stock
        if (quantityToAdd > product.stock) {
          toast({
            title: "Out of Stock!",
            description: `Cannot add ${product.name}, only ${product.stock} available.`,
            variant: "destructive",
          });
          return prevItems; // Do not add if initial quantity exceeds stock
        }
        return [...prevItems, { ...product, quantity: quantityToAdd }];
      }
    });
    toast({
      title: "Product Added to Cart!",
      description: `${quantityToAdd} x ${product.name} added.`,
    });
  }, [toast]);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast({
      title: "Item Removed",
      description: "Product removed from cart.",
    });
  }, [toast]);

  const updateCartQuantity = useCallback((productId: number, newQuantity: number) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === productId) {
          if (newQuantity <= 0) {
            return null; // Mark for removal
          }
          // Check against product's available stock
          if (newQuantity > item.stock) {
            toast({
              title: "Quantity Limit Reached",
              description: `Maximum quantity for ${item.name} is ${item.stock}.`,
              variant: "destructive",
            });
            return { ...item, quantity: item.stock }; // Cap at max stock
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[]; // Filter out nulls and cast back

      if (newQuantity <= 0 && prevItems.some(item => item.id === productId)) {
        toast({
          title: "Item Removed",
          description: "Product quantity set to zero, removed from cart.",
        });
      }
      return updatedItems;
    });
  }, [toast]);


  const clearCart = useCallback(() => {
    setCartItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  }, [toast]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  }, [cartItems]);

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartItemCount,
  }), [cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartItemCount]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
