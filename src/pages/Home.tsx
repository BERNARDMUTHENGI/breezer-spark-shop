import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, 
  Shield, 
  Award, 
  Phone, 
  ArrowRight,
  Wrench,
  Sun,
  Camera,
  Cpu
} from "lucide-react";

const Home = () => {
  const services = [
    {
      icon: Zap,
      title: "Electrical Contracting",
      description: "Professional electrical installations for residential and commercial projects"
    },
    {
      icon: Cpu,
      title: "Generator Installation",
      description: "Reliable backup power solutions with professional installation and maintenance"
    },
    {
      icon: Sun,
      title: "Solar Solutions", 
      description: "Sustainable energy systems designed for your specific needs"
    },
    {
      icon: Camera,
      title: "CCTV & Security",
      description: "Advanced security systems to protect your property and assets"
    }
  ];

  const features = [
    {
      icon: Award,
      title: "EPRA & NCA Certified",
      description: "Fully licensed and certified electrical contractors"
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Committed to delivering reliable, high-quality electrical solutions"
    },
    {
      icon: Wrench,
      title: "Professional Service",
      description: "Expert technicians with years of industry experience"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Professional Electrical
              <span className="block text-secondary">Solutions & Automation</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
              EPRA & NCA Class One certified electrical contractors providing quality, 
              reliable solutions for residential and commercial projects across Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-hero">
                <Link to="/contact">Get Free Quote</Link>
              </Button>
              <Button variant="outline" className="btn-primary-outline" asChild>
                <Link to="/shop">Shop Products</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-2 text-primary-foreground/80">
              <Phone className="h-4 w-4" />
              <span>Call us: +254 721 597 396</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Our Expert Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive electrical solutions backed by certifications and years of experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="card-service">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <service.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" className="btn-primary-outline">
              <Link to="/about">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Why Choose Breezer Electric?
            </h2>
            <p className="text-xl text-muted-foreground">
              Quality, Value, and Reliability in every project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="bg-secondary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  <feature.icon className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-semibold text-primary">{feature.title}</h3>
                <p className="text-muted-foreground text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Ready to Start Your Electrical Project?
          </h2>
          <p className="text-xl text-primary-foreground/90">
            Get in touch with our certified electrical contractors for a free consultation and quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-hero">
              <Link to="/contact">Request Quote</Link>
            </Button>
            <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/portfolio">View Our Work</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;