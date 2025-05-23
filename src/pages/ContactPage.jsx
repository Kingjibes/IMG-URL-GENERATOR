import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea'; 
    import { useToast } from '@/components/ui/use-toast';
    import { Send, Mail } from 'lucide-react';
    import { motion } from 'framer-motion';

    const ContactPage = () => {
      const { toast } = useToast();
      const [formData, setFormData] = useState({ name: '', email: '', message: '' });
      const [isSubmitting, setIsSubmitting] = useState(false);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Form data submitted:", formData); 
        toast({
          title: "Message Sent!",
          description: "Thanks for reaching out. We'll get back to you soon.",
        });
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitting(false);
      };

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-8 p-4 md:p-8"
        >
          <div className="text-center space-y-2">
            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Contact Us
            </motion.h1>
            <p className="text-lg text-slate-300">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>

          <motion.div 
            className="w-full max-w-lg p-6 md:p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-1">Full Name</label>
                <Input 
                  type="text" 
                  name="name" 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name" 
                  required 
                  className="bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-1">Email Address</label>
                <Input 
                  type="email" 
                  name="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com" 
                  required 
                  className="bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-200 mb-1">Message</label>
                <Textarea 
                  name="message" 
                  id="message" 
                  rows={4} 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..." 
                  required 
                  className="bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-3 text-base disabled:opacity-70 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2 h-5 w-5"
                    >
                       <Mail />
                    </motion.div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
          
          <motion.div 
            className="mt-8 text-center text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p>Alternatively, you can email us directly at:</p>
            <a href="mailto:support@hackerpro.example.com" className="text-sky-400 hover:text-sky-300 transition-colors font-medium">
              support@hackerpro.example.com
            </a>
          </motion.div>
        </motion.div>
      );
    };

    export default ContactPage;