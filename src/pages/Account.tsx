import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext"; // Corrected to relative path
import { useToast } from "@/hooks/use-toast"; // Import useToast hook
import { User, Mail, Phone, ShoppingBag, LogOut } from "lucide-react"; // Icons

// Interface for Order data (similar to what you have in Admin, but simpler for user view)
interface UserOrder {
  id: number;
  productName: string;
  quantity: number;
  totalAmount: number;
  status: "pending" | "processing" | "completed";
  orderDate: string;
}

const API_BASE_URL = "http://localhost:5000/api"; // Your backend API URL

const Account = () => {
  const { user, isAuthenticated, logout } = useAuth(); // Get user, isAuthenticated, and logout function
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please log in to view your account.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  // Fetch user-specific orders
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user?.id) { // Only fetch if user is logged in and has an ID
        setOrdersLoading(false);
        return;
      }
      setOrdersLoading(true);
      try {
        // In a real application, you would use a protected endpoint
        // and send the user's token for authorization.
        // For now, this is a mock fetch.
        const response = await new Promise((resolve) => setTimeout(() => {
          // Dummy orders for the "Test User"
          if (user.id === 1) {
            resolve({
              success: true,
              orders: [
                { id: 101, productName: "Solar Panel 300W", quantity: 2, totalAmount: 50000, status: "completed", orderDate: "2023-01-15" },
                { id: 102, productName: "LED Floodlight", quantity: 5, totalAmount: 7500, status: "processing", orderDate: "2023-03-01" },
                { id: 103, productName: "Generator 5kVA", quantity: 1, totalAmount: 120000, status: "pending", orderDate: "2023-04-20" },
              ]
            });
          } else {
            resolve({ success: true, orders: [] }); // No orders for other users
          }
        }, 1000));

        const result = response as { success: boolean; orders: UserOrder[] };

        if (result.success) {
          setUserOrders(result.orders);
        } else {
          toast({
            title: "Failed to Fetch Orders",
            description: "Could not retrieve your order history.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching user orders:", error);
        toast({
          title: "Error",
          description: "An error occurred while loading orders.",
          variant: "destructive",
        });
      } finally {
        setOrdersLoading(false);
      }
    };

    if (isAuthenticated && user) {
        fetchUserOrders();
    }
  }, [isAuthenticated, user, toast]); // Re-fetch when auth status or user changes

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate("/login"); // Redirect to login page after logout
  };

  if (!isAuthenticated || !user) {
    // Render nothing or a loading spinner while redirecting
    return null;
  }

  const formatKES = (n: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="rounded-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-primary flex items-center gap-3">
              <User className="h-8 w-8 text-primary" />
              My Account
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Profile Info */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-800">Profile Information</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-lg">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span>Name: <span className="font-medium">{user.name}</span></span>
                </div>
                <div className="flex items-center space-x-2 text-lg">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>Email: <span className="font-medium">{user.email}</span></span>
                </div>
                <div className="flex items-center space-x-2 text-lg">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>Phone: <span className="font-medium">{user.phone}</span></span>
                </div>
              </div>
              <Button onClick={handleLogout} variant="destructive" className="mt-4 px-6 py-2 rounded-full">
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>

            {/* Account Image */}
            <div className="flex justify-center items-center">
              <img
                src="https://placehold.co/300x300/e0e0e0/000000?text=Your+Account" // Placeholder image URL
                alt="User Account"
                className="rounded-full shadow-lg border-4 border-primary/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* My Orders Section */}
        <Card className="rounded-xl shadow-xl mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <ShoppingBag className="h-7 w-7 text-primary" />
              My Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <p className="text-center text-muted-foreground py-10">Loading orders...</p>
            ) : userOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">You have no past orders.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatKES(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;
