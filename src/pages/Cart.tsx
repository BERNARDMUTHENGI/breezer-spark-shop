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

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQuantity, cartTotal, cartItemCount, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth(); // Get user object from AuthContext
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
    const customerName = formData.get("name") as string;
    const customerEmail = formData.get("email") as string;
    const customerPhone = formData.get("phone") as string;
    const notes = (formData.get("notes") as string) || null;

    if (!customerName || !customerEmail || !customerPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required customer details.",
        variant: "destructive",
      });
      setIsSubmittingOrder(false);
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your cart is empty. Please add items before checking out.",
        variant: "destructive",
      });
      setIsSubmittingOrder(false);
      return;
    }

    let allOrdersSuccessful = true;
    const orderPromises = cartItems.map(async (item) => {
      const payload = {
        productId: item.id,
        quantity: item.quantity,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        notes: notes,
      };

      try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          allOrdersSuccessful = false;
          console.error(`Failed to order ${item.name}:`, result.error || response.statusText);
          toast({
            title: `Order Failed for ${item.name}`,
            description: result.error || "Please try again.",
            variant: "destructive",
          });
          return Promise.reject(new Error(`Failed to order ${item.name}`)); // Reject to catch in Promise.all
        }
        return result; // Return success result
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
      await Promise.all(orderPromises); // Wait for all order promises to resolve/reject

      if (allOrdersSuccessful) {
        clearCart(); // Clear cart only if all orders went through
        toast({
          title: "Orders Placed Successfully! 🎉",
          description: "Your order(s) have been received. We'll contact you shortly!",
          duration: 5000,
        });
        setShowCheckoutForm(false); // Close the checkout form
        navigate('/account'); // Navigate to account page or order history
      } else {
        // This block will be hit if any promise rejected, and allOrdersSuccessful would be false
        toast({
          title: "Some Orders Failed",
          description: "Some items in your cart could not be ordered. Please check the console for details.",
          variant: "destructive",
          duration: 7000,
        });
      }
    } catch (finalError) {
      // This catch block handles the rejections from Promise.all
      console.error("Overall order submission failed:", finalError);
      // Specific toasts for individual item failures are already done in the map loop
      // This catch is more for unexpected Promise.all rejections
    } finally {
      setIsSubmittingOrder(false);
    }
  };


  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl rounded-xl p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-primary" />
            Your Shopping Cart ({cartItemCount} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cartItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p className="text-lg mb-4">Your cart is empty. Start shopping!</p>
              <Button onClick={() => navigate('/shop')}>Go to Shop</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
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
              ))}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={clearCart} className="text-red-500 hover:text-red-600 border-red-300">
                    Clear Cart
                </Button>
                <div className="text-right text-2xl font-bold text-primary">
                  Total: {formatKES(parseFloat(cartTotal))}
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  variant="outline"
                  className="py-2.5 px-6 rounded-lg font-semibold border-gray-300 hover:bg-gray-100"
                  onClick={() => navigate('/shop')}
                >
                  Continue Shopping
                </Button>
                <Button
                  className="py-2.5 px-6 rounded-lg font-semibold bg-green-600 hover:bg-green-700 transition-colors"
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
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-primary mb-6">Finalize Your Order</h3>

            <form onSubmit={handleCheckoutSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" required defaultValue={user?.name || ''} disabled={isSubmittingOrder} />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" required defaultValue={user?.email || ''} disabled={isSubmittingOrder} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" type="tel" required defaultValue={user?.phone || ''} disabled={isSubmittingOrder} />
              </div>
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Delivery address, special requirements, etc." disabled={isSubmittingOrder} />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Order Summary</h4>
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-700 py-1">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>{formatKES(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg text-primary pt-2 border-t border-gray-200 mt-2">
                  <span>Total:</span>
                  <span>{formatKES(parseFloat(cartTotal))}</span>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Payment Information</h4>
                <p className="text-sm text-muted-foreground">
                  After placing your order, our team will contact you with:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Bank details for payment</li>
                  <li>• M-Pesa payment options</li>
                  <li>• Delivery arrangements</li>
                  <li>• Final pricing confirmation</li>
                </ul>
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1 py-2.5 rounded-lg text-lg font-semibold" disabled={isSubmittingOrder}>
                  {isSubmittingOrder ? "Placing Order..." : "Place Order"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCheckoutForm(false)} disabled={isSubmittingOrder}>
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
