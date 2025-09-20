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
import { FaWhatsapp, FaTiktok } from "react-icons/fa";

const Home = () => {
  const services = [
    {
      icon: "/contracting.jpg", 
      title: "Electrical Contracting",
      description: "Professional electric installations for homes and businesses across Kenya. Breezer Electric's certified electricians ensure safety, compliance, and seamless automation integration."
    },
    {
      icon: "/generator.jpg", 
      title: "Generator Installation",
      description: " Reliable backup power solutions with professional installation throughout Kenya. Our electric contractors integrate generators with smart automation systems for optimal performance."
    },
    {
      icon: "/solar.jpg", 
      title: "Solar Solutions", 
      description: "Sustainable electric power with advanced automation controls. Breezer Electric Kenya designs solar systems that integrate perfectly with home and business automation."
    },
    {
      icon: "/cctv.jpg",
      title: "CCTV & Security",
      description: "Advanced security automation systems to protect your Kenya property. Smart CCTV integration with electric systems for comprehensive protection."
    }
  ];

  const features = [
    {
      icon: Award,
      title: "EPRA & NCA Certified",
      description: "Breezer Electric Kenya holds official government certifications, ensuring all electric and automation work meets Kenya's highest safety standards."
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "High-grade materials and industry best practices for reliable, long-lasting electric and automation installations across Kenya."
    },
    {
      icon: Wrench,
      title: "Expert Technicians",
      description: "Years of experience in electric work, automation systems, and smart home technologies throughout Kenya's residential and commercial sectors."
    }
  ];

  const phoneNumber = "254798836266";
  const tiktokUsername = "breezer_electric";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="text-primary-foreground py-20 bg-cover bg-center" 
        style={{ backgroundImage: `url('/breezerbg.png')` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
             Professional Electrical  Automation Experts in Kenya
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-hero">
                <Link to="/contact">Fundi mtaani</Link>
              </Button>
              <Button variant="outline" className="btn-primary-outline" asChild>
                <Link to="/shop">Shop Products</Link>
              </Button>
            </div>
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
                  className="bg-white p-2 rounded-full text-green-500 hover:text-green-600 transition-colors shadow-md"
                  aria-label="Chat on WhatsApp"
                >
                  <FaWhatsapp className="h-8 w-8" />
                </a>
                <a
                  href={`https://www.tiktok.com/@${tiktokUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full text-black hover:text-gray-800 transition-colors shadow-md"
                  aria-label="Visit TikTok page"
                >
                  <FaTiktok className="h-8 w-8" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Original Design */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Our Expert Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Breezer Electric Kenya offers comprehensive electrical and automations solutions backed by certifications and years of experience across Kenya. Our expert services cover a wide range of electrical and automation needs, ensuring top-notch quality and reliability.
            </p>
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

      {/* Enhanced Electrical Contracting Section - Wider Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-hidden h-full">
              <div 
                className="w-full h-48 bg-cover bg-center"
                style={{ backgroundImage: `url('/contracting.jpg')` }}
                aria-label="Electrical Contracting"
              ></div>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-primary mb-6">Electrical $ Automation Contractors Kenya - EPRA Certified Electricians</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Looking for reliable electrical and automations contractors in Kenya? Breezer Electric's EPRA certified electricians provide professional electrical automations, installation, maintenance, and repair services across Nairobi, Mombasa, Kisumu, and all major Kenyan cities. Our licensed electrical contractors specialize in residential and commercial electrical work and automations with full compliance to Kenya's electrical safety standards.
                </p>
                
                <h3 className="text-2xl font-semibold text-primary mb-4">Our Electrical Contracting Services Include:</h3>
                <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
                  <li>Electrical installation $ automation for new homes and commercial buildings</li>
                  <li>Electrical panel upgrades and circuit breaker installation</li>
                  <li>House rewiring and electrical system modernization and automation</li>
                  <li>Emergency electrical repairs - 24/7 service available</li>
                  <li>Electrical safety automations and inspections and EPRA compliance certification</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden h-full">
              <div 
                className="w-full h-48 bg-cover bg-center"
                style={{ backgroundImage: `url('/generator.jpg')` }}
                aria-label="Generator Installation"
              ></div>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-primary mb-6">Generator Installation and automation Kenya - Backup Power Solutions</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Professional generator installation services across Kenya by certified electrical contractors. Breezer Electric installs residential and commercial generators with automatomation transfer switches, ensuring uninterrupted power supply during outages. Our generator installation services include sizing, installation, and maintenance programs.
                </p>
                
                <h3 className="text-2xl font-semibold text-primary mb-4">Our Generator Services Include:</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Residential generator installation and automations</li>
                  <li>Commercial generator solutions</li>
                  <li>Automatic transfer switch installation</li>
                  <li>Generator maintenance and servicing</li>
                  <li>Emergency generator repair services</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Solar & CCTV Sections - Wider Cards */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-hidden h-full">
              <div 
                className="w-full h-48 bg-cover bg-center"
                style={{ backgroundImage: `url('/solar.jpg')` }}
                aria-label="Solar Solutions"
              ></div>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-primary mb-6">Solar Installation Kenya - Renewable Energy Solutions</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Solar panel installation and solar power systems in Kenya. Our certified solar installers design and install grid-tie solar systems, off-grid solar solutions, and solar battery storage systems. Get free solar consultation and quote from Kenya's trusted solar installation company.
                </p>
                
                <h3 className="text-2xl font-semibold text-primary mb-4">Our Solar Services Include:</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Residential solar panel installation</li>
                  <li>Commercial solar power solutions</li>
                  <li>Solar water heating systems</li>
                  <li>Solar battery storage solutions</li>
                  <li>Solar system maintenance and repair</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden h-full">
              <div 
                className="w-full h-48 bg-cover bg-center"
                style={{ backgroundImage: `url('/cctv.jpg')` }}
                aria-label="CCTV & Security"
              ></div>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-primary mb-6">CCTV & Security Systems Kenya</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Advanced security automation systems to protect your Kenya property. Smart CCTV integration with electric systems for comprehensive protection. Our security experts design and install customized security solutions for homes and businesses across Kenya.
                </p>
                
                <h3 className="text-2xl font-semibold text-primary mb-4">Our Security Services Include:</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>CCTV system installation</li>
                  <li>Access control systems</li>
                  <li>Alarm system installation</li>
                  <li>Smart home security integration</li>
                  <li>Security system maintenance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Location-Specific Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">Electrical Services Across Kenya</h2>
          <p className="text-lg text-muted-foreground mb-6 text-center">
            Breezer Electric provides professional electrical services in major Kenyan cities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">Nairobi Region</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Electrical installations in Nairobi and surrounding areas</li>
                <li>Commercial electrical services in Westlands, Karen, and Upper Hill</li>
                <li>Residential electricians in estates across Nairobi</li>
                <li>Emergency electrical repairs throughout Nairobi County</li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">Coastal Region</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Mombasa electrical contractors for residential and commercial projects</li>
                <li>Electrical services in Malindi, Kilifi, and Diani</li>
                <li>Coastal property electrical installations and maintenance</li>
                <li>Generator and solar solutions for coastal properties</li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">Western Kenya</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Kisumu electrical installation and repair services</li>
                <li>Kakamega, Bungoma, and Busia electrical services</li>
                <li>Lake region electrical contractors</li>
                <li>Agricultural electrical installations in Western Kenya</li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">Rift Valley Region</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Nakuru electrical contractors and automation experts</li>
                <li>Eldoret, Naivasha, and Narok electrical services</li>
                <li>Agricultural and commercial electrical installations</li>
                <li>Solar power solutions for Rift Valley properties</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Frequently Asked Questions - Electrical Services Kenya</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">How much does electrical installation cost in Kenya?</h3>
              <p className="text-muted-foreground">
                Electrical installation costs in Kenya vary depending on project size and complexity. Contact our certified electricians for a free quote on your electrical project.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">Are Breezer Electric electricians licensed in Kenya?</h3>
              <p className="text-muted-foreground">
                Yes, all our electricians are EPRA certified and NCA licensed, ensuring compliance with Kenya's electrical safety standards.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">Do you provide emergency electrical services?</h3>
              <p className="text-muted-foreground">
                Yes, we offer 24/7 emergency electrical repair services across Kenya. Call 0798836266 for immediate assistance.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">What areas in Kenya do you serve?</h3>
              <p className="text-muted-foreground">
                We provide electrical services across Kenya, including Nairobi, Mombasa, Kisumu, Nakuru, and all major towns and regions.
              </p>
            </Card>
            <Button asChild variant="outline" className="btn-primary-outline">
              <Link to="/faq">
                View All FAQ <ArrowRight className="ml-2 h-4 w-4" />
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

      {/* Improved CTA Section */}
      <section className="py-20 bg-gray-700 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Need Professional Electrical Services in Kenya?
          </h2>
          <p className="text-xl text-primary-foreground/90">
            Get a free quote from Kenya's most trusted electrical contractors. EPRA certified, fully insured, and available 24/7 for emergency repairs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-hero bg-green-600 hover:bg-green-700">
              <a href="tel:0798836266">Call Now: 0798836266</a>
            </Button>
            <Button asChild className="btn-hero">
              <Link to="/contact">Electrical Automations Near You</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;