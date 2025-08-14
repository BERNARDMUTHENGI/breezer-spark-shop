import { useState } from "react";
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
  Award
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  type: "residential" | "commercial" | "industrial";
  location: string;
  year: string;
  description: string;
  services: string[];
  image: string;
}

const Portfolio = () => {
  const [selectedType, setSelectedType] = useState<string>("all");

  const projects: Project[] = [
    {
      id: 1,
      title: "Residential Villa Electrical Installation",
      category: "Complete Electrical System",
      type: "residential",
      location: "Karen, Nairobi",
      year: "2024",
      description: "Complete electrical installation for a 4-bedroom villa including smart home automation, backup generator system, and solar panel integration.",
      services: ["Electrical Wiring", "Generator Installation", "Solar Integration", "Smart Home"],
      image: "/api/placeholder/600/400"
    },
    {
      id: 2,
      title: "Office Complex CCTV & Access Control",
      category: "Security Systems",
      type: "commercial",
      location: "Westlands, Nairobi",
      year: "2024",
      description: "Comprehensive security system installation for 8-floor office complex with 64 IP cameras, access control, and alarm systems.",
      services: ["CCTV Installation", "Access Control", "Alarm Systems", "Network Infrastructure"],
      image: "/api/placeholder/600/400"
    },
    {
      id: 3,
      title: "Manufacturing Plant Power Distribution",
      category: "Industrial Electrical",
      type: "industrial",
      location: "Thika, Kiambu",
      year: "2023",
      description: "Industrial electrical installation for manufacturing facility including high-voltage distribution, machinery connections, and emergency backup systems.",
      services: ["Power Distribution", "Industrial Wiring", "Generator Systems", "Electrical Design"],
      image: "/api/placeholder/600/400"
    },
    {
      id: 4,
      title: "Shopping Mall Solar Installation",
      category: "Solar Energy System",
      type: "commercial",
      location: "Nakuru",
      year: "2024",
      description: "500kW rooftop solar installation for shopping mall with grid-tie system and battery backup for critical loads.",
      services: ["Solar Installation", "Grid-Tie System", "Battery Backup", "Energy Management"],
      image: "/api/placeholder/600/400"
    },
    {
      id: 5,
      title: "Apartment Block Electrical Upgrade",
      category: "Electrical Renovation",
      type: "residential",
      location: "Kileleshwa, Nairobi",
      year: "2023",
      description: "Complete electrical system upgrade for 24-unit apartment block including new distribution boards, rewiring, and safety systems.",
      services: ["Electrical Upgrade", "Safety Systems", "Distribution Boards", "Code Compliance"],
      image: "/api/placeholder/600/400"
    },
    {
      id: 6,
      title: "Hospital Emergency Power Systems",
      category: "Critical Power Systems",
      type: "commercial",
      location: "Mombasa",
      year: "2023",
      description: "Critical power systems installation for hospital including UPS systems, backup generators, and automatic transfer switches.",
      services: ["UPS Systems", "Generator Installation", "Transfer Switches", "Critical Power"],
      image: "/api/placeholder/600/400"
    }
  ];

  const projectTypes = [
    { id: "all", name: "All Projects", icon: Award },
    { id: "residential", name: "Residential", icon: Home },
    { id: "commercial", name: "Commercial", icon: Building },
    { id: "industrial", name: "Industrial", icon: Factory }
  ];

  const filteredProjects = selectedType === "all" 
    ? projects 
    : projects.filter(project => project.type === selectedType);

  const stats = [
    { number: "100+", label: "Projects Completed" },
    { number: "50+", label: "Happy Clients" },
    { number: "5+", label: "Years Experience" },
    { number: "24/7", label: "Support Available" }
  ];

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
            {projectTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                onClick={() => setSelectedType(type.id)}
                className="flex items-center space-x-2"
              >
                <type.icon className="h-4 w-4" />
                <span>{type.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="card-service overflow-hidden">
                <div className="aspect-video bg-muted/50 relative overflow-hidden">
                  {/* Placeholder for project image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <div className="text-center text-primary">
                      <Building className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Project Image</p>
                    </div>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-primary">
                    {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
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
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found for the selected category.</p>
            </div>
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
              <Link to="/contact">Get Your Quote</Link>
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