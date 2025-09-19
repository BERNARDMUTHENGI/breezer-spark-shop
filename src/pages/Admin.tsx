
import { useState,lazy, Suspense, useEffect, useCallback, useMemo } from "react";
const ReactQuill = lazy(() => import("react-quill"));
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Users,
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  TrendingUp,
  LogOut,
  Link,
  Info, // For Description
  Hash, // For SKU
  Image as ImageIcon, // For Thumbnail URL
  ToggleLeft, // For isActive status
  LayoutDashboard, // For Dashboard
  List, // For Categories
  Briefcase, // For Portfolio
  Calendar, // For project year
  MapPin, // For project location
  Tag, // For project category string
  Feather, // For description
  Type, // For project type
  Link2, // For image URL
  Home, // For ProjectType icons
  Building, // For ProjectType icons
  Factory, // For ProjectType icons
  Award, // For ProjectType icons
  Menu, // For mobile menu
  Pen,
  X // For mobile menu close
} from "lucide-react";

// Define interfaces for data structures reflecting the new backend schema
interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number; // Now a number
  formattedPrice: string; // For display
  sku: string | null;
  thumbnailUrl: string | null;
  stock: number;
  isActive: boolean; // Renamed from is_active
  category: { id: number; name: string; slug: string } | null;
  images?: { id: number; imageUrl: string; sortOrder: number }[]; // Optional for full product view
}

interface Order {
  id: number;
  productId: number; // New field to link to product
  productName: string; // New field from join
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null; // New field
  notes: string | null;
  totalAmount: number; // Now a number
  total: string; // Formatted for display
  status: "pending" | "processing" | "completed";
  orderDate: string; // Renamed from date
  createdAt: string;
  updatedAt: string;
}

interface DashboardStat {
  title: string;
  value: string;
  change: string;
  icon: any; // Lucide icon component
  color: string;
}

// Interface for Categories
interface Category {
  id: number;
  name: string;
  slug: string;
}

// Interface for Project Types (e.g., Residential, Commercial)
interface ProjectType {
    id: number; // Database ID for the type
    name: string;
    slug: string;
    icon: string; // Icon name from Lucide (e.g., 'Home', 'Building')
}

// Interface for Portfolio Projects
interface PortfolioProject {
    id: number;
    title: string;
    slug: string;
    description: string;
    category: string; // This is the string category field
    type: string; // This is the slug of the project type (e.g., 'residential')
    type_name: string; // The actual name of the project type (e.g., 'Residential')
    location: string;
    year: string;
    services: string[]; // Array of services, will be joined/split
    image: string; // URL of the project image
    createdAt?: string; // Optional for new projects
    updatedAt?: string; // Optional
}

const API_BASE_URL = "https://breezer-electronics-3.onrender.com/api";


const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // New state for Categories
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  //state for upload image from local storage
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  // New state for Portfolio Projects
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [currentProject, setCurrentProject] = useState<PortfolioProject | null>(null);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]); // To populate project type dropdown

  // New state for Project Types CRUD
  const [isAddingProjectType, setIsAddingProjectType] = useState(false);
  const [isEditingProjectType, setIsEditingProjectType] = useState(false);
  const [currentProjectType, setCurrentProjectType] = useState<ProjectType | null>(null);

  const [productDescription, setProductDescription] = useState("");



  const { toast } = useToast();

  // State to hold fetched data
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStat[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // New state for categories
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]); // New state for portfolio projects

  // Helper function to get status color (kept as is)
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

  // Helper to map icon names to Lucide components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Home': return Home;
      case 'Building': return Building;
      case 'Factory': return Factory;
      case 'Award': return Award;
      default: return Type; // Default icon if not found
    }
  };

