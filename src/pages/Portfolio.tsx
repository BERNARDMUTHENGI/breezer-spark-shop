import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Building, 
  Home, 
  Factory,
  ArrowRight,
  Calendar,
  MapPin,
  Award,
  Loader2
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  type: string;
  type_name: string;
  location: string;
  year: string;
  description: string;
  services: string[];
  image: string;
}

interface ProjectType {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

const Portfolio = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch project types
        const typesResponse = await fetch('https://breezer-electronics-3.onrender.com/api/portfolio/types');
        if (!typesResponse.ok) throw new Error('Failed to fetch project types');
        const typesData = await typesResponse.json();
        
        // Transform types to match frontend structure
        const transformedTypes = typesData.map((type: any) => ({
          id: type.slug,
          name: type.name,
          slug: type.slug,
          icon: type.icon
        }));
        
        setProjectTypes([
          { id: "all", name: "All Projects", slug: "all", icon: "Award" },
          ...transformedTypes.filter((type: any) => type.slug !== "all")
        ]);

        // Fetch projects
        const projectsResponse = await fetch(`https://breezer-electronics-3.onrender.com/api/portfolio/projects?type=${selectedType}`);
        if (!projectsResponse.ok) throw new Error('Failed to fetch projects');
        const projectsData = await projectsResponse.json();
        
        setProjects(projectsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load portfolio data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedType]);

  const filteredProjects = selectedType === "all" 
    ? projects 
    : projects.filter(project => project.type === selectedType);

  const stats = [
    { number: "100+", label: "Projects Completed" },
    { number: "50+", label: "Happy Clients" },
    { number: "5+", label: "Years Experience" },
    { number: "24/7", label: "Support Available" }
  ];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Home': return Home;
      case 'Building': return Building;
      case 'Factory': return Factory;
      case 'Award': return Award;
      default: return Building;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Project Portfolio</h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Showcasing our expertise in electrical contracting, automation, and energy solutions across Kenya
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {projectTypes.map((type) => {
              const IconComponent = getIconComponent(type.icon);
              return (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  onClick={() => setSelectedType(type.id)}
                  className="flex items-center space-x-2"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{type.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => {
                  const projectType = projectTypes.find(t => t.slug === project.type) || 
                    { name: project.type_name, icon: 'Building' };
                  const IconComponent = getIconComponent(projectType.icon);
                  
                  return (
                    <Card key={project.id} className="card-service overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-muted/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          {project.image ? (
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <IconComponent className="h-16 w-16 mx-auto mb-2 opacity-50" />
                              <p className="text-sm opacity-75">Project Image</p>
                            </>
                          )}
                        </div>
                        <Badge className="absolute top-4 left-4 bg-primary">
                          {projectType.name}
                        </Badge>
                      </div>
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-primary mb-2">{project.title}</h3>
                          <p className="text-secondary font-medium">{project.category}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{project.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{project.year}</span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm">{project.description}</p>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-primary">Services Provided:</h4>
                          <div className="flex flex-wrap gap-1">
                            {project.services.map((service, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {filteredProjects.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No projects found for the selected category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Start Your Project?</h2>
          <p className="text-xl text-primary-foreground/90">
            Join our growing list of satisfied clients. Let's discuss your electrical project requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-hero">
              <Link to="/contact">Hear From us</Link>
            </Button>
            <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/about">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;