import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"; // Import Label for form fields
import { Textarea } from "@/components/ui/textarea"; // Import Textarea for notes
import { Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext"; // Corrected to alias path
import { useAuth } from "@/contexts/AuthContext"; // Corrected to alias path
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://breezer-electronics-5.onrender.com";



const Cart = () => {
  const { cartItems, removeFromCart, updateCartQuantity, cartTotal, cartItemCount, clearCart } = useCart();
  const { isAuthenticated, user,token } = useAuth(); // Get user object from AuthContext
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const formatKES = (n: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "You need to log in to proceed to checkout.",
        duration: 3000,
        variant: "destructive",
      });
      navigate('/login'); // Redirect to login page
    } else {
      setShowCheckoutForm(true); // Show the checkout form modal
    }
  };
const handleCheckoutSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmittingOrder(true);

  const formData = new FormData(e.currentTarget as HTMLFormElement);
  const customerName = (formData.get("name") as string)?.trim();
  const customerEmail = (formData.get("email") as string)?.trim();
  const customerPhone = (formData.get("phone") as string)?.trim();
  const notes = (formData.get("notes") as string)?.trim() || "";

  // Validate required customer fields
  if (!customerName || !customerEmail || !customerPhone) {
    toast({
      title: "Missing Information",
      description: "Please fill in all required customer details.",
      variant: "destructive",
    });
    setIsSubmittingOrder(false);
    return;
  }

  if (!cartItems || cartItems.length === 0) {
    toast({
      title: "Cart Empty",
      description: "Your cart is empty. Please add items before checking out.",
      variant: "destructive",
    });
    setIsSubmittingOrder(false);
    return;
  }

  const token = localStorage.getItem("token"); // Ensure you get the JWT here

  if (!token) {
    toast({
      title: "Not Authenticated",
      description: "Please log in to place an order.",
      variant: "destructive",
    });
    setIsSubmittingOrder(false);
    return;
  }

  let allOrdersSuccessful = true;

  const orderPromises = cartItems.map(async (item) => {
    // Ensure productId and quantity are valid
    const payload = {
      productId: item?.id || 0,
      quantity: item?.quantity > 0 ? item.quantity : 1,
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      notes: notes,
      userId: user?.id || null,
    };

    // Extra validation before sending
    if (!payload.productId || !payload.quantity) {
      allOrdersSuccessful = false;
      console.error(`Invalid order data for item: ${item.name}`);
      toast({
        title: `Invalid Order Data`,
        description: `Cannot place order for ${item.name}.`,
        variant: "destructive",
      });
      return Promise.reject(new Error(`Invalid order data for ${item.name}`));
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") || "";
      let result: any = {};

      if (contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error("Expected JSON but got:", text);
        throw new Error("Server returned non-JSON response");
      }

      if (!response.ok) {
        allOrdersSuccessful = false;
        console.error(`Failed to order ${item.name}:`, result.error || response.statusText);
        toast({
          title: `Order Failed for ${item.name}`,
          description: result.error || "Please try again.",
          variant: "destructive",
        });
        return Promise.reject(new Error(`Failed to order ${item.name}`));
      }

      return result;
    } catch (error) {
      allOrdersSuccessful = false;
      console.error(`Network error ordering ${item.name}:`, error);
      toast({
        title: `Network Error for ${item.name}`,
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  });

  try {
    await Promise.all(orderPromises);

    if (allOrdersSuccessful) {
      clearCart();
      toast({
        title: "Orders Placed Successfully! 🎉",
        description: "Your order(s) have been received. We'll contact you shortly!",
        duration: 5000,
      });
      setShowCheckoutForm(false);
      navigate("/account");
    } else {
      toast({
        title: "Some Orders Failed",
        description: "Some items in your cart could not be ordered. Check console for details.",
        variant: "destructive",
        duration: 7000,
      });
    }
  } catch (finalError) {
    console.error("Overall order submission failed:", finalError);
  } finally {
    setIsSubmittingOrder(false);
  }
};

  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted/30 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl shadow-xl rounded-xl p-3 sm:p-6">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
            <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-center sm:text-left">Your Shopping Cart ({cartItemCount} items)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {cartItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p className="text-base sm:text-lg mb-4">Your cart is empty. Start shopping!</p>
              <Button onClick={() => navigate('/shop')} className="w-full sm:w-auto">Go to Shop</Button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden space-y-3">
                    <div className="flex items-start space-x-3">
                      <img
                        src={item.thumbnailUrl || 'https://placehold.co/80x80/e0e0e0/000000?text=NoImage'}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md shadow-sm flex-shrink-0"
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x80/e0e0e0/000000?text=NoImage')}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base text-gray-800 truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{formatKES(item.price)}</p>
                        {item.stock < item.quantity && (
                          <p className="text-xs text-red-500">Only {item.stock} left in stock!</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0 text-sm"
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                          className="w-16 text-center text-sm"
                          min="0"
                          max={item.stock}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0 text-sm"
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.thumbnailUrl || 'https://placehold.co/80x80/e0e0e0/000000?text=NoImage'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md shadow-sm"
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x80/e0e0e0/000000?text=NoImage')}
                      />
                      <div>
                        <p className="font-semibold text-lg text-gray-800">{item.name}</p>
                        <p className="text-md text-muted-foreground">{formatKES(item.price)}</p>
                        {item.stock < item.quantity && (
                            <p className="text-sm text-red-500">Only {item.stock} left in stock!</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 p-0"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                        className="w-16 text-center text-lg"
                        min="0"
                        max={item.stock}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Cart Summary */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6 border-t border-gray-200 gap-4">
                <Button 
                  variant="outline" 
                  onClick={clearCart} 
                  className="text-red-500 hover:text-red-600 border-red-300 w-full sm:w-auto order-2 sm:order-1"
                >
                  Clear Cart
                </Button>
                <div className="text-center sm:text-right text-xl sm:text-2xl font-bold text-primary order-1 sm:order-2">
                  Total: {formatKES(parseFloat(cartTotal))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
                <Button
                  variant="outline"
                  className="py-2.5 px-6 rounded-lg font-semibold border-gray-300 hover:bg-gray-100 w-full sm:w-auto"
                  onClick={() => navigate('/shop')}
                >
                  Continue Shopping
                </Button>
                <Button
                  className="py-2.5 px-6 rounded-lg font-semibold bg-green-600 hover:bg-green-700 transition-colors w-full sm:w-auto"
                  onClick={handleProceedToCheckout}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checkout Form Modal */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 text-center">Finalize Your Order</h3>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                <Input id="name" name="name" required defaultValue={user?.name || ''} disabled={isSubmittingOrder} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                <Input id="email" name="email" type="email" required defaultValue={user?.email || ''} disabled={isSubmittingOrder} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                <Input id="phone" name="phone" type="tel" required defaultValue={user?.phone || ''} disabled={isSubmittingOrder} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Delivery address, special requirements, etc." disabled={isSubmittingOrder} className="mt-1" />
              </div>

              <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">Order Summary</h4>
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-xs sm:text-sm text-gray-700 py-1">
                    <span className="truncate pr-2">{item.name} (x{item.quantity})</span>
                    <span className="flex-shrink-0">{formatKES(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-base sm:text-lg text-primary pt-2 border-t border-gray-200 mt-2">
                  <span>Total:</span>
                  <span>{formatKES(parseFloat(cartTotal))}</span>
                </div>
              </div>

              <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">Payment Information</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  After placing your order, our team will contact you with:
                </p>
                <ul className="text-xs sm:text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Bank details for payment</li>
                  <li>• M-Pesa payment options</li>
                  <li>• Delivery arrangements</li>
                  <li>• Final pricing confirmation</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
                <Button type="submit" className="flex-1 py-2.5 rounded-lg text-sm sm:text-lg font-semibold" disabled={isSubmittingOrder}>
                  {isSubmittingOrder ? "Placing Order..." : "Place Order"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCheckoutForm(false)} disabled={isSubmittingOrder} className="sm:w-auto">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;