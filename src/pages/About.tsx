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
  ArrowRight,
  CheckCircle,
  Users,
  MapPin,
  Clock
} from "lucide-react";

const About = () => {
  const services = [
    {
      icon: "/contracting.jpg",
      title: "Electrical Contracting Kenya",
      description: "EPRA-certified electrical contracting services across Kenya. Breezer Electric provides professional electrical installations, maintenance, and automation integration for residential, commercial, and industrial clients throughout Nairobi, Mombasa, Kisumu, and all major Kenyan regions.",
      features: ["Complete electrical system design and installation", "Electrical panel upgrades and automation integration", "Wiring and rewiring for homes and businesses", "Electrical safety inspections and EPRA compliance certification"]
    },
    {
      icon: "/generator.jpg",
      title: "Generator Installation Kenya",
      description: "Professional generator installation and maintenance services throughout Kenya. Our certified technicians provide reliable backup power solutions with smart automation integration for seamless power transitions during Kenya's frequent power outages.",
      features: ["Generator sizing and selection for Kenyan conditions", "Automatic transfer switch installation", "Preventive maintenance programs", "24/7 emergency generator repair services"]
    },
    {
      icon: "/design.jpg",
      title: "Electrical Design Services Kenya",
      description: "Professional electrical design services optimized for Kenya's unique power requirements. Our team creates efficient electrical systems that comply with EPRA regulations and maximize energy efficiency for residential and commercial properties.",
      features: ["Electrical system design and load calculations", "Energy efficiency optimization", "Technical drawings and documentation", "EPRA compliance planning"]
    },
    {
      icon: "/cctv.jpg",
      title: "CCTV & Security Systems Kenya",
      description: "Advanced security solutions with smart automation integration. Breezer Electric installs comprehensive CCTV and security systems tailored to Kenya's security needs, with remote monitoring capabilities and seamless electrical integration.",
      features: ["HD CCTV camera installation", "Access control systems", "Intrusion alarm systems", "Remote monitoring solutions"]
    },
    {
      icon: "/solar.jpg",
      title: "Solar Energy Solutions Kenya",
      description: "Sustainable solar power systems designed for Kenya's climate. Our solar solutions include professional installation, battery storage options, and integration with existing electrical systems to reduce energy costs and provide reliable power.",
      features: ["Solar panel installation and maintenance", "Grid-tie and off-grid systems", "Solar water heating solutions", "Energy monitoring and optimization"]
    },
    {
      icon: "/repair.jpg",
      title: "Electrical Repair Services Kenya",
      description: "24/7 electrical repair and maintenance services across Kenya. Our emergency electricians quickly respond to electrical faults, power outages, and safety concerns with professional solutions that restore power safely and efficiently.",
      features: ["Emergency electrical repairs", "Fault finding and diagnostics", "Preventive maintenance programs", "Electrical safety audits"]
    }
  ];

  const values = [
    {
      icon: Award,
      title: "Quality Craftsmanship",
      description: "We deliver exceptional electrical solutions using premium materials and industry best practices, ensuring long-lasting performance and client satisfaction."
    },
    {
      icon: Target,
      title: "Value Engineering",
      description: "Cost-effective solutions that provide optimal performance and long-term value, reducing operating costs while maintaining highest quality standards."
    },
    {
      icon: Shield,
      title: "Reliable Service",
      description: "Dependable electrical services backed by certifications, warranties, and a proven track record of successful projects throughout Kenya."
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "We prioritize client needs with personalized solutions, clear communication, and ongoing support throughout every project phase."
    }
  ];

  const stats = [
    { value: "500+", label: "Projects Completed" },
    { value: "10+", label: "Years Experience" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "24/7", label: "Emergency Support" }
  ];

  const coverageAreas = [
    "Nairobi and Surrounding Areas",
    "Mombasa and Coastal Region",
    "Kisumu and Western Kenya",
    "Nakuru and Rift Valley",
    "Central Kenya Regions",
    "Major Urban Centers Nationwide"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="text-primary-foreground py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/aboutb.png')` }}
      >
        <div className="absolute inset-0 bg-primary/80"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Breezer Electric Kenya</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-4xl mx-auto mb-8">
            Kenya's Premier Electrical Contracting & Automation Solutions Provider
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 backdrop-blur-sm">
              <Award className="w-5 h-5 mr-2" />
              EPRA Certified Electricians
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 backdrop-blur-sm">
              <Shield className="w-5 h-5 mr-2" />
              NCA Licensed Contractors
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 backdrop-blur-sm">
              <Zap className="w-5 h-5 mr-2" />
              Serving All Kenya
            </Badge>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-4 bg-primary/10 text-primary">Who We Are</Badge>
                <h2 className="text-4xl font-bold text-primary mb-6">Kenya's Trusted Electrical Experts</h2>
              </div>
              <p className="text-lg text-muted-foreground">
                Breezer Electric is Kenya's leading electrical contractor specializing in professional electrical 
                installations, automation systems, and sustainable energy solutions. With over a decade of industry experience 
                and full EPRA & NCA certifications, we have established ourselves as the preferred electrical service
                provider for quality, reliability, and professional excellence throughout Kenya.
              </p>
              <p className="text-lg text-muted-foreground">
                Our team of certified electricians and engineers is committed to delivering innovative electrical 
                solutions that meet international standards while addressing Kenya's unique power challenges. From 
                residential wiring to industrial automation, we combine technical expertise with local knowledge to 
                provide services you can trust.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-muted-foreground">EPRA Licensed</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-muted-foreground">NCA Certified</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-muted-foreground">Insured Services</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-muted-foreground">Warranty Protected</span>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-2xl p-8 space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4 flex items-center">
                  <Target className="w-6 h-6 mr-2" />
                  Our Mission
                </h3>
                <p className="text-lg text-muted-foreground">
                  To provide safe, reliable, and innovative electrical solutions that power Kenya's growth while 
                  maintaining the highest standards of quality, safety, and environmental responsibility. We are 
                  committed to helping Kenyan homes and businesses transition to sustainable energy solutions.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4 flex items-center">
                  <Eye className="w-6 h-6 mr-2" />
                  Our Vision
                </h3>
                <p className="text-lg text-muted-foreground">
                  To be East Africa's leading provider of integrated electrical and automation solutions, 
                  recognized for innovation, reliability, and exceptional customer service. We aim to 
                  transform how Kenya powers its future through technology and expertise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Areas */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Services Across Kenya</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Breezer Electric provides professional electrical services throughout Kenya, with teams available 
              in all major cities and regions.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {coverageAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm border">
                <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-muted-foreground">{area}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link to="/contact">
                <MapPin className="w-5 h-5 mr-2" />
                Check Service Availability in Your Area
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide our work and define our commitment to excellence in every project we undertake.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 space-y-4">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Professional Services</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Breezer Electric Kenya provides comprehensive electrical contracting and automation services for residential, 
              commercial, and industrial clients throughout Kenya. Our EPRA-certified electricians combine technical expertise 
              with cutting-edge technology to deliver solutions that enhance safety, efficiency, and convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="h-full overflow-hidden group hover:shadow-xl transition-all">
                <div 
                  className="w-full h-48 bg-cover bg-center rounded-t-xl group-hover:scale-105 transition-transform duration-300" 
                  style={{ backgroundImage: `url(${service.icon})` }}
                  aria-label={service.title}
                ></div>
                <CardContent className="p-6 space-y-4">
                  <CardTitle className="text-xl text-primary">{service.title}</CardTitle>
                  <p className="text-muted-foreground">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" className="w-full mt-4">
                    <Link to="/contact">Request Service</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Power Your Project with Kenya's Electrical Experts?</h2>
          <p className="text-xl text-primary-foreground/90">
            Contact our certified electrical professionals for a free consultation and quote. 
            We serve all regions of Kenya with reliable, professional electrical services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-hero bg-white text-primary hover:bg-gray-100">
              <Link to="/contact">Contact Our Fundis</Link>
            </Button>
            <Button variant="outline" className="btn-primary-outline border-white text-white" asChild>
              <Link to="/portfolio">
                View Our Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="pt-8 border-t border-white/20">
            <div className="flex items-center justify-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>24/7 Emergency Electrical Services Available</span>
            </div>
            <div className="mt-2">
              <a href="tel:0798836266" className="text-lg font-semibold hover:underline">Call Now: 0798836266</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;