// BlogPost.jsx
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://breezer-electronics-3.onrender.com/api/blog/posts/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Blog post not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different API response formats
        if (data.post) {
          setPost(data.post);
        } else if (data) {
          // If the response is the post object itself
          setPost(data);
        } else {
          throw new Error('Invalid post data format');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load blog post.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <p className="text-muted-foreground mb-6">{error || "The requested blog post could not be found."}</p>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button asChild variant="secondary" className="mb-6">
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author || "Unknown Author"}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(post.published_at || post.date || post.createdAt).toLocaleDateString()}</span>
            </div>
            {post.read_time || post.readTime ? (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.read_time || post.readTime}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.image_url || post.image ? (
            <img 
              src={post.image_url || post.image} 
              alt={post.title} 
              className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
            />
          ) : null}
          
          <div className="prose prose-lg max-w-none">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : post.excerpt ? (
              <div>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <p>Full content coming soon...</p>
              </div>
            ) : (
              <p>No content available for this post.</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Electrical Services?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Contact us for professional electrical solutions tailored to your needs.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Get a Free Quote</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;