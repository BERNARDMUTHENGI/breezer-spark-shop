import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Search,
  Clock,
  MessageSquare
} from "lucide-react";
import { useState, useEffect } from "react";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState(null);

  // Fetch blog posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://breezer-electronics-3.onrender.com/api/blog/posts');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if the response contains posts array
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(data.posts.map(post => post.category))];
          setCategories(uniqueCategories);
        } else {
          throw new Error('Invalid data format from server');
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts. Please try again later.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search term and selected category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="text-primary-foreground py-20 bg-cover bg-center" 
        style={{ backgroundImage: `url('/contact.png')` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Breezer Electric
              <span className="block text-secondary">Blog & Insights</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
              Expert advice, industry trends, and electrical insights from certified professionals
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search and Filter */}
              <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search blog posts..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor="category" className="whitespace-nowrap">Filter by:</Label>
                  <select 
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-8">
                  <p>{error}</p>
                </div>
              )}

              {/* Blog Posts Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((item) => (
                    <Card key={item} className="overflow-hidden animate-pulse">
                      <div className="w-full h-48 bg-muted"></div>
                      <CardContent className="p-6 space-y-4">
                        <div className="h-6 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden card-service hover:shadow-lg transition-shadow">
                      <div 
  className="w-full h-48 bg-cover bg-center"
  style={{ backgroundImage: `url(${post.image_url || "/placeholder.png"})` }}
></div>

                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs">
                            {post.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-primary hover:text-secondary transition-colors">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="text-muted-foreground">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{new Date(post.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {posts.length === 0 ? 'No blog posts available' : 'No posts found'}
                  </h3>
                  <p className="text-muted-foreground">
                    {posts.length === 0 ? 'Check back later for new content' : 'Try adjusting your search or filter criteria'}
                  </p>
                </div>
              )}

              {/* Pagination (would be dynamic with real backend) */}
              {filteredPosts.length > 0 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    <Button variant="outline" disabled>Previous</Button>
                    <Button variant="outline" className="bg-secondary text-white">1</Button>
                    <Button variant="outline">2</Button>
                    <Button variant="outline">3</Button>
                    <Button variant="outline">Next</Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* About Card */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">About Our Blog</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Expert insights on electrical solutions, safety tips, industry trends, and innovative technologies from Breezer Electric's certified professionals.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/about">Learn More About Us</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Categories Card */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <button 
                        onClick={() => setSelectedCategory("all")}
                        className={`w-full text-left py-2 px-3 rounded-md transition-colors ${selectedCategory === "all" ? "bg-secondary/10 text-secondary" : "hover:bg-muted"}`}
                      >
                        All Topics
                      </button>
                    </li>
                    {categories.map((category, index) => (
                      <li key={index}>
                        <button 
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full text-left py-2 px-3 rounded-md transition-colors ${selectedCategory === category ? "bg-secondary/10 text-secondary" : "hover:bg-muted"}`}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Recent Posts Card */}
              {posts.length > 0 && (
                <Card className="card-professional">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">Recent Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {posts.slice(0, 3).map((post) => (
                        <li key={post.id} className="border-b border-muted pb-4 last:border-0 last:pb-0">
                          <Link 
                            to={`/blog/${post.id}`}
                            className="text-primary hover:text-secondary font-medium transition-colors"
                          >
                            {post.title}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(post.date).toLocaleDateString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Newsletter Signup */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Stay Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Subscribe to our newsletter for the latest electrical tips and industry insights.
                  </p>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="sr-only">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Your email address" 
                        required 
                      />
                    </div>
                    <Button type="submit" className="w-full">Subscribe</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-700 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Need Professional Electrical Services?
          </h2>
          <p className="text-xl text-primary-foreground/90">
            Our certified electricians are ready to help with your residential or commercial project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-hero">
              <Link to="/contact">Get a Free Quote</Link>
            </Button>
            <Button variant="outline" className="btn-primary-outline" asChild>
              <Link to="/services">View Our Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;