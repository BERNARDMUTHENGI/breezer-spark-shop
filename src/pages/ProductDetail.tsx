import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {ChevronLeft, ChevronRight} from "lucide-react"

const API = import.meta.env.VITE_API_URL || "https://breezer-electronics-3.onrender.com";

// Add the normalize function from your shop page
const normalizeProductImages = (product, apiBase) => {
  let images = [];

  if (Array.isArray(product.images)) {
    images = product.images.map(img => {
      let imageUrl = '';
      
      // Use a direct approach: check for nested 'url' or 'path'
      if (typeof img.imageUrl === 'object' && img.imageUrl !== null) {
        imageUrl = img.imageUrl.url || img.imageUrl.path;
      } else if (typeof img.imageUrl === 'string') {
        imageUrl = img.imageUrl;
      }
      
      // If a valid URL was found, construct the full URL
      if (imageUrl) {
        const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${apiBase}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
        return { imageUrl: fullUrl };
      }
      
      // If no valid URL was found, return null
      return null;
    }).filter(Boolean); // This filters out all null entries
  }

  // Determine the thumbnail URL with fallbacks
  let thumbnailUrl = product.thumbnailUrl;
  if (!thumbnailUrl && images.length > 0) {
    thumbnailUrl = images[0].imageUrl;
  } else if (thumbnailUrl && !thumbnailUrl.startsWith('http')) {
    thumbnailUrl = `${apiBase}${thumbnailUrl.startsWith('/') ? thumbnailUrl : '/' + thumbnailUrl}`;
  }
  
  if (!thumbnailUrl) {
    thumbnailUrl = 'https://placehold.co/600x600/e0e0e0/000000?text=NoImage';
  }

  const category = (product.category_slug || product.category_id)
    ? {
        id: product.category_id || 0,
        name: product.category_name || 'Unknown',
        slug: product.category_slug || 'unknown'
      }
    : null;

  return {
    ...product,
    images,
    thumbnailUrl,
    isActive: Boolean(product.is_active ?? product.isActive),
    category,
  };
};

// Create a simple image carousel component for the product detail page
const ProductImageCarousel = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);
  
  // Filter out any empty or invalid image URLs
  const validImages = images.filter(img => img && img !== 'null' && img !== 'undefined' && img.trim() !== '');
  
  const prev = () => setIndex((i) => (i === 0 ? validImages.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === validImages.length - 1 ? 0 : i + 1));
  
  // If no valid images, show placeholder
  if (!validImages || validImages.length === 0) {
    return (
      <div className="w-full h-96 bg-muted flex items-center justify-center rounded-lg">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-96">
      <img 
        src={validImages[index]} 
        alt={`Product image ${index + 1}`} 
        className="w-full h-96 object-contain rounded-lg border"
        onError={(e) => {
          e.currentTarget.src = 'https://placehold.co/600x600/e0e0e0/000000?text=ImageError';
        }} 
      />
      {validImages.length > 1 && (
        <>
          <button 
            onClick={prev} 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 text-white rounded-full p-2 hover:bg-black transition-all z-10" 
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={next} 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 text-white rounded-full p-2 hover:bg-black transition-all z-10" 
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {validImages.map((_, i) => (
              <div 
                key={i} 
                className={`h-3 w-3 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProductAddedPopup, setShowProductAddedPopup] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // First try to fetch all products and find the one with matching slug
        const response = await fetch(`${API}/api/products`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const productsData = await response.json();
        
        // Handle different response structures
        let productsArray = [];
        if (Array.isArray(productsData)) {
          productsArray = productsData;
        } else if (productsData && Array.isArray(productsData.data)) {
          productsArray = productsData.data;
        } else if (productsData && Array.isArray(productsData.products)) {
          productsArray = productsData.products;
        }
        
        // Normalize the products
        const normalizedProducts = productsArray.map(p => normalizeProductImages(p, API));
        
        // Find the product by slug or id
        const foundProduct = normalizedProducts.find(p => 
          p.slug === slug || p.id.toString() === slug
        );
        
        if (!foundProduct) {
          throw new Error('Product not found');
        }
        
        setProduct(foundProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Failed to load product",
          description: "Please try again later.",
          variant: "destructive"
        });
        // Redirect back to shop after a delay
        setTimeout(() => navigate('/shop'), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, toast, navigate]);

  const formatKES = (n: number) => new Intl.NumberFormat("en-KE", { 
    style: "currency", 
    currency: "KES", 
    maximumFractionDigits: 0 
  }).format(n);

  const handleAddToCartClick = () => {
    addToCart(product, 1);
    setShowProductAddedPopup(true);
    setTimeout(() => setShowProductAddedPopup(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        <div className="text-center text-muted-foreground">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get all image URLs for the carousel
  const imageUrls = product.images && product.images.length > 0 
    ? product.images.map((img: any) => img.imageUrl) 
    : product.thumbnailUrl 
      ? [product.thumbnailUrl] 
      : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Button asChild variant="outline" className="mb-6">
          <Link to="/shop">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        {/* Product Detail Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <ProductImageCarousel images={imageUrls} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {product.name}
              </h1>
              {product.category && (
                <Badge variant="outline" className="mt-2">
                  {product.category.name}
                </Badge>
              )}
            </div>

            <div className="flex items-center">
              <p className="text-3xl font-bold text-secondary">
                {formatKES(product.price)}
              </p>
              <Badge variant={product.stock > 0 ? "default" : "secondary"} className="ml-4">
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>{product.description}</p>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleAddToCartClick}
                disabled={product.stock <= 0}
                size="lg"
                className="w-full md:w-auto"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
              
              <Button
                onClick={() => window.open(`https://wa.me/254798836266?text=Hello! I want to order: ${product.name} (${formatKES(product.price)}) - ${window.location.href}`, '_blank')}
                disabled={product.stock <= 0}
                size="lg"
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
              >
                <i className="fab fa-whatsapp w-5 h-5 mr-2"></i>
                {product.stock > 0 ? "Order via WhatsApp" : "Out of Stock"}
              </Button>
            </div>

            {/* Additional product information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Product Details</h3>
              <p className="text-muted-foreground">
                For more information about this product, please contact us via WhatsApp or visit our store.
              </p>
            </div>
          </div>
        </div>
      </div>

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

export default ProductDetail;