// Add this function to handle image uploads
 const handleImageUpload = async (file: File | null) => {
    if (!file) return null;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();

      // Ensure full URL
      const fullUrl = data.imageUrl.startsWith("http")
        ? data.imageUrl
        : `${API_BASE_URL}${data.imageUrl}`;

      setUploadedImageUrl(fullUrl);
      setIsUploading(false);
      return fullUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };



  // --- API Fetching Functions ---

  const fetchCategories = useCallback(async () => {
    console.log("Frontend: Attempting to fetch categories...");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Category[] = await response.json();
      console.log("Frontend: Fetched categories:", data);
      setCategories(data);
    } catch (error) {
      console.error("Frontend: Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories for forms.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchDashboardStats = useCallback(async () => {
    console.log("Frontend: Attempting to fetch dashboard stats...");
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Frontend: Fetched dashboard stats:", data);
      const mappedStats: DashboardStat[] = data.stats.map((stat: any) => {
        let iconComponent;
        switch (stat.title) {
          case "Total Orders": iconComponent = ShoppingCart; break;
          case "Revenue": iconComponent = DollarSign; break;
          case "Products": iconComponent = Package; break;
          case "Customers": iconComponent = Users; break;
          default: iconComponent = TrendingUp;
        }
        return {
          ...stat,
          icon: iconComponent,
          color: stat.title === "Total Orders" ? "text-blue-600" :
                 stat.title === "Revenue" ? "text-green-600" :
                 stat.title === "Products" ? "text-purple-600" :
                 "text-orange-600",
        };
      });
      setDashboardStats(mappedStats);
      setRecentOrders(data.recentOrders);
    } catch (error) {
      console.error("Frontend: Error fetching dashboard stats:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchOrders = useCallback(async () => {
  console.log("Frontend: Attempting to fetch orders...");
  try {
    const token = localStorage.getItem("token"); // Ensure your login stores the JWT here
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    const response = await fetch(`${API_BASE_URL}/admin/orders`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add token here
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Order[] = await response.json();
    console.log("Frontend: Fetched orders:", data);
    setOrders(data);
  } catch (error: any) {
    console.error("Frontend: Error fetching orders:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to load orders.",
      variant: "destructive",
    });
  }
}, [toast]);


  const fetchProducts = useCallback(async () => {
    console.log("Frontend: Attempting to fetch products...");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Frontend: HTTP error fetching products! Status: ${response.status}, Response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
      const rawData = await response.json();
      console.log("Frontend: Raw Fetched products response (for admin):", rawData);
      const finalProductsArray = Array.isArray(rawData) ? rawData : (Array.isArray(rawData.data) ? rawData.data : []);
      console.log("Frontend: Processed products data for state (for admin):", finalProductsArray);
      setProducts(finalProductsArray);
    } catch (error: any) {
      console.error("Frontend: CAUGHT ERROR fetching products (for admin):", error);
      toast({
        title: "Error",
        description: `Failed to load products: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchPortfolioProjects = useCallback(async () => {
    console.log("Frontend: Attempting to fetch portfolio projects...");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/portfolio`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Frontend: HTTP error fetching portfolio projects! Status: ${response.status}, Response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
      const data: PortfolioProject[] = await response.json();
      console.log("Frontend: Fetched portfolio projects:", data);
      setPortfolioProjects(data);
    } catch (error: any) {
      console.error("Frontend: Error fetching portfolio projects:", error);
      toast({
        title: "Error",
        description: `Failed to load portfolio projects: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchProjectTypes = useCallback(async () => {
    console.log("Frontend: Attempting to fetch project types...");
    try {
      // Assuming backend endpoint for admin project types is /admin/portfolio/types
      const response = await fetch(`${API_BASE_URL}/portfolio/types`); // public endpoint is also fine for fetching types
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ProjectType[] = await response.json();
      console.log("Frontend: Fetched project types:", data);
      setProjectTypes(data);
    } catch (error: any) {
      console.error("Frontend: Error fetching project types:", error);
      toast({
        title: "Error",
        description: `Failed to load project types: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Initial data fetch on component mount
  useEffect(() => {
    console.log("Frontend: Admin component mounted, triggering data fetches.");
    fetchDashboardStats();
    fetchOrders();
    fetchProducts();
    fetchCategories();
    fetchPortfolioProjects(); // New fetch for portfolio projects
    fetchProjectTypes(); // New fetch for project types for forms
  }, [fetchDashboardStats, fetchOrders, fetchProducts, fetchCategories, fetchPortfolioProjects, fetchProjectTypes]);

  // --- CRUD Operations Handlers for Products ---
const handleAddProduct = async (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);

  // Handle images
  const imageFiles = (formData.getAll("images") as File[]).filter(f => f instanceof File);
  const uploadedImageUrls: string[] = [];
  for (const file of imageFiles) {
    const uploadedUrl = await handleImageUpload(file);
    if (uploadedUrl) uploadedImageUrls.push(uploadedUrl);
  }

  const newProductData = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    price: parseFloat(formData.get("price") as string),
    sku: (formData.get("sku") as string) || null,
    thumbnailUrl: (formData.get("thumbnailUrl") as string) || null,
    stock: parseInt(formData.get("stock") as string),
    isActive: formData.get("isActive") === "on",
    categoryId: formData.get("categoryId") ? parseInt(formData.get("categoryId") as string) : null,
    images: uploadedImageUrls.map((url, index) => ({
      imageUrl: url,
      sortOrder: index,
    })),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProductData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add product");
    }

    const result = await response.json();
    toast({
      title: "Product Added",
      description: result.message,
    });
    setIsAddingProduct(false);
    fetchProducts(); // Re-fetch products to update the list
    fetchDashboardStats(); // Re-fetch dashboard stats to update the count
  } catch (error: any) {
    console.error("Error adding product:", error);
    toast({
      title: "Error",
      description: `Failed to add product: ${error.message}`,
      variant: "destructive",
    });
  }
};

const handleEditProduct = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!currentProduct) return;

  const form = e.currentTarget as HTMLFormElement;
  const formData = new FormData(form);

  // Append existing images from hidden field
  const existingImagesStr = formData.get("extraImages") as string;
  if (existingImagesStr) {
    const existingImages = existingImagesStr.split(",");
    existingImages.forEach(img => formData.append("images", img));
  }

  try {
    const res = await fetch(`${API_BASE_URL}/admin/products/${currentProduct.id}`, {
      method: "PUT",
      body: formData, // multipart/form-data
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");

    toast({
      title: "Product Updated",
      description: data.message || "Product updated successfully",
    });

    setIsEditingProduct(false);
    setCurrentProduct(null);

    // Update products in state immediately
    setProducts(prev => prev.map(p => p.id === data.id ? data : p));

  } catch (err: any) {
    console.error("Error updating product:", err);
    toast({
      title: "Error",
      description: `Failed to update product: ${err.message}`,
      variant: "destructive",
    });
  }
};




  const handleDeleteProduct = async (id: number) => { /* ... (existing code) ... */
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      const result = await response.json();
      toast({
        title: "Product Deleted",
        description: result.message,
      });
      fetchProducts();
      fetchDashboardStats();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditButtonClick = (product: Product) => {
    setCurrentProduct(product);
    setIsEditingProduct(true);
  };

  // --- CRUD Operations Handlers for Orders ---

const handleUpdateOrderStatus = async (orderId: number, currentStatus: string) => {
  let newStatus: "pending" | "processing" | "completed";
  if (currentStatus === "pending") {
    newStatus = "processing";
  } else if (currentStatus === "processing") {
    newStatus = "completed";
  } else {
    newStatus = "pending";
  }

  if (!window.confirm(`Change order #${orderId} status from '${currentStatus}' to '${newStatus}'?`)) {
    return;
  }

  try {
    const token = localStorage.getItem("token"); // Get JWT token from storage
    if (!token) throw new Error("No authentication token found. Please log in.");

    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add token here
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update order status");
    }

    const result = await response.json();
    toast({
      title: "Order Updated",
      description: result.message,
    });
    fetchOrders();
    fetchDashboardStats();
  } catch (error: any) {
    console.error("Error updating order status:", error);
    toast({
      title: "Error",
      description: `Failed to update order: ${error.message}`,
      variant: "destructive",
    });
  }
};

const handleDeleteOrder = async (id: number) => {
  if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
    return;
  }

  try {
    const token = localStorage.getItem("token"); // Get JWT token from storage
    if (!token) throw new Error("No authentication token found. Please log in.");

    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Add token here
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete order");
    }

    const result = await response.json();
    toast({
      title: "Order Deleted",
      description: result.message,
    });
    fetchOrders();
    fetchDashboardStats();
  } catch (error: any) {
    console.error("Error deleting order:", error);
    toast({
      title: "Error",
      description: `Failed to delete order: ${error.message}`,
      variant: "destructive",
    });
  }
};
  // --- CRUD Operations Handlers for Categories ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newCategoryData = {
      name: formData.get("name") as string,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add category");
      }

      const result = await response.json();
      toast({
        title: "Category Added",
        description: result.message,
      });
      setIsAddingCategory(false);
      fetchCategories(); // Re-fetch categories to update the list
      fetchDashboardStats(); // Update dashboard stats if category count is there
    } catch (error: any) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: `Failed to add category: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const updatedCategoryData = {
      name: formData.get("name") as string,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories/${currentCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCategoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update category");
      }

      const result = await response.json();
      toast({
        title: "Category Updated",
        description: result.message,
      });
      setIsEditingCategory(false);
      setCurrentCategory(null);
      fetchCategories(); // Re-fetch categories to update the list
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: `Failed to update category: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category? This action cannot be undone and may affect linked products.")) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      const result = await response.json();
      toast({
        title: "Category Deleted",
        description: result.message,
      });
      fetchCategories(); // Re-fetch categories
      fetchDashboardStats(); // Update dashboard stats if category count is there
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: `Failed to delete category: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // --- CRUD Operations Handlers for Portfolio Projects ---
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newProjectData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string, // This is the string category field
      typeId: formData.get("typeId") ? parseInt(formData.get("typeId") as string) : null, // ID from project_types table
      location: formData.get("location") as string,
      year: formData.get("year") as string,
      services: (formData.get("services") as string).split(',').map(s => s.trim()), // Split comma-separated string
      imageUrl: formData.get("imageUrl") as string,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/portfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProjectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add project");
      }

      const result = await response.json();
      toast({
        title: "Project Added",
        description: result.message,
      });
      setIsAddingProject(false);
      fetchPortfolioProjects(); // Re-fetch projects to update the list
    } catch (error: any) {
      console.error("Error adding project:", error);
      toast({
        title: "Error",
        description: `Failed to add project: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const updatedProjectData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      typeId: formData.get("typeId") ? parseInt(formData.get("typeId") as string) : null,
      location: formData.get("location") as string,
      year: formData.get("year") as string,
      services: (formData.get("services") as string).split(',').map(s => s.trim()),
      imageUrl: formData.get("imageUrl") as string,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/portfolio/${currentProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProjectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project");
      }

      const result = await response.json();
      toast({
        title: "Project Updated",
        description: result.message,
      });
      setIsEditingProject(false);
      setCurrentProject(null);
      fetchPortfolioProjects(); // Re-fetch projects to update the list
    } catch (error: any) {
      console.error("Error updating project:", error);
      toast({
        title: "Error",
        description: `Failed to update project: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/admin/portfolio/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete project");
      }

      const result = await response.json();
      toast({
        title: "Project Deleted",
        description: result.message,
      });
      fetchPortfolioProjects(); // Re-fetch projects to update the list
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: `Failed to delete project: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditProjectButtonClick = (project: PortfolioProject) => {
    setCurrentProject(project);
    setIsEditingProject(true);
  };

  // --- CRUD Operations Handlers for Project Types (NEW) ---
  const handleAddProjectType = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newProjectTypeData = {
      name: formData.get("name") as string,
      icon: (formData.get("icon") as string) || null, // Make icon optional
    };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/portfolio/types`, { // Assuming this endpoint for project type CRUD
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProjectTypeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add project type");
      }

      const result = await response.json();
      toast({
        title: "Project Type Added",
        description: result.message,
      });
      setIsAddingProjectType(false);
      fetchProjectTypes(); // Re-fetch project types to update the list
      fetchPortfolioProjects(); // Refresh portfolio projects as type names might have changed
    } catch (error: any) {
      console.error("Error adding project type:", error);
      toast({
        title: "Error",
        description: `Failed to add project type: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditProjectType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProjectType) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const updatedProjectTypeData = {
      name: formData.get("name") as string,
      icon: (formData.get("icon") as string) || null, // Make icon optional
    };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/portfolio/types/${currentProjectType.id}`, { // Assuming this endpoint
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProjectTypeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project type");
      }

      const result = await response.json();
      toast({
        title: "Project Type Updated",
        description: result.message,
      });
      setIsEditingProjectType(false);
      setCurrentProjectType(null);
      fetchProjectTypes(); // Re-fetch project types to update the list
      fetchPortfolioProjects(); // Refresh portfolio projects as type names might have changed
    } catch (error: any) {
      console.error("Error updating project type:", error);
      toast({
        title: "Error",
        description: `Failed to update project type: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProjectType = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project type? This action cannot be undone and may affect linked portfolio projects.")) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/admin/portfolio/types/${id}`, { // Assuming this endpoint
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete project type");
      }

      const result = await response.json();
      toast({
        title: "Project Type Deleted",
        description: result.message,
      });
      fetchProjectTypes(); // Re-fetch project types
      fetchPortfolioProjects(); // Refresh portfolio projects if a type was deleted
    } catch (error: any) {
      console.error("Error deleting project type:", error);
      toast({
        title: "Error",
        description: `Failed to delete project type: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditProjectTypeButtonClick = (type: ProjectType) => {
    setCurrentProjectType(type);
    setIsEditingProjectType(true);
  };

  // Filtered data for display in Admin.tsx
  const filteredProducts = useMemo(() => {
    return products; // Admin view shows all products fetched
  }, [products]);

  const filteredCategories = useMemo(() => {
    return categories; // Admin view shows all categories fetched
  }, [categories]);

  const filteredPortfolioProjects = useMemo(() => {
    return portfolioProjects; // Admin view shows all portfolio projects fetched
  }, [portfolioProjects]);


  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: List },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "project-types", label: "Project Types", icon: Type }, // New tab
  
  ];

  return (
    <div className="min-h-screen bg-muted/30 font-inter">
      {/* Mobile Header - Fixed position */}
      <div className="lg:hidden bg-primary text-primary-foreground p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-primary-foreground"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Add padding to account for fixed header on mobile */}
      <div className="lg:hidden pt-16"></div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block w-64 bg-primary text-primary-foreground min-h-screen p-6 shadow-lg rounded-r-xl fixed lg:static z-40`}>
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight">Admin</h1>
            <p className="text-primary-foreground/80 text-sm">Breezer Electric</p>
          </div>
          

          <nav className="space-y-3">
            
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-5 py-3 rounded-xl transition-all duration-200 ease-in-out
                ${activeTab === tab.id
                    ? "bg-secondary text-secondary-foreground shadow-md transform scale-105"
                    : "hover:bg-primary-hover text-primary-foreground/80 hover:text-primary-foreground hover:scale-[1.02]"
                }
                `}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
           

            <a 
              href="/blogadmin" 
              className="flex items-center mt-4 ml-2 text-lg font-bold text-white-600"
            >
              <Pen className="w-5 h-5 mr-2" />
              Write Blog
            </a>

            <div className="pt-8 space-y-3 border-t border-primary-hover mt-8">
              <Button
                variant="ghost"
                className="w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-primary-foreground/80 hover:bg-primary-hover hover:text-primary-foreground justify-start"
                onClick={() => window.open("https://breezerelectric.com", "_blank")}
              >
                <Link className="h-5 w-5" />
                <span className="font-medium">Visit Website</span>
              </Button>
              {/* <Button
                variant="ghost"
                className="w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-red-300 hover:bg-primary-hover hover:text-red-100 justify-start"
                onClick={() => { toast({ title: "Logged out!", description: "You have been successfully logged out.", duration: 3000 }); }}
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </Button> */}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-10 lg:ml-0">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 lg:space-y-10">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-primary">Dashboard Overview</h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                {dashboardStats.map((stat, index) => (
                  <Card key={index} className="rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl lg:text-3xl font-bold text-primary mt-1">{stat.value}</p>
                          <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                            {stat.change.startsWith('+') ? <TrendingUp className="h-4 w-4 mr-1" /> : null}
                            {stat.change}
                          </p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.color.replace('text-', 'bg-')}/10`}>
                            <stat.icon className={`h-6 w-6 lg:h-8 lg:w-8 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Orders */}
              <Card className="rounded-xl shadow-lg border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-primary">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div>
                            <p className="font-semibold text-lg">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.productName} (x{order.quantity})</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xl text-secondary">{order.total}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                        <p className="text-center text-muted-foreground py-4">No recent orders.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary">Order Management</h2>

              <Card className="rounded-xl shadow-lg border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-primary">All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse">
                      <thead>
                        <tr className="border-b bg-gray-50 text-left text-sm font-semibold text-muted-foreground">
                          <th className="p-4 rounded-tl-lg">Order ID</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Product</th>
                          <th className="p-4">Quantity</th>
                          <th className="p-4">Total</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 rounded-tr-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length > 0 ? (
                          orders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="p-4 font-medium text-gray-700">#{order.id}</td>
                              <td className="p-4">
                                <div>
                                  <p className="font-medium">{order.customerName}</p>
                                  <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                                  {order.customerPhone && <p className="text-xs text-muted-foreground">Phone: {order.customerPhone}</p>}
                                </div>
                              </td>
                              <td className="p-4">{order.productName}</td>
                              <td className="p-4">{order.quantity}</td>
                              <td className="p-4 font-semibold text-secondary">{order.total}</td>
                              <td className="p-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="p-4 text-sm text-muted-foreground">{new Date(order.orderDate).toLocaleDateString()}</td>
                              <td className="p-4">
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button size="sm" variant="outline" title="View Details">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" title="Change Status" onClick={() => handleUpdateOrderStatus(order.id, order.status)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive" title="Delete Order" onClick={() => handleDeleteOrder(order.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="text-center p-6 text-muted-foreground">No orders found.</td>
                          </tr>
                        )}
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-primary">Product Management</h2>
                <Button onClick={() => setIsAddingProduct(true)} className="px-4 py-2 lg:px-6 lg:py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                  <Plus className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                  <span className="hidden sm:inline">Add Product</span>
                </Button>
              </div>

              <Card className="rounded-xl shadow-lg border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-primary">Product Catalog</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] border-collapse">
                      <thead>
                        <tr className="border-b bg-gray-50 text-left text-sm font-semibold text-muted-foreground">
                          <th className="p-4 rounded-tl-lg">Product Name</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Stock</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Thumbnail</th>
                          <th className="p-4 rounded-tr-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="p-4 font-medium text-gray-700">{product.name}</td>
                              <td className="p-4 capitalize">{product.category ? product.category.name : 'N/A'}</td>
                              <td className="p-4 font-semibold text-secondary">{product.formattedPrice}</td>
                              <td className="p-4">{product.stock}</td>
                              <td className="p-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.isActive ? 'active' : 'inactive')}`}>
                                  {product.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="p-4">
                                {product.thumbnailUrl ? (
                                    <img src={product.thumbnailUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md" onError={(e) => (e.currentTarget.src = 'https://placehold.co/48x48/e0e0e0/000000?text=NoImage')} />
                                ) : (
                                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                )}
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button size="sm" variant="outline" title="Edit Product" onClick={() => handleEditButtonClick(product)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    title="Delete Product"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center p-6 text-muted-foreground">No products found. Add a new product!</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-primary">Category Management</h2>
                <Button onClick={() => setIsAddingCategory(true)} className="px-4 py-2 lg:px-6 lg:py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                  <Plus className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                  <span className="hidden sm:inline">Add Category</span>
                </Button>
              </div>

              <Card className="rounded-xl shadow-lg border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-primary">All Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] border-collapse">
                      <thead>
                        <tr className="border-b bg-gray-50 text-left text-sm font-semibold text-muted-foreground">
                          <th className="p-4 rounded-tl-lg">Category ID</th>
                          <th className="p-4">Name</th>
                          <th className="p-4">Slug</th>
                          <th className="p-4 rounded-tr-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((category) => (
                            <tr key={category.id} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="p-4 font-medium text-gray-700">#{category.id}</td>
                              <td className="p-4">{category.name}</td>
                              <td className="p-4 text-muted-foreground">{category.slug}</td>
                              <td className="p-4">
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button size="sm" variant="outline" title="Edit Category" onClick={() => { setCurrentCategory(category); setIsEditingCategory(true); }}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    title="Delete Category"
                                    onClick={() => handleDeleteCategory(category.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center p-6 text-muted-foreground">No categories found. Add a new category!</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

         {/* Portfolio Tab */}
{activeTab === "portfolio" && (
  <div className="space-y-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl lg:text-3xl font-bold text-primary">Portfolio Management</h2>
      <Button onClick={() => setIsAddingProject(true)} className="px-4 py-2 lg:px-6 lg:py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
        <Plus className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="hidden sm:inline">Add Project</span>
      </Button>
    </div>

    <Card className="rounded-xl shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="text-primary">All Portfolio Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm font-semibold text-muted-foreground">
                <th className="p-4 rounded-tl-lg">Project Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Type</th>
                <th className="p-4">Location</th>
                <th className="p-4">Year</th>
                <th className="p-4 max-w-[200px]">Services</th>
                <th className="p-4">Image</th>
                <th className="p-4 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPortfolioProjects.length > 0 ? (
                filteredPortfolioProjects.map((project) => (
                  <tr key={project.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium text-gray-700">{project.title}</td>
                    <td className="p-4">{project.category}</td>
                    <td className="p-4 capitalize">{project.type_name || 'N/A'}</td>
                    <td className="p-4">{project.location}</td>
                    <td className="p-4">{project.year}</td>
                    <td className="p-4 text-sm text-muted-foreground max-w-[200px] truncate" title={project.services && project.services.length > 0 ? project.services.join(', ') : 'N/A'}>
                      {project.services && project.services.length > 0 ? project.services.join(', ') : 'N/A'}
                    </td>
                    <td className="p-4">
                      {project.image ? (
                          <img src={project.image} alt={project.title} className="w-12 h-12 object-cover rounded-md" onError={(e) => (e.currentTarget.src = 'https://placehold.co/48x48/e0e0e0/000000?text=NoImage')} />
                      ) : (
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button size="sm" variant="outline" title="Edit Project" onClick={() => handleEditProjectButtonClick(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          title="Delete Project"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center p-6 text-muted-foreground">No portfolio projects found. Add a new project!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
)}

          {/* Project Types Tab */}
          {activeTab === "project-types" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-primary">Project Type Management</h2>
                <Button onClick={() => setIsAddingProjectType(true)} className="px-4 py-2 lg:px-6 lg:py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                  <Plus className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                  <span className="hidden sm:inline">Add Project Type</span>
                </Button>
              </div>

              <Card className="rounded-xl shadow-lg border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-primary">All Project Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] border-collapse">
                      <thead>
                        <tr className="border-b bg-gray-50 text-left text-sm font-semibold text-muted-foreground">
                          <th className="p-4 rounded-tl-lg">ID</th>
                          <th className="p-4">Name</th>
                          <th className="p-4">Slug</th>
                          <th className="p-4">Icon</th>
                          <th className="p-4 rounded-tr-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectTypes.length > 0 ? (
                          projectTypes.map((type) => {
                            const IconComponent = getIconComponent(type.icon);
                            return (
                              <tr key={type.id} className="border-b hover:bg-muted/50 transition-colors">
                                <td className="p-4 font-medium text-gray-700">#{type.id}</td>
                                <td className="p-4">{type.name}</td>
                                <td className="p-4 text-muted-foreground">{type.slug}</td>
                                <td className="p-4">
                                  {type.icon ? (
                                    <>
                                      <IconComponent className="h-5 w-5 text-muted-foreground" /> ({type.icon})
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">No Icon</span>
                                  )}
                                </td>
                                <td className="p-4">
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <Button size="sm" variant="outline" title="Edit Type" onClick={() => handleEditProjectTypeButtonClick(type)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      title="Delete Type"
                                      onClick={() => handleDeleteProjectType(type.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center p-6 text-muted-foreground">No project types found. Add a new type!</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

   {/* Add Product Modal */}
{/* Add Product Modal */}
{isAddingProduct && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl mx-auto my-auto">
      <h3 className="text-2xl font-bold text-primary mb-6">Add New Product</h3>

      <form onSubmit={handleAddProduct} className="space-y-5">
        {/* Product Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
            <Package className="h-4 w-4 mr-2" />Product Name *
          </Label>
          <Input id="name" name="name" required className="mt-1 focus:border-blue-500 focus:ring-blue-500 rounded-md" />
        </div>

        {/* Description */}
        {/* Description */}
<div>
  <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center">
    <Info className="h-4 w-4 mr-2" />Description
  </Label>
  <Suspense fallback={<div>Loading editor...</div>}>
    <ReactQuill
      value={productDescription} // use useState for description
      onChange={setProductDescription} // update on change
      theme="snow"
      className="mt-1 bg-white"
    />
  </Suspense>
</div>


        {/* Category */}
        <div>
          <Label htmlFor="categoryId" className="text-sm font-medium text-gray-700 flex items-center">
            <Package className="h-4 w-4 mr-2" />Category *
          </Label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />Price *
          </Label>
          <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00" required className="mt-1 focus:border-blue-500 focus:ring-blue-500 rounded-md" />
        </div>

        {/* SKU */}
        <div>
          <Label htmlFor="sku" className="text-sm font-medium text-gray-700 flex items-center">
            <Hash className="h-4 w-4 mr-2" />SKU
          </Label>
          <Input id="sku" name="sku" className="mt-1 focus:border-blue-500 focus:ring-blue-500 rounded-md" />
        </div>

        {/* Thumbnail Upload */}
        <div>
          <Label htmlFor="thumbnailUpload" className="text-sm font-medium text-gray-700 flex items-center">
            <ImageIcon className="h-4 w-4 mr-2" />Thumbnail
          </Label>
          <div className="flex gap-2 items-center mt-1">
            <input
              id="thumbnailUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const uploadedUrl = await handleImageUpload(file);
                  if (uploadedUrl) {
                    const urlField = document.getElementById("thumbnailUrl") as HTMLInputElement;
                    if (urlField) urlField.value = uploadedUrl;
                  }
                }
              }}
            />
            <Button type="button" variant="outline" onClick={() => document.getElementById("thumbnailUpload")?.click()}>
              Choose File
            </Button>
            <Input
              id="thumbnailUrl"
              name="thumbnailUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              className="flex-1 focus:border-blue-500 focus:ring-blue-500 rounded-md"
            />
          </div>
        </div>

        {/* Extra Images Upload */}
        <div>
          <Label htmlFor="imagesUpload" className="text-sm font-medium text-gray-700 flex items-center">
            <ImageIcon className="h-4 w-4 mr-2" />Additional Images
          </Label>
          <input
            id="imagesUpload"
            type="file"
            name="images"
            accept="image/*"
            multiple
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
            onChange={async (e) => {
              const files = e.target.files;
              if (!files || files.length === 0) return;

              try {
                const formData = new FormData();
                Array.from(files).forEach(file => formData.append("images", file));

                const res = await fetch(`${API_BASE_URL}/upload-multiple`, {
                  method: "POST",
                  body: formData,
                });
                const data = await res.json();

                if (res.ok && data.images) {
                  const form = (e.target as HTMLInputElement).closest("form") as HTMLFormElement;
                  if (!form) return;

                  let extraImagesField = form.querySelector<HTMLInputElement>("#extraImages");
                  if (!extraImagesField) {
                    extraImagesField = document.createElement("input");
                    extraImagesField.type = "hidden";
                    extraImagesField.id = "extraImages";
                    extraImagesField.name = "extraImages";
                    form.appendChild(extraImagesField);
                  }

                  extraImagesField.value = data.images.join(",");
                } else {
                  console.error("Additional images upload failed:", data);
                  alert("Upload failed, check console.");
                }
              } catch (err) {
                console.error("Additional images upload error:", err);
                alert("Upload failed, check console.");
              }
            }}
          />
        </div>

        {/* Stock */}
        <div>
          <Label htmlFor="stock" className="text-sm font-medium text-gray-700 flex items-center">
            <Package className="h-4 w-4 mr-2" />Stock Quantity *
          </Label>
          <Input id="stock" name="stock" type="number" min="0" required className="mt-1 focus:border-blue-500 focus:ring-blue-500 rounded-md" />
        </div>

        {/* Active Toggle */}
        <div className="flex items-center space-x-2">
          <Input id="isActive" name="isActive" type="checkbox" className="h-4 w-4" defaultChecked={true} />
          <Label htmlFor="isActive" className="text-sm font-medium text-gray-700 flex items-center">
            <ToggleLeft className="h-4 w-4 mr-2" />Active
          </Label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button type="submit" className="flex-1 py-2.5 rounded-lg text-lg font-semibold bg-green-600 hover:bg-green-700 transition-colors">
            Add Product
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 py-2.5 rounded-lg text-lg font-semibold border-gray-300 hover:bg-gray-100"
            onClick={() => setIsAddingProduct(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  </div>
)}

{/* --- Edit Product Modal --- */}
{isEditingProduct && currentProduct && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl mx-auto my-auto">
      <h3 className="text-2xl font-bold text-primary mb-6">Edit Product</h3>

      <form
        onSubmit={handleEditProduct}
        className="space-y-5"
        encType="multipart/form-data"
      >
        {/* Name */}
        <div>
          <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700 flex items-center">
            <Package className="h-4 w-4 mr-2" />Product Name *
          </Label>
          <Input
            id="edit-name"
            name="name"
            required
            defaultValue={currentProduct.name}
            className="mt-1 focus:border-blue-500 focus:ring-blue-500 rounded-md"
          />
        </div>

        {/* Description */}
       {/* Description */}
<div>
  <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center">
    <Info className="h-4 w-4 mr-2" />Description
  </Label>
  <Suspense fallback={<div>Loading editor...</div>}>
    <ReactQuill
      value={productDescription} // use useState for description
      onChange={setProductDescription} // update on change
      theme="snow"
      className="mt-1 bg-white"
    />
  </Suspense>
</div>


        {/* Category */}
        <div>
          <Label htmlFor="edit-categoryId" className="text-sm font-medium text-gray-700 flex items-center">
            <Package className="h-4 w-4 mr-2" />Category *
          </Label>
          <select
            id="edit-categoryId"
            name="categoryId"
            required
            defaultValue={currentProduct.category?.id || ''}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select category</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="edit-price" className="text-sm font-medium text-gray-700 flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />Price *
          </Label>
          <Input
            id="edit-price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={currentProduct.price}
            className="mt-1 focus:border-blue-500 focus:ring-blue-500 rounded-md"
          />
        </div>

        {/* SKU */}
        <div>
          <Label htmlFor="edit-sku" className="text-sm font-medium text-gray-700 flex items-center">
            <Hash className="h-4 w-4 mr-2" />SKU
          </Label>
          <Input
            id="edit-sku"
            name="sku"
            defaultValue={currentProduct.sku || ''}
            className="mt-1 focus:border-blue-500 focus:ring-blue-500 rounded-md"
          />
        </div>
{/* Thumbnail Upload */}
<div>
  <Label htmlFor="thumbnailUpload" className="text-sm font-medium text-gray-700 flex items-center">
    <ImageIcon className="h-4 w-4 mr-2" />Thumbnail
  </Label>
  <div className="flex gap-2 items-center mt-1">
    <input
      id="thumbnailUpload"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          const formData = new FormData();
          // MUST be "image", not "thumbnail"
          formData.append("image", file);

          const res = await fetch(`${API_BASE_URL}/upload`, {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (res.ok && data.imageUrl) {
            const urlField = document.getElementById("thumbnailUrl") as HTMLInputElement;
            if (urlField) urlField.value = data.imageUrl;
          } else {
            alert("Upload failed");
          }
        } catch (err) {
          console.error(err);
          alert("Upload failed");
        }
      }}
    />
    <Button
      type="button"
      variant="outline"
      onClick={() => document.getElementById("thumbnailUpload")?.click()}
    >
      Choose File
    </Button>
    <Input
      id="thumbnailUrl"
      name="thumbnailUrl"
      type="url"
      placeholder="https://example.com/image.jpg"
      className="flex-1 focus:border-blue-500 focus:ring-blue-500 rounded-md"
      defaultValue={currentProduct.thumbnailUrl || ""}
    />
  </div>
</div>

{/* Additional Images */}
<div>
  <Label htmlFor="edit-imagesUpload" className="text-sm font-medium text-gray-700 flex items-center">
    <ImageIcon className="h-4 w-4 mr-2" />Additional Images
  </Label>
  <input
    id="edit-imagesUpload"
    type="file"
    name="images"
    accept="image/*"
    multiple
    className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
    onChange={async (e) => {
      const files = e.target.files;
      if (!files?.length) return;
      try {
        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append("images", file));

        const res = await fetch(`${API_BASE_URL}/upload-multiple`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.images) {
          const extraImagesField = document.getElementById("extraImages") as HTMLInputElement;
          if (extraImagesField) extraImagesField.value = data.images.join(",");
        } else {
          alert("Upload failed");
        }
      } catch (err) {
        console.error(err);
        alert("Upload failed");
      }
    }}
  />
  <input
    type="hidden"
    id="extraImages"
    name="extraImages"
    defaultValue={currentProduct.images?.map((img) => img.imageUrl).join(",") || ""}
  />
</div>


        {/* Stock */}
        <div>
          <Label htmlFor="edit-stock" className="text-sm font-medium text-gray-700 flex items-center">
            <Package className="h-4 w-4 mr-2" />Stock Quantity *
          </Label>
          <Input
            id="edit-stock"
            name="stock"
            type="number"
            min="0"
            required
            defaultValue={currentProduct.stock}
            className="mt-1 focus:border-blue-500 focus:ring-blue-500 rounded-md"
          />
        </div>

        {/* Active toggle */}
        <div className="flex items-center space-x-2">
          <Input id="edit-isActive" name="isActive" type="checkbox" className="h-4 w-4" defaultChecked={currentProduct.isActive}/>
          <Label htmlFor="edit-isActive" className="text-sm font-medium text-gray-700 flex items-center">
            <ToggleLeft className="h-4 w-4 mr-2" />Active
          </Label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button type="submit" className="flex-1 py-2.5 rounded-lg text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors">Save Changes</Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 py-2.5 rounded-lg text-lg font-semibold border-gray-300 hover:bg-gray-100"
            onClick={() => { setIsEditingProduct(false); setCurrentProduct(null); }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Add Category Modal */}
      {isAddingCategory && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl mx-auto my-auto">
            <h3 className="text-2xl font-bold text-primary mb-6">Add New Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-5">
              <div>
                <Label htmlFor="category-name" className="text-sm font-medium text-gray-700">Category Name *</Label>
                <Input id="category-name" name="name" required className="mt-1 rounded-md" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" className="flex-1 py-2.5 rounded-lg text-lg font-semibold bg-green-600 hover:bg-green-700 transition-colors">
                  Add Category
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 py-2.5 rounded-lg text-lg font-semibold border-gray-300 hover:bg-gray-100"
                  onClick={() => setIsAddingCategory(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

       {/* Edit Category Modal (Existing) */}
      {isEditingCategory && currentCategory && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl font-bold text-primary mb-6">Edit Category</h3>
            <form onSubmit={handleEditCategory} className="space-y-5">
              <div>
                <Label htmlFor="edit-category-name" className="text-sm font-medium text-gray-700">Category Name *</Label>
                <Input id="edit-category-name" name="name" required defaultValue={currentCategory.name} className="mt-1 rounded-md" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" className="flex-1 py-2.5 rounded-lg text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 py-2.5 rounded-lg text-lg font-semibold border-gray-300 hover:bg-gray-100"
                  onClick={() => { setIsEditingCategory(false); setCurrentCategory(null); }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal (Existing) */}
      {isAddingProject && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl font-bold text-primary mb-6">Add New Portfolio Project</h3>
            <form onSubmit={handleAddProject} className="space-y-5">
              <div>
                <Label htmlFor="project-title" className="text-sm font-medium text-gray-700 flex items-center"><Briefcase className="h-4 w-4 mr-2" />Project Title *</Label>
                <Input id="project-title" name="title" required className="mt-1 rounded-md" />
              </div>
              <div>
                <Label htmlFor="project-description" className="text-sm font-medium text-gray-700 flex items-center"><Feather className="h-4 w-4 mr-2" />Description *</Label>
                <Textarea id="project-description" name="description" required className="mt-1 rounded-md" />
              </div>
              <div>
                <Label htmlFor="project-category" className="text-sm font-medium text-gray-700 flex items-center"><Tag className="h-4 w-4 mr-2" />Category (e.g., Solar, Electrical) *</Label>
                <Input id="project-category" name="category" required className="mt-1 rounded-md" />
              </div>
              <div>
                <Label htmlFor="project-type" className="text-sm font-medium text-gray-700 flex items-center"><Type className="h-4 w-4 mr-2" />Project Type *</Label>
                <select
                  id="project-type"
                  name="typeId" // Send type ID to backend
                  required
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a Project Type</option>
                  {projectTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="project-location" className="text-sm font-medium text-gray-700 flex items-center"><MapPin className="h-4 w-4 mr-2" />Location *</Label>
                <Input id="project-location" name="location" required className="mt-1 rounded-md" />
              </div>
              <div>
                <Label htmlFor="project-year" className="text-sm font-medium text-gray-700 flex items-center"><Calendar className="h-4 w-4 mr-2" />Year *</Label>
                <Input id="project-year" name="year" type="number" required max={new Date().getFullYear()} className="mt-1 rounded-md" />
              </div>
              <div>
                <Label htmlFor="project-services" className="text-sm font-medium text-gray-700 flex items-center"><List className="h-4 w-4 mr-2" />Services (comma-separated, e.g., Wiring, Panel Installation) *</Label>
                <Input id="project-services" name="services" required className="mt-1 rounded-md" placeholder="e.g., Electrical Wiring, Solar Installation" />
              </div>
             {/* Project Image Upload (File + URL) */}
<div>
  <Label htmlFor="project-imageUpload" className="text-sm font-medium text-gray-700 flex items-center">
  <Link2 className="h-4 w-4 mr-2" />Project Image *
</Label>
<div className="flex gap-2 items-center mt-1">
  {/* Hidden File Input */}
  <input
    id="project-imageUpload"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          // Use reusable upload function
          const uploadedUrl = await handleImageUpload(file);
          if (uploadedUrl) {
            // Set uploaded URL in input field
            const urlField = document.getElementById("project-imageUrl") as HTMLInputElement;
            if (urlField) urlField.value = uploadedUrl; // Already full URL
          }
        } catch (err) {
          console.error("Upload error:", err);
          alert("Upload failed, check console.");
        }
      }
    }}
  />
    {/* Choose File Button */}
    <Button
      type="button"
      variant="outline"
      onClick={() => document.getElementById("project-imageUpload")?.click()}
    >
      Choose File
    </Button>

    {/* Manual URL Entry */}
    <Input
      id="project-imageUrl"
      name="imageUrl"
      type="url"
      required
      placeholder="https://example.com/project-image.jpg"
      className="flex-1 focus:border-blue-500 focus:ring-blue-500 rounded-md"
    />
  </div>
</div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" className="flex-1 py-2.5 rounded-lg text-lg font-semibold bg-green-600 hover:bg-green-700 transition-colors">
                  Add Project
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 py-2.5 rounded-lg text-lg font-semibold border-gray-300 hover:bg-gray-100"
                  onClick={() => setIsAddingProject(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal (Existing) */}
{isEditingProject && currentProject && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
      <h3 className="text-2xl font-bold text-primary mb-6">Edit Portfolio Project</h3>
      <form onSubmit={handleEditProject} className="space-y-5">
        <div>
          <Label htmlFor="edit-project-title" className="text-sm font-medium text-gray-700 flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />Project Title *
          </Label>
          <Input id="edit-project-title" name="title" required defaultValue={currentProject.title} className="mt-1 rounded-md" />
        </div>

        <div>
          <Label htmlFor="edit-project-description" className="text-sm font-medium text-gray-700 flex items-center">
            <Feather className="h-4 w-4 mr-2" />Description *
          </Label>
          <Textarea id="edit-project-description" name="description" required defaultValue={currentProject.description} className="mt-1 rounded-md" />
        </div>

        <div>
          <Label htmlFor="edit-project-category" className="text-sm font-medium text-gray-700 flex items-center">
            <Tag className="h-4 w-4 mr-2" />Category (e.g., Solar, Electrical) *
          </Label>
          <Input id="edit-project-category" name="category" required defaultValue={currentProject.category} className="mt-1 rounded-md" />
        </div>

        <div>
          <Label htmlFor="edit-project-type" className="text-sm font-medium text-gray-700 flex items-center">
            <Type className="h-4 w-4 mr-2" />Project Type *
          </Label>
          <select
            id="edit-project-type"
            name="typeId"
            required
            defaultValue={projectTypes.find(t => t.slug === currentProject.type)?.id || ''}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select a Project Type</option>
            {projectTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="edit-project-location" className="text-sm font-medium text-gray-700 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />Location *
          </Label>
          <Input id="edit-project-location" name="location" required defaultValue={currentProject.location} className="mt-1 rounded-md" />
        </div>

        <div>
          <Label htmlFor="edit-project-year" className="text-sm font-medium text-gray-700 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />Year *
          </Label>
          <Input id="edit-project-year" name="year" type="number" required defaultValue={currentProject.year} max={new Date().getFullYear()} className="mt-1 rounded-md" />
        </div>

        <div>
          <Label htmlFor="edit-project-services" className="text-sm font-medium text-gray-700 flex items-center">
            <List className="h-4 w-4 mr-2" />Services (comma-separated) *
          </Label>
          <Input id="edit-project-services" name="services" required defaultValue={currentProject.services.join(', ')} className="mt-1 rounded-md" />
        </div>

        {/* Project Image Upload (File + URL) */}
       {/* Project Image Upload (File + URL) */}
<div>
  <Label htmlFor="project-imageUpload" className="text-sm font-medium text-gray-700 flex items-center">
    <Link2 className="h-4 w-4 mr-2" />Project Image *
  </Label>
  <div className="flex gap-2 items-center mt-1">
    {/* Hidden File Input */}
    <input
      id="project-imageUpload"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
          const formData = new FormData();
          formData.append("image", file); // must match backend single upload

          // ✅ Fixed: no double /api
          const res = await fetch(`${API_BASE_URL}/upload`, {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (res.ok && data.imageUrl) {
            const urlField = document.getElementById("project-imageUrl") as HTMLInputElement;
            if (urlField) urlField.value = data.imageUrl;
          } else {
            console.error("Project image upload failed:", data);
            alert("Upload failed, check console.");
          }
        } catch (err) {
          console.error("Project image upload error:", err);
          alert("Upload failed, check console.");
        }
      }}
    />

    {/* Choose File Button */}
    <Button
      type="button"
      variant="outline"
      onClick={() => document.getElementById("project-imageUpload")?.click()}
    >
      Choose File
    </Button>

    {/* Manual URL Entry */}
    <Input
      id="project-imageUrl"
      name="imageUrl"
      type="url"
      required
      placeholder="https://example.com/project-image.jpg"
      className="flex-1 focus:border-blue-500 focus:ring-blue-500 rounded-md"
    />
  </div>
</div>


        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 py-2.5 rounded-lg text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 py-2.5 rounded-lg text-lg font-semibold border-gray-300 hover:bg-gray-100"
            onClick={() => {
              setIsEditingProject(false);
              setCurrentProject(null);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Add Project Type Modal (NEW) */}
      {isAddingProjectType && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-primary mb-6">Add New Project Type</h3>
            <form onSubmit={handleAddProjectType} className="space-y-5">
              <div>
                <Label htmlFor="project-type-name" className="text-sm font-medium text-gray-700 flex items-center"><Type className="h-4 w-4 mr-2" />Type Name *</Label>
                <Input id="project-type-name" name="name" required className="mt-1 rounded-md" />
              </div>
              <div>
                <Label htmlFor="project-type-icon" className="text-sm font-medium text-gray-700 flex items-center"><ImageIcon className="h-4 w-4 mr-2" />Icon Name (from Lucide)</Label>
                <Input id="project-type-icon" name="icon" className="mt-1 rounded-md" placeholder="e.g., Home, Building, Factory" />
                <p className="text-xs text-muted-foreground mt-1">
                  Refer to <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lucide Icons</a> for names.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 py-2.5 rounded-lg text-lg font-semibold bg-green-600 hover:bg-green-700 transition-colors">
                  Add Type
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 py-2.5 rounded-lg text-lg font-semibold border-gray-300 hover:bg-gray-100"
                  onClick={() => setIsAddingProjectType(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Type Modal (NEW) */}
      {isEditingProjectType && currentProjectType && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-primary mb-6">Edit Project Type</h3>
            <form onSubmit={handleEditProjectType} className="space-y-5">
              <div>
                <Label htmlFor="edit-project-type-name" className="text-sm font-medium text-gray-700 flex items-center"><Type className="h-4 w-4 mr-2" />Type Name *</Label>
                <Input id="edit-project-type-name" name="name" required defaultValue={currentProjectType.name} className="mt-1 rounded-md" />
              </div>
              <div>
                <Label htmlFor="edit-project-type-icon" className="text-sm font-medium text-gray-700 flex items-center"><ImageIcon className="h-4 w-4 mr-2" />Icon Name (from Lucide)</Label>
                <Input id="edit-project-type-icon" name="icon" defaultValue={currentProjectType.icon} className="mt-1 rounded-md" placeholder="e.g., Home, Building, Factory" />
                <p className="text-xs text-muted-foreground mt-1">
                  Refer to <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lucide Icons</a> for names.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 py-2.5 rounded-lg text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 py-2.5 rounded-lg text-lg font-semibold border-gray-300 hover:bg-gray-100"
                  onClick={() => { setIsEditingProjectType(false); setCurrentProjectType(null); }}
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