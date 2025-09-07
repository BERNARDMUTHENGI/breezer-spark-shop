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
import { FaWhatsapp, FaTiktok } from "react-icons/fa"; // Import WhatsApp and TikTok icons

const Home = () => {
  const services = [
    {
      // Using direct image path for Electrical Contracting
      icon: "/contracting.jpg", 
      title: "Electrical Contracting",
      description: "Professional electrical installations for residential and commercial projects"
    },
    {
      // Using direct image path for Generator Installation
      icon: "/generator.jpg", 
      title: "Generator Installation",
      description: "Reliable backup power solutions with professional installation and maintenance"
    },
    {
      // Using direct image path for Solar Solutions
      icon: "/solar.jpg", 
      title: "Solar Solutions", 
      description: "Sustainable energy systems designed for your specific needs"
    },
    {
      // Using direct image path for CCTV & Security
      icon: "/cctv.jpg",
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

  const phoneNumber = "254798836266"; // Your phone number for WhatsApp link
  const tiktokUsername = "breezer_electric"; // Replace with your actual TikTok username

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="text-primary-foreground py-20 bg-cover bg-center" 
        style={{ backgroundImage: `url('/breezerbg.png')` }} // Set background image
      >
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
                <Link to="/contact">Fundi mtaani</Link>
              </Button>
              <Button variant="outline" className="btn-primary-outline" asChild>
                <Link to="/shop">Shop Products</Link>
              </Button>
            </div>
            {/* Phone number and new social icons */}
            <div className="flex flex-col items-center justify-center space-y-2 text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Call us: 0798836266</span>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <a
                  href={`https://wa.me/${phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full text-green-500 hover:text-green-600 transition-colors shadow-md" // Added white circular background
                  aria-label="Chat on WhatsApp"
                >
                  <FaWhatsapp className="h-8 w-8" />
                </a>
                <a
                  href={`https://www.tiktok.com/@${tiktokUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full text-black hover:text-gray-800 transition-colors shadow-md" // Added white circular background
                  aria-label="Visit TikTok page"
                >
                  <FaTiktok className="h-8 w-8" />
                </a>
              </div>
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
              <Card key={index} className="card-service overflow-hidden"> {/* Added overflow-hidden to card */}
                {/* Image as background for the top part of the card with rounded top corners */}
                <div 
                  className="w-full h-32 bg-cover bg-center rounded-t-xl" // Added rounded-t-xl
                  style={{ backgroundImage: `url(${service.icon})` }}
                  aria-label={service.title} // Accessibility for image
                ></div>
                <CardContent className="p-6 text-center space-y-4">
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
      <section className="py-20 bg-gray-700 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Ready to Start Your Electrical Project?
          </h2>
          <p className="text-xl text-primary-foreground/90">
            Get in touch with our certified electrical contractors for a free consultation and quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-hero">
              <Link to="/contact">Fundi Mtaani</Link>
            </Button>
            <Button variant="outline" className="btn-primary-outline "asChild >
              <Link to="/portfolio">View Our Work</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
