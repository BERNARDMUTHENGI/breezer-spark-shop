import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  MessageSquare
} from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: '',
    budgetRange: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://breezer-electronics-3.onrender.com/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          serviceType: formData.serviceType,
          budgetRange: formData.budgetRange,
          message: formData.message
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const data = await response.json();
      
      toast({
        title: "Message Sent!",
        description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        serviceType: '',
        budgetRange: '',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      detail: "+254 721 597 396",
      description: "Call us for immediate assistance"
    },
    {
      icon: Mail,
      title: "Email",
      detail: "info.breezerelectricltd@gmail.com",
      description: "Send us your project details"
    },
    {
      icon: MapPin,
      title: "Location",
      detail: "Nairobi, Kenya",
      description: "Serving nationwide"
    },
    {
      icon: Clock,
      title: "Business Hours",
      detail: "Mon - Fri: 8AM - 6PM",
      description: "Sat: 8AM - 4PM, Sun: Emergency only"
    }
  ];

  const services = [
    "Electrical Contracting",
    "Generator Installation",
    "Solar Solutions", 
    "CCTV & Security Systems",
    "Electrical Design",
    "Maintenance & Repairs",
    "Emergency Services"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Get in touch with our certified electrical professionals for your next project
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="card-professional text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <info.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">{info.title}</h3>
                  <p className="font-medium text-foreground">{info.detail}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center">
                  <MessageSquare className="h-6 w-6 mr-2" />
                  Request a Quote
                </CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you with a detailed quote for your project.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        value={formData.firstName}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        value={formData.lastName}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={formData.phone}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <select 
                      id="serviceType" 
                      value={formData.serviceType}
                      onChange={handleChange}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a service</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="budgetRange">Project Budget (Optional)</Label>
                    <select 
                      id="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-50k">Under KSh 50,000</option>
                      <option value="50k-100k">KSh 50,000 - 100,000</option>
                      <option value="100k-500k">KSh 100,000 - 500,000</option>
                      <option value="500k-1m">KSh 500,000 - 1,000,000</option>
                      <option value="over-1m">Over KSh 1,000,000</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Project Details *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Please describe your project requirements, timeline, and any specific needs..."
                      className="min-h-[120px]"
                      value={formData.message}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <div className="space-y-8">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Why Choose Breezer Electric?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-secondary/20 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                    </div>
                    <div>
                      <h4 className="font-semibold">EPRA & NCA Certified</h4>
                      <p className="text-sm text-muted-foreground">Fully licensed electrical contractors</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-secondary/20 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Quality Guaranteed</h4>
                      <p className="text-sm text-muted-foreground">All work backed by warranty and professional standards</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-secondary/20 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                    </div>
                    <div>
                      <h4 className="font-semibold">24/7 Emergency Service</h4>
                      <p className="text-sm text-muted-foreground">Available for urgent electrical issues</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-secondary/20 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Competitive Pricing</h4>
                      <p className="text-sm text-muted-foreground">Fair, transparent pricing with no hidden costs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Service Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    We proudly serve clients across Kenya, with primary focus on:
                  </p>
                  <ul className="space-y-2">
                    {["Nairobi County", "Kiambu County", "Machakos County", "Kajiado County", "Murang'a County", "Nationwide Projects"].map((area, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold">Need Emergency Electrical Service?</h2>
          <p className="text-lg text-primary-foreground/90">
            We're available 24/7 for urgent electrical issues and emergency repairs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-hero">
              <a href="tel:+254721597396">
                <Phone className="h-4 w-4 mr-2" />
                Call Now: +254 721 597 396
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;