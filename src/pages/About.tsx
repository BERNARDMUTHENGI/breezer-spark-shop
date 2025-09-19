import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Award, 
  Shield, 
  Target, 
  Eye,
  Zap,
  Cpu,
  Sun,
  Camera,
  Wrench,
  Search,
  ArrowRight
} from "lucide-react";

const About = () => {
  const services = [
    {
      // Updated to image path for Electrical Contracting
      icon: "/contracting.jpg",
      title: "Electrical Contracting",
      description: "Breezer Electric Kenya provides professional electrical contracting services with full EPRA certification. Our electric contractors handle complex installations, maintenance, and automation integration across Kenya's residential, commercial, and industrial sectors.",
      features: ["Complete electric system design and installation", "Electric panel upgrades and automation integration", "Wiring and rewiring for homes and businesses across Kenya", "Electric safety inspections and compliance certificationg"]
    },
    {
      // Updated to image path for Generator Installation & Maintenance
      icon: "/generator.jpg",
      title: "Generator Installation & Automation",
      description: "Reliable backup power solutions with intelligent automation controls by Breezer Electric Kenya. Our generator installations include smart automation systems that ensure seamless power transitions and optimal performance across Kenya's varied electric grid conditions.",
      features: ["Generator sizing and selection for Kenya applications", "Maintenance programs for optimal generator performance", "Professional installation with automation integration", "Smart transfer switches and electric monitoring systems"]
    },
    {
      // Updated to image path for Electrical Design
      icon: "/design.jpg", // New image path
      title: "Electrical Design Services",
      description: "Breezer Electric Kenya delivers professional electrical design services tailored to optimize power distribution and enhance system efficiency across Kenya. Our expert team specializes in creating innovative electrical and automation solutions for residential, commercial, and industrial projects.",
      features: ["System design", "Load calculations", "Circuit planning", "Technical drawings"]
    },
    {
      // Updated to image path for CCTV & Security Systems
      icon: "/cctv.jpg",
      title: "CCTV & Security Automation Systems",
      description: "Advanced security systems integrated with smart electric controls by Breezer Electric Kenya. Our CCTV installations include automation features that enhance security while optimizing electric consumption across Kenya properties",
      features: ["CCTV installation", "Access control", "Alarm systems", "Remote monitoring"]
    },
    {
      // Updated to image path for Solar Energy Solutions
      icon: "/solar.jpg",
      title: "Solar Electric & Automation Systems",
      description: "Sustainable energy solutions with advanced automation management by Breezer Electric Kenya. Our solar electric systems integrate seamlessly with home and business automation for maximum efficiency and convenience throughout Kenya.",
      features: ["Solar system design and electric integration", "Grid-tie systems with smart electric monitoring", "Battery storage with intelligent automation controls", "Energy audits"]
    },
    {
      // Updated to image path for Electrical Inspection & Repairs
      icon: "/repair.jpg", // New image path
      title: "Electrical Inspection & Repairs",
      description: "Breezer Electric Kenya provides top-tier electrical inspection and repair services across Kenya, ensuring safety and compliance with the latest standards. Our skilled technicians conduct thorough electrical inspections and handle complex repairs, integrating automation solutions to enhance system reliability.",
      features: ["Safety inspections", "Fault finding", "Emergency repairs", "Compliance testing"]
    }
  ];

  const values = [
    {
      icon: Award,
      title: "Quality",
      description: "We deliver exceptional electrical solutions using the highest quality materials and industry best practices."
    },
    {
      icon: Target,
      title: "Value",
      description: "Cost-effective solutions that provide long-term value and reliability for our clients."
    },
    {
      icon: Shield,
      title: "Reliable",
      description: "Dependable service you can trust, backed by our certifications and proven track record."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="text-primary-foreground py-16 bg-cover bg-center" // Added bg-cover bg-center for image styling
        style={{ backgroundImage: `url('/aboutb.png')` }} // Replaced gradient with image
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About Breezer Electric</h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Your trusted partner for professional electrical contracting, automation, and energy solutions
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-primary">About us</h2>
              <p className="text-lg text-muted-foreground">
               Breezer Electric is Kenya's leading electrical contractor specializing in professional electrical 
               installations, automation systems, and sustainable energy solutions. With years of industry experience 
               and proper EPRA & NCA certifications, we have established ourselves as the go-to electrical service
                provider for quality, reliability, and professional excellenceBreezer Electric is Kenya's leading 
                electrical contractor specializing in professional electrical installations, automation systems, and 
                sustainable energy solutions. With years of industry experience and proper EPRA & NCA certifications,
                 we have established ourselves as the go-to electrical service provider for quality, reliability, and professional excellence.
              </p>
              <p className="text-lg text-muted-foreground">
                Our team of certified professionals is committed to delivering quality, value, and 
                reliable electrical services that meet the highest industry standards.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  <Award className="w-4 h-4 mr-1" />
                  EPRA Certified
                </Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  <Shield className="w-4 h-4 mr-1" />
                  NCA Class One
                </Badge>
              </div>
            </div>
            <div className="bg-muted/50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-primary mb-6">Our Mission</h3>
              <p className="text-lg text-muted-foreground mb-6">
                
              To provide safe, reliable, and professional electrical solutions that meet the highest standards of quality and safety. We are committed to helping Kenya transition to sustainable energy while maintaining the highest levels of electrical safety and compliance. <br />
              </p><h3 className="text-2xl font-semibold text-primary mb-6">Our Vision</h3>
              <p className="text-lg text-muted-foreground">
                To be the leading provider of affordable and quality electrical services in Kenya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">At Breezer Electric, we understand Kenya's unique electric infrastructure needs and automation opportunities. Our commitment extends beyond installation to building long-term relationships with our Kenyan clients.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="card-professional text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-primary">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Professional Services</h2>
            <p className="text-xl text-muted-foreground">
              Breezer Electric Kenya provides comprehensive electrical contracting and automation services for residential, commercial, and industrial clients throughout Kenya. Our EPRA certified electric contractors combine traditional electrical expertise with cutting-edge automation technology to deliver solutions that enhance safety, efficiency, and convenience. From Nairobi to Mombasa, Kisumu to Nakuru, Breezer Electric serves all major Kenya cities with professional electric installations, smart automation systems, and reliable maintenance services.  </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="card-service h-full overflow-hidden">
                {/* Image as background for the top part of the card with rounded top corners */}
                <div 
                  className="w-full h-32 bg-cover bg-center rounded-t-xl" 
                  style={{ backgroundImage: `url(${service.icon})` }}
                  aria-label={service.title} // Accessibility for image
                ></div>
                <CardContent className="p-6 space-y-4">
                  <CardTitle className="text-xl text-primary">{service.title}</CardTitle>
                  <p className="text-muted-foreground">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Work With Us?</h2>
          <p className="text-xl text-primary-foreground/90">
            Contact our certified electrical professionals for your next project
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-hero">
              <Link to="/contact">Contact Fundi Mtaani</Link>
            </Button>
            <Button variant="outline" className="btn-primary-outline" asChild>
              <Link to="/portfolio">
                View Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
