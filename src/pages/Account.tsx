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

const API_BASE_URL = "https://breezer-electronics-5.onrender.com/api";

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
    if (!user?.id) {
      setOrdersLoading(false);
      return;
    }
    setOrdersLoading(true);
    try {
     const res = await fetch(`${API_BASE_URL}/orders/me`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});



      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
    setUserOrders(
  data.map((order: any) => ({
    id: order.id,
    productName: order.productName || "N/A", // match backend key
    quantity: order.quantity,
    totalAmount: order.totalAmount || 0,    // match backend key
    status: order.status,
    orderDate: order.orderDate || order.createdAt, // fallback to createdAt
  }))
);

    } catch (error) {
      console.error("Error fetching user orders:", error);
      toast({
        title: "Error",
        description: "Could not load your orders. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  if (isAuthenticated && user) {
    fetchUserOrders();
  }
}, [isAuthenticated, user, toast]);


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
  <div className="w-32 h-32 rounded-full bg-dark-blue flex items-center justify-center">
    <span className="text-white text-lg font-medium">Welcome</span>
  </div>
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
  {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
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