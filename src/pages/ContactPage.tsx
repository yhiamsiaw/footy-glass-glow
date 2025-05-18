
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-football-dark to-football-darker">
      <div className="container mx-auto py-12 px-4">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to matches
          </Link>
        </div>
        
        <div className="glass p-8 rounded-lg max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-3xl font-bold mb-6 text-football-orange">Contact Us</h1>
          
          <p className="mb-6 text-lg">
            Have a question, feedback, or found an issue with our service? We'd love to hear from you! Fill out the form below and our team will get back to you as soon as possible.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-football-blue"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-football-blue"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-football-blue"
                required
              >
                <option value="">Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Data Issue">Data Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-football-blue min-h-[150px]"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-football-blue hover:bg-football-blue/80 text-white px-6 py-3 rounded-lg transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <h2 className="text-xl font-bold mb-4 text-football-blue">Connect With Us</h2>
            <div className="flex items-center justify-center gap-6">
              <a href="#" className="glass p-3 rounded-full hover:bg-white/10 transition-colors">
                <span className="text-2xl">📱</span>
              </a>
              <a href="#" className="glass p-3 rounded-full hover:bg-white/10 transition-colors">
                <span className="text-2xl">📧</span>
              </a>
              <a href="#" className="glass p-3 rounded-full hover:bg-white/10 transition-colors">
                <span className="text-2xl">🐦</span>
              </a>
              <a href="#" className="glass p-3 rounded-full hover:bg-white/10 transition-colors">
                <span className="text-2xl">📘</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
