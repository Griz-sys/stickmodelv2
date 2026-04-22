"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Clock, Send, CheckCircle2 } from "lucide-react";
import { HeroNav } from "@/components/hero-nav";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMsg = "Failed to send message. Please try again.";

        if (result.details) {
          errorMsg =
            typeof result.details === "string"
              ? result.details
              : String(result.details);
        } else if (result.error) {
          errorMsg =
            typeof result.error === "string"
              ? result.error
              : String(result.error);
        } else if (result.message) {
          errorMsg =
            typeof result.message === "string"
              ? result.message
              : String(result.message);
        }

        setError(errorMsg);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again later.";
      setError(errorMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* LEFT SIDE */}
          <div>
            <p className="text-xs tracking-widest text-slate-400 uppercase mb-4">
              Contact
            </p>

            <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-6">
              Let's Talk About
              <span style={{ color: 'var(--color-amber-700)' }}> Your Project</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-lg">
              Have questions about our stick modeling service or need a custom
              quote for your contract drawings? Our team is here to help.
            </p>

            <div className="space-y-6">
              <InfoRow
                icon={<Mail className="w-5 h-5" />}
                title="Email"
                desc="hello@stickmodel.com"
              />

              <InfoRow
                icon={<MessageSquare className="w-5 h-5" />}
                title="Live Chat"
                desc="Available 9am – 6pm EST"
              />

              <InfoRow
                icon={<Clock className="w-5 h-5" />}
                title="Response Time"
                desc="Within 24 hours"
              />
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-10">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>

                    <h2 className="text-xl font-semibold mb-2">
                      Message Sent!
                    </h2>

                    <p className="text-slate-600">
                      Thanks for reaching out. We'll reply within 24 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-8">
                      Send a Message
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <Input
                          label="Name"
                          placeholder="Your name"
                          name="name"
                          required
                        />
                        <Input
                          label="Email"
                          type="email"
                          placeholder="you@company.com"
                          name="email"
                          required
                        />
                      </div>

                      <Input
                        label="Subject"
                        placeholder="What can we help you with?"
                        name="subject"
                        required
                      />

                      <Textarea
                        label="Message"
                        placeholder="Tell us about your project..."
                        name="message"
                        rows={5}
                        required
                      />

                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                          {error}
                        </div>
                      )}

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
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <img src="/horizontal.svg" alt="StickModel" className="h-7 w-auto" />

          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="/#about">About</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function InfoRow({ icon, title, desc }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-md bg-orange-100 flex items-center justify-center text-orange-600">
        {icon}
      </div>

      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-slate-500">{desc}</div>
      </div>
    </div>
  );
}
