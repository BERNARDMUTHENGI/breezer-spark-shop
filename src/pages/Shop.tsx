import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Search, 
  Filter,
  Cpu,
  Sun,
  Camera,
  Zap,
  Battery,
  Shield
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  features: string[];
  icon: any;
  inStock: boolean;
}

const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  const products: Product[] = [
    {
      id: 1,
      name: "5KVA Diesel Generator",
      category: "generators",
      price: "KSh 85,000",
      description: "Reliable diesel generator perfect for home and small business backup power",
      features: ["5KVA Output", "Automatic Start", "Fuel Efficient", "Low Noise"],
      icon: Cpu,
      inStock: true
    },
    {
      id: 2,
      name: "Solar Panel Kit 300W",
      category: "solar",
      price: "KSh 25,000",
      description: "Complete solar panel kit for residential installations",
      features: ["300W Monocrystalline", "25-year warranty", "High efficiency", "Weather resistant"],
      icon: Sun,
      inStock: true
    },
    {
      id: 3,
      name: "IP Camera System 4CH",
      category: "security",
      price: "KSh 15,000",
      description: "Professional 4-channel CCTV system for property surveillance",
      features: ["1080p HD", "Night vision", "Mobile app", "Motion detection"],
      icon: Camera,
      inStock: true
    },
    {
      id: 4,
      name: "Inverter 2000W Pure Sine Wave",
      category: "electrical",
      price: "KSh 18,000",
      description: "High-quality pure sine wave inverter for clean power output",
      features: ["2000W capacity", "Pure sine wave", "LCD display", "Battery protection"],
      icon: Battery,
      inStock: false
    },
    {
      id: 5,
      name: "Distribution Board 12-Way",
      category: "electrical", 
      price: "KSh 3,500",
      description: "Professional distribution board for electrical installations",
      features: ["12-way capacity", "MCB compatible", "Weatherproof", "Easy installation"],
      icon: Zap,
      inStock: true
    },
    {
      id: 6,
      name: "Alarm System Wireless",
      category: "security",
      price: "KSh 12,000",
      description: "Complete wireless alarm system for home security",
      features: ["Wireless sensors", "Mobile alerts", "Battery backup", "Easy setup"],
      icon: Shield,
      inStock: true
    }
  ];

  const categories = [
    { id: "all", name: "All Products" },
    { id: "generators", name: "Generators" },
    { id: "solar", name: "Solar Equipment" },
    { id: "security", name: "Security Systems" },
    { id: "electrical", name: "Electrical Components" }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOrderProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Order Submitted!",
      description: "We'll contact you shortly with payment details and delivery information.",
    });
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Electrical Equipment Shop</h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Quality electrical equipment, generators, solar systems, and security solutions
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="card-professional overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <product.icon className="h-8 w-8 text-primary" />
                    </div>
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-primary">{product.name}</CardTitle>
                  <div className="text-2xl font-bold text-secondary">{product.price}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{product.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-primary">Features:</h4>
                    <ul className="grid grid-cols-2 gap-1">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-xs text-muted-foreground">
                          <div className="w-1 h-1 bg-secondary rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button 
                    onClick={() => handleOrderProduct(product)}
                    disabled={!product.inStock}
                    className="w-full"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.inStock ? "Order Now" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-primary mb-4">
              Order: {selectedProduct.name}
            </h3>
            <div className="text-lg font-semibold text-secondary mb-4">
              Price: {selectedProduct.price}
            </div>
            
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" required />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" required />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" min="1" defaultValue="1" required />
              </div>
              <div>
                <Label htmlFor="message">Additional Notes</Label>
                <Textarea id="message" placeholder="Delivery address, special requirements, etc." />
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
              
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Submit Order
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSelectedProduct(null)}
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

export default Shop;