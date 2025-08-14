import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Users, 
  Mail, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Package,
  TrendingUp
} from "lucide-react";

interface Order {
  id: number;
  customerName: string;
  email: string;
  product: string;
  quantity: number;
  total: string;
  status: "pending" | "processing" | "completed";
  date: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  stock: number;
  status: "active" | "inactive";
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const { toast } = useToast();

  // Sample data - In real app, this would come from API/database
  const [orders] = useState<Order[]>([
    {
      id: 1,
      customerName: "John Kamau",
      email: "john.kamau@email.com",
      product: "5KVA Diesel Generator",
      quantity: 1,
      total: "KSh 85,000",
      status: "pending",
      date: "2024-01-15"
    },
    {
      id: 2,
      customerName: "Mary Wanjiku",
      email: "mary.w@email.com", 
      product: "Solar Panel Kit 300W",
      quantity: 2,
      total: "KSh 50,000",
      status: "processing",
      date: "2024-01-14"
    },
    {
      id: 3,
      customerName: "Peter Ochieng",
      email: "peter.o@email.com",
      product: "IP Camera System 4CH",
      quantity: 1,
      total: "KSh 15,000",
      status: "completed",
      date: "2024-01-13"
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "5KVA Diesel Generator", price: "KSh 85,000", category: "generators", stock: 5, status: "active" },
    { id: 2, name: "Solar Panel Kit 300W", price: "KSh 25,000", category: "solar", stock: 12, status: "active" },
    { id: 3, name: "IP Camera System 4CH", price: "KSh 15,000", category: "security", stock: 8, status: "active" },
    { id: 4, name: "Inverter 2000W Pure Sine Wave", price: "KSh 18,000", category: "electrical", stock: 0, status: "inactive" }
  ]);

  const stats = [
    {
      title: "Total Orders",
      value: "23",
      change: "+12%",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Revenue",
      value: "KSh 1.2M",
      change: "+8%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Products",
      value: "24",
      change: "+3",
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "Customers",
      value: "156",
      change: "+15%",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newProduct: Product = {
      id: products.length + 1,
      name: formData.get("name") as string,
      price: formData.get("price") as string,
      category: formData.get("category") as string,
      stock: parseInt(formData.get("stock") as string),
      status: "active"
    };
    setProducts([...products, newProduct]);
    setIsAddingProduct(false);
    toast({
      title: "Product Added",
      description: "New product has been added to the catalog.",
    });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Product Deleted",
      description: "Product has been removed from the catalog.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-primary text-primary-foreground min-h-screen p-6">
          <div className="mb-8">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-primary-foreground/80 text-sm">Breezer Electric</p>
          </div>
          
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? "bg-secondary text-secondary-foreground" 
                    : "hover:bg-primary-hover text-primary-foreground/80 hover:text-primary-foreground"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-primary">Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="card-professional">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold text-primary">{stat.value}</p>
                          <p className="text-sm text-green-600">{stat.change}</p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Orders */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-primary">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.product}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-secondary">{order.total}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">Order Management</h2>
              
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-primary">All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Order ID</th>
                          <th className="text-left p-4">Customer</th>
                          <th className="text-left p-4">Product</th>
                          <th className="text-left p-4">Total</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Date</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-muted/50">
                            <td className="p-4">#{order.id}</td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{order.customerName}</p>
                                <p className="text-sm text-muted-foreground">{order.email}</p>
                              </div>
                            </td>
                            <td className="p-4">{order.product}</td>
                            <td className="p-4 font-semibold text-secondary">{order.total}</td>
                            <td className="p-4">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4">{order.date}</td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-primary">Product Management</h2>
                <Button onClick={() => setIsAddingProduct(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
              
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-primary">Product Catalog</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Product Name</th>
                          <th className="text-left p-4">Category</th>
                          <th className="text-left p-4">Price</th>
                          <th className="text-left p-4">Stock</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-muted/50">
                            <td className="p-4 font-medium">{product.name}</td>
                            <td className="p-4 capitalize">{product.category}</td>
                            <td className="p-4 font-semibold text-secondary">{product.price}</td>
                            <td className="p-4">{product.stock}</td>
                            <td className="p-4">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(product.status)}`}>
                                {product.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs content */}
          {activeTab === "customers" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">Customer Management</h2>
              <Card className="card-professional">
                <CardContent className="p-8 text-center">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Customer management features coming soon</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">Settings</h2>
              <Card className="card-professional">
                <CardContent className="p-8 text-center">
                  <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">System settings and configuration options</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-primary mb-4">Add New Product</h3>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <select 
                  id="category" 
                  name="category"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select category</option>
                  <option value="generators">Generators</option>
                  <option value="solar">Solar Equipment</option>
                  <option value="security">Security Systems</option>
                  <option value="electrical">Electrical Components</option>
                </select>
              </div>
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input id="price" name="price" placeholder="KSh 0" required />
              </div>
              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input id="stock" name="stock" type="number" min="0" required />
              </div>
              
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Add Product
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddingProduct(false)}
                >
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

export default Admin;
