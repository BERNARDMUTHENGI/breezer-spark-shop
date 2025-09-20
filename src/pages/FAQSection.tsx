import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Phone } from "lucide-react";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";

const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openItems, setOpenItems] = useState({});

  const phoneNumber = "254798836266";
  const tiktokUsername = "breezer_electric";

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqData = {
    general: [
      {
        id: "gen-1",
        question: "How much does electrical installation cost in Kenya?",
        answer: "Electrical installation costs in Kenya vary depending on project size and complexity. For a standard 3-bedroom house, basic electrical installation can range from KES 80,000 to KES 150,000. Commercial projects are priced based on square footage and specific requirements. Contact our certified electricians for a free, no-obligation quote tailored to your specific project."
      },
      {
        id: "gen-2",
        question: "Are Breezer Electric electricians licensed in Kenya?",
        answer: "Yes, all our electricians are EPRA (Energy and Petroleum Regulatory Authority) certified and NCA (National Construction Authority) licensed. We maintain all necessary certifications to ensure compliance with Kenya's electrical safety standards and building codes. Our team regularly undergoes training to stay updated with the latest regulations and technologies."
      },
      {
        id: "gen-3",
        question: "Do you provide emergency electrical services?",
        answer: "Yes, we offer 24/7 emergency electrical repair services across Kenya. Our rapid response team can handle power outages, electrical faults, dangerous wiring situations, and other urgent electrical issues. Call 0798836266 at any time for immediate assistance from our certified emergency electricians."
      }
    ],
    services: [
      {
        id: "serv-1",
        question: "What areas in Kenya do you serve?",
        answer: "We provide comprehensive electrical services across Kenya, including Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Thika, Naivasha, and all major towns and regions. Our team travels throughout the country to serve both residential and commercial clients with professional electrical solutions."
      },
      {
        id: "serv-2",
        question: "How long does a typical electrical installation take?",
        answer: "The duration depends on the project scope. A standard residential installation takes 3-7 days, while commercial projects may take 2-6 weeks. Rewiring an existing home typically takes 2-5 days. We provide detailed timelines during our free consultation and work efficiently to minimize disruption to your home or business."
      },
      {
        id: "serv-3",
        question: "Do you offer warranty on your electrical work?",
        answer: "Yes, we provide a 24-month warranty on all our electrical installations and repairs. For solar systems, we offer up to 5 years on installation workmanship and manufacturer warranties on equipment. All warranty details are clearly outlined in your contract for complete peace of mind."
      }
    ],
    technical: [
      {
        id: "tech-1",
        question: "What electrical standards do you follow?",
        answer: "We strictly adhere to Kenyan electrical standards including the Energy Act, EPRA regulations, and IEC (International Electrotechnical Commission) standards. Our installations comply with the Wiring Rules (KS 03-5001) and all relevant building codes to ensure safety, reliability, and compliance with local regulations."
      },
      {
        id: "tech-2",
        question: "Can you integrate solar with my existing electrical system?",
        answer: "Yes, we specialize in integrating solar power systems with existing electrical installations. Our experts will assess your current setup and design a seamless integration that maximizes efficiency and safety. We handle all aspects including net metering applications for grid-tie systems where available."
      },
      {
        id: "tech-3",
        question: "What brands of electrical materials do you use?",
        answer: "We use only high-quality, certified electrical materials from reputable brands such as Legrand, Schneider Electric, Siemens, and Kenyan-approved manufacturers. For solar installations, we work with tier-1 panel manufacturers and reputable battery brands to ensure longevity and performance."
      }
    ],
    commercial: [
      {
        id: "com-1",
        question: "Do you serve commercial and industrial clients?",
        answer: "Yes, we provide comprehensive electrical services for commercial and industrial clients including offices, retail spaces, factories, hotels, and agricultural operations. Our commercial services include three-phase power installations, energy management systems, lighting solutions, and backup power systems tailored to business needs."
      },
      {
        id: "com-2",
        question: "Can you help with electrical permits and approvals?",
        answer: "Absolutely. We handle the entire permit process for our clients, including applications to EPRA, NCA, and local county authorities. Our team is experienced in navigating Kenya's regulatory requirements and ensures all installations are properly certified and documented for your peace of mind."
      },
      {
        id: "com-3",
        question: "Do you offer maintenance contracts for businesses?",
        answer: "Yes, we offer customized maintenance contracts for commercial and industrial clients. These include regular electrical system inspections, preventive maintenance, emergency support, and priority service. Maintenance contracts help prevent unexpected downtime and extend the life of your electrical systems."
      }
    ]
  };

  const categories = [
    { id: "general", name: "General Questions" },
    { id: "services", name: "Services" },
    { id: "technical", name: "Technical" },
    { id: "commercial", name: "Commercial" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about our electrical services, processes, and policies. 
            If you don't see what you're looking for, contact us directly.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className="rounded-full px-6 py-2"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {faqData[activeCategory].map(item => (
            <Card key={item.id} className="mb-4 overflow-hidden border-none shadow-md">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors"
              >
                <h3 className="text-lg font-semibold text-primary pr-4">
                  {item.question}
                </h3>
                {openItems[item.id] ? (
                  <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </button>
              
              {openItems[item.id] && (
                <CardContent className="p-6 pt-0">
                  <div className="border-t pt-6">
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Support CTA */}
        <div className="max-w-4xl mx-auto mt-16 p-8 bg-primary/5 rounded-xl text-center">
          <h3 className="text-2xl font-bold text-primary mb-4">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Our team of electrical experts is ready to answer any questions you may have about 
            your project, pricing, or our services.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <a href={`https://wa.me/${phoneNumber}`}>
                <FaWhatsapp className="mr-2 h-5 w-5" />
                Chat on WhatsApp
              </a>
            </Button>
            
            <Button asChild variant="outline">
              <a href="tel:0798836266">
                <Phone className="mr-2 h-5 w-5" />
                Call 0798836266
              </a>
            </Button>
          </div>
          
          <div className="mt-6 flex justify-center space-x-4">
            <a
              href={`https://www.tiktok.com/@${tiktokUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <FaTiktok className="mr-2 h-4 w-4" />
              Follow us on TikTok
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;