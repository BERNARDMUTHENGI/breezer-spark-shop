import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, ShoppingBag, LogOut, AlertCircle, Loader2 } from "lucide-react";

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
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

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
      setOrdersError("");
      
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${API_BASE_URL}/orders/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token might be expired or invalid
            logout();
            navigate("/login");
            throw new Error("Authentication failed. Please log in again.");
          } else if (response.status === 404) {
            // Try alternative endpoint structure
            const altResponse = await fetch(`${API_BASE_URL}/users/${user.id}/orders`, {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              },
            });
            
            if (!altResponse.ok) {
              throw new Error(`Failed to fetch orders: ${altResponse.status}`);
            }
            
            const altData = await altResponse.json();
            processOrdersData(altData);
            return;
          }
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const data = await response.json();
        processOrdersData(data);
        
      } catch (error: any) {
        console.error("Error fetching user orders:", error);
        setOrdersError(error.message || "Could not load your orders");
        toast({
          title: "Error",
          description: error.message || "Could not load your orders. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setOrdersLoading(false);
      }
    };

    const processOrdersData = (data: any) => {
      // Handle different response formats
      let ordersArray = Array.isArray(data) ? data : (data.orders || []);
      
      setUserOrders(
        ordersArray.map((order: any) => ({
          id: order.id,
          productName: order.productName || order.product?.name || "Unknown Product",
          quantity: order.quantity,
          totalAmount: order.totalAmount || order.total || 0,
          status: order.status || "pending",
          orderDate: order.orderDate || order.createdAt || new Date().toISOString(),
        }))
      );
    };

    if (isAuthenticated && user) {
      fetchUserOrders();
    }
  }, [isAuthenticated, user, toast, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const formatKES = (n: number) =>
    new Intl.NumberFormat("en-KE", { 
      style: "currency", 
      currency: "KES", 
      maximumFractionDigits: 0 
    }).format(n);

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
              <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-4xl font-medium">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
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
              <div className="text-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            ) : ordersError ? (
              <div className="text-center py-10">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <p className="text-destructive font-medium">{ordersError}</p>
                <p className="text-muted-foreground mt-2">
                  Please check if the orders endpoint is available or try again later.
                </p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">You have no past orders.</p>
                <Button 
                  onClick={() => navigate("/products")} 
                  className="mt-4"
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                          {formatKES(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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