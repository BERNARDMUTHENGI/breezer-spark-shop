// --- Imports stay exactly the same ---
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type Category = { id: number; name: string; slug: string };
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
  images: { id?: number; imageUrl: string; sortOrder?: number }[];
};

// --- Image Carousel stays the same ---
// --- Updated ProductImageCarousel component ---
const ProductImageCarousel = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);
  
  // Filter out any empty or invalid image URLs
  const validImages = useMemo(() => {
    return images.filter(img => img && img !== 'null' && img !== 'undefined' && img.trim() !== '');
  }, [images]);
  
  const prev = () => setIndex((i) => (i === 0 ? validImages.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === validImages.length - 1 ? 0 : i + 1));
  
  // If no valid images, show placeholder
  if (!validImages || validImages.length === 0) {
    return (
      <div className="w-full h-44 bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-44">
      <img 
        src={validImages[index]} 
        alt={`Product image ${index + 1}`} 
        className="w-full h-44 object-cover rounded-md"
        onError={(e) => {
          e.currentTarget.src = 'https://placehold.co/176x176/e0e0e0/000000?text=ImageError';
        }} 
      />
      {validImages.length > 1 && (
        <>
          <button 
            onClick={prev} 
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 text-white rounded-full p-1 hover:bg-black transition-all z-10" 
            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={next} 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 text-white rounded-full p-1 hover:bg-black transition-all z-10" 
            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
            {validImages.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const API = import.meta.env.VITE_API_URL || "https://breezer-electronics-3.onrender.com";

// --- PATCHED normalize function ---
const normalizeProductImages = (products: Product[], apiBase: string) => {
  return products.map(p => {
    // --- Handle images array ---
    let images: { imageUrl: string }[] = [];
    if (Array.isArray(p.images)) {
      images = p.images.map(img => {
        let url = '';
        if (typeof img === 'string') url = img;
        else if (typeof img === 'object' && img !== null) {
          url = img.imageUrl || img.imageUrl || '';
        }
        return {
          imageUrl: url.startsWith('http') ? url : `${apiBase}${url.startsWith('/') ? url : '/' + url}`
        };
      });
    }

    // --- Ensure thumbnail ---
    let thumbnailUrl = '';
    if (p.thumbnailUrl) {
      thumbnailUrl = p.thumbnailUrl.startsWith('http')
        ? p.thumbnailUrl
        : `${apiBase}${p.thumbnailUrl.startsWith('/') ? p.thumbnailUrl : '/' + p.thumbnailUrl}`;
    } else if (images.length > 0) {
      thumbnailUrl = images[0].imageUrl;
    } else {
      thumbnailUrl = 'https://placehold.co/176x176/e0e0e0/000000?text=NoImage';
    }

    // --- Map backend category fields to frontend structure ---
    const category = (p as any).category_slug || (p as any).category_id
      ? {
          id: (p as any).category_id || 0,
          name: (p as any).category_name || 'Unknown',
          slug: (p as any).category_slug || 'unknown'
        }
      : null;

    return {
      ...p,
      images,
      thumbnailUrl,
      isActive: Boolean((p as any).is_active ?? p.isActive), // support backend is_active
      category,
    };
  });
};


const Shop = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showProductAddedPopup, setShowProductAddedPopup] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const run = async () => {
    try {
      setLoading(true);
      console.log("Fetching data from:", API);
      
      const [cRes, pRes] = await Promise.all([
        fetch(`${API}/api/categories`),
        fetch(`${API}/api/products`)
      ]);
      
      const cats = await cRes.json();
      const prod = await pRes.json();
      
      console.log("Categories response:", cats);
      console.log("Products response:", prod);
      
      setCategories(cats || []);
      
      // Handle different response structures
      let finalProductsArray: Product[] = [];
      if (Array.isArray(prod)) {
        finalProductsArray = prod;
      } else if (prod && Array.isArray(prod.data)) {
        finalProductsArray = prod.data;
      } else if (prod && Array.isArray(prod.products)) {
        finalProductsArray = prod.products;
      }
      
      console.log("Final products array:", finalProductsArray);
      
      const normalized = normalizeProductImages(finalProductsArray, API);
      console.log("Normalized products:", normalized);
      setProducts(normalized);
    } catch (e: any) {
      console.error("Shop: Error fetching data:", e);
      toast({ 
        title: "Failed to load shop", 
        description: `Please try again. ${e.message}`, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };
  run();
}, [toast]);

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return products.filter(p => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === "all" || p.category?.slug === selectedCategory;
      return matchesSearch && matchesCategory && p.isActive;
    });
  }, [products, searchTerm, selectedCategory]);

  const formatKES = (n: number) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);

  const handleAddToCartClick = (product: Product) => {
    addToCart(product, 1);
    setShowProductAddedPopup(true);
    setTimeout(() => setShowProductAddedPopup(false), 3000);
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
                    {/* UPDATED: Replaced thumbnail with image carousel */}
                   
<ProductImageCarousel
  images={
    p.images && p.images.length > 0
      ? p.images.map(img => img.imageUrl).filter(url => url && url.trim() !== '')
      : p.thumbnailUrl
      ? [p.thumbnailUrl]
      : []
  }
/>

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