"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-3xl font-semibold text-charcoal mb-4">
          Get in Touch
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Have questions about our service? Need a custom quote? 
          We&apos;re here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <ContactCard
          icon={<Mail className="w-5 h-5" />}
          title="Email Us"
          description="hello@stickmodel.com"
          delay="100ms"
        />
        <ContactCard
          icon={<MessageSquare className="w-5 h-5" />}
          title="Live Chat"
          description="Available 9am - 6pm EST"
          delay="150ms"
        />
        <ContactCard
          icon={<Clock className="w-5 h-5" />}
          title="Response Time"
          description="Within 24 hours"
          delay="200ms"
        />
      </div>

      {/* Contact Form */}
      <Card className="rounded-lg animate-slide-up" style={{ animationDelay: "250ms" }}>
        <CardContent className="p-8">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-charcoal mb-2">Message Sent!</h2>
              <p className="text-slate-600">
                Thanks for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-charcoal mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    label="Name"
                    placeholder="Your name"
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@company.com"
                    required
                  />
                </div>
                
                <Input
                  label="Subject"
                  placeholder="How can we help?"
                  required
                />
                
                <Textarea
                  label="Message"
                  placeholder="Tell us more about your project or question..."
                  rows={5}
                  required
                />
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full md:w-auto"
                  isLoading={isSubmitting}
                >
                  {!isSubmitting && <Send className="w-4 h-4 mr-2" />}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ContactCard({ 
  icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: string;
}) {
  return (
    <Card className="rounded-lg animate-slide-up" style={{ animationDelay: delay }}>
      <CardContent className="p-6 text-center">
        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 mx-auto mb-3">
          {icon}
        </div>
        <h3 className="font-medium text-charcoal mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}
