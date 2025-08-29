import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Still useful for general forms, though not directly used for product order here
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Search } from "lucide-react";
import { useCart } from "@/contexts/CartContext"; // Corrected to alias path
import { useAuth } from "@/contexts/AuthContext"; // Corrected to alias path
import { useNavigate } from "react-router-dom";

type Category = { id: number; name: string; slug: string };

// UPDATED: Product interface uses camelCase to match backend mapProductRow output
type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl: string | null;
  stock: number;
  isActive: boolean;
  category: { id: number; name: string; slug: string } | null;
};

const API = import.meta.env.VITE_API_URL || "https://breezer-electronics-3.onrender.com";

const Shop = () => {
  const { toast } = useToast();
  const { addToCart, cartItemCount } = useCart();
  const { isAuthenticated } = useAuth(); // Keeping for future use, e.g., for login check before adding to cart if needed
  const navigate = useNavigate();

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showProductAddedPopup, setShowProductAddedPopup] = useState(false); // For the notification popup
  const [isCartOpen, setIsCartOpen] = useState(false); // Manages cart modal visibility (now controlled by Navbar)


  // Data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch categories + products
  useEffect(() => {
    const run = async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          fetch(`${API}/api/categories`),
          fetch(`${API}/api/products`)
        ]);

        const cats = await cRes.json();
        const prod = await pRes.json();

        setCategories(cats);

        // Ensure we're taking the 'data' array from the response object
        // The public products endpoint returns { data: [...], meta: {...} }
        const productsData = Array.isArray(prod) ? prod : prod.data;
        const finalProductsArray = Array.isArray(productsData) ? productsData : [];

        setProducts(finalProductsArray);

      } catch (e: any) {
        console.error("Shop: Error fetching data:", e);
        toast({ title: "Failed to load shop", description: `Please try again. ${e.message}`, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [toast]);

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return products.filter(p => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q));
      const matchesCategory =
        selectedCategory === "all" ||
        p.category?.slug === selectedCategory;
      return matchesSearch && matchesCategory && p.isActive;
    });
  }, [products, searchTerm, selectedCategory]);

  const formatKES = (n: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);

  // Handle adding product to cart (called by the "Add to Cart" button on product cards)
  const handleAddToCartClick = (product: Product) => {
    addToCart(product, 1); // Add 1 quantity by default
    setShowProductAddedPopup(true);
    setTimeout(() => setShowProductAddedPopup(false), 3000); // Hide popup after 3 seconds
  };

  return (
    <div className="min-h-screen">
     {/* Hero */}
<section 
  className="text-primary-foreground py-16 relative h-80"
  style={{
    backgroundImage: "url('/shopbg.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
  {/* Optional overlay for better text readability */}
  <div className="absolute inset-0 bg-black/30"></div>
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
    <h1 className="text-5xl font-bold mb-6">Electrical Equipment Shop</h1>
    <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
      Quality electrical equipment, generators, solar systems, and security solutions
    </p>
  </div>
</section>

      {/* Filters */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All Products
              </Button>
              {categories.map((c) => (
                <Button
                  key={c.slug}
                  variant={selectedCategory === c.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(c.slug)}
                >
                  {c.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading products…</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-muted-foreground">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((p) => (
                <Card key={p.id} className="card-professional overflow-hidden">
                  <CardHeader className="space-y-3">
                    {/* Thumbnail */}
                    {p.thumbnailUrl ? (
                      <img
                        src={p.thumbnailUrl}
                        alt={p.name}
                        className="w-full h-44 object-cover rounded-md"
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/176x176/e0e0e0/000000?text=NoImage')} // Placeholder for broken images
                      />
                    ) : (
                      <div className="w-full h-44 rounded-md bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Badge variant={p.stock > 0 ? "default" : "secondary"}>
                        {p.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                      {p.category && (
                        <Badge variant="outline">{p.category.name}</Badge>
                      )}
                    </div>

                    <CardTitle className="text-xl text-primary">{p.name}</CardTitle>
                    <div className="text-2xl font-bold text-secondary">{formatKES(p.price)}</div>
                  </CardHeader>
                 <CardContent className="space-y-4">
  <p className="text-muted-foreground line-clamp-3">{p.description}</p>
  <div className="flex flex-col gap-2">
    <Button
      onClick={() => handleAddToCartClick(p)}
      disabled={p.stock <= 0}
      className="w-full"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {p.stock > 0 ? "Add to Cart" : "Out of Stock"}
    </Button>
    <Button
      onClick={() => window.open(`https://wa.me/254798836266?text=Hello! I want to order: ${p.name} (${formatKES(p.price)})`, '_blank')}
      disabled={p.stock <= 0}
      className="w-full bg-green-600 hover:bg-green-700 text-white"
    >
      <i className="fab fa-whatsapp w-4 h-4 mr-2"></i>
      {p.stock > 0 ? "Order via WhatsApp" : "Out of Stock"}
    </Button>
  </div>
</CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Added to Cart Popup */}
      {showProductAddedPopup && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-xl animate-fade-in-up z-50 flex items-center space-x-3">
          <ShoppingCart className="h-6 w-6" />
          <span>Product added to cart!</span>
          <Button variant="ghost" className="text-white hover:bg-green-700" onClick={() => setShowProductAddedPopup(false)}>
            X
          </Button>
        </div>
      )}
    </div>
  );
};

export default Shop;
