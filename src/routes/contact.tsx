import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/container";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Github,
  Linkedin,
  Twitter,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { toast } from "sonner";

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullFaq, setShowFullFaq] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success("Message Sent!", {
        description: "Thank you for your message. We'll get back to you within 24 hours."
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Container>
        <div className="py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about our AI Mock Interview platform? We'd love to hear from you. 
              Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Multiple ways to reach our team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-emerald-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600">pradhanadarsh727@gmail.com</p>
                      <p className="text-sm text-gray-500">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-emerald-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-gray-600">+918260230183</p>
                      <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-emerald-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">Office</h3>
                      <p className="text-gray-600">Bhubaneswar, Odisha</p>
                      <p className="text-sm text-gray-500">India</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-emerald-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media & Links */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Connect with Us</CardTitle>
                  <CardDescription>
                    Follow us on social media for updates and tips
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Github className="w-6 h-6 text-gray-700" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                    >
                      <Linkedin className="w-6 h-6 text-blue-700" />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-lg bg-sky-100 hover:bg-sky-200 transition-colors"
                    >
                      <Twitter className="w-6 h-6 text-sky-700" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Quick Links */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Help</CardTitle>
                  <CardDescription>
                    Common questions and resources
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">Frequently Asked Questions</h4>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium text-gray-800 mb-1">How does the AI interview system work?</h5>
                        <p>Our AI system generates realistic interview questions based on your job role and provides detailed feedback on your responses using advanced language models.</p>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium text-gray-800 mb-1">What types of questions are included?</h5>
                        <p>We include technical questions, behavioral questions, and role-specific scenarios to provide a comprehensive interview experience.</p>
                      </div>

                      {showFullFaq && (
                        <>
                          <div className="border rounded-lg p-3">
                            <h5 className="font-medium text-gray-800 mb-1">How accurate is the feedback?</h5>
                            <p>Our AI provides detailed analysis of your responses, communication skills, and technical knowledge. While it's very comprehensive, we recommend using it as a practice tool alongside human feedback.</p>
                          </div>
                          
                          <div className="border rounded-lg p-3">
                            <h5 className="font-medium text-gray-800 mb-1">Can I practice multiple times?</h5>
                            <p>Yes! You can take unlimited practice interviews. Each session generates new questions to keep your practice fresh and challenging.</p>
                          </div>

                          <div className="border rounded-lg p-3">
                            <h5 className="font-medium text-gray-800 mb-1">Is my data secure?</h5>
                            <p>Absolutely. We use industry-standard encryption to protect your data, and your interview responses are stored securely and never shared with third parties.</p>
                          </div>

                          <div className="border rounded-lg p-3">
                            <h5 className="font-medium text-gray-800 mb-1">What browsers are supported?</h5>
                            <p>Our platform works best on modern browsers like Chrome, Firefox, Safari, and Edge. For voice interviews, microphone access is required.</p>
                          </div>

                          <div className="border rounded-lg p-3">
                            <h5 className="font-medium text-gray-800 mb-1">Can I get a copy of my interview feedback?</h5>
                            <p>Yes, all your interview feedback is saved to your dashboard where you can review and download it anytime for future reference.</p>
                          </div>

                          <div className="border rounded-lg p-3">
                            <h5 className="font-medium text-gray-800 mb-1">Do you offer different difficulty levels?</h5>
                            <p>Yes, we offer beginner, intermediate, and advanced levels for most job roles. You can select your preferred difficulty when setting up your interview.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowFullFaq(!showFullFaq)}
                    >
                      {showFullFaq ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Show Less FAQ
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          View Full FAQ
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
