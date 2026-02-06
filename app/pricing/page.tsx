import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-3xl font-semibold text-charcoal mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Pay per project. No subscriptions, no hidden fees. 
          You only pay after reviewing and approving your model.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Standard */}
        <Card className="rounded-xl animate-slide-up">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-charcoal mb-1">Stick Model</h2>
              <p className="text-sm text-slate-500">Standard conversion</p>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-charcoal">$450</span>
              <span className="text-slate-500 ml-2">per project</span>
            </div>

            <ul className="space-y-3 mb-8">
              <PricingFeature>IFC stick model file</PricingFeature>
              <PricingFeature>~4 hour turnaround</PricingFeature>
              <PricingFeature>Video preview before payment</PricingFeature>
              <PricingFeature>Unlimited revisions</PricingFeature>
              <PricingFeature>Email support</PricingFeature>
            </ul>

            <Link href="/">
              <Button variant="secondary" className="w-full">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* With BOM */}
        <Card className="rounded-xl border-2 border-amber-400 relative animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-amber-400 text-charcoal text-xs font-semibold px-3 py-1 rounded-full">
              Most Popular
            </span>
          </div>
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-charcoal mb-1">Stick Model + BOM</h2>
              <p className="text-sm text-slate-500">With Bill of Materials</p>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-charcoal">$650</span>
              <span className="text-slate-500 ml-2">per project</span>
            </div>

            <ul className="space-y-3 mb-8">
              <PricingFeature>Everything in Standard</PricingFeature>
              <PricingFeature highlight>Detailed Bill of Materials (CSV)</PricingFeature>
              <PricingFeature highlight>Material quantities & specs</PricingFeature>
              <PricingFeature>~6-10 hour turnaround</PricingFeature>
              <PricingFeature>Priority support</PricingFeature>
            </ul>

            <Link href="/">
              <Button className="w-full">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="rounded-xl animate-slide-up" style={{ animationDelay: "200ms" }}>
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold text-charcoal mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <FAQ 
              question="When do I pay?" 
              answer="You only pay after we've created your model and you've approved the video preview. No upfront costs."
            />
            <FAQ 
              question="What file formats do you accept?" 
              answer="We accept structural drawings in PDF format. Make sure your drawings are clear and legible for best results."
            />
            <FAQ 
              question="What if I need revisions?" 
              answer="Unlimited revisions are included. If something doesn't match your drawing, we'll fix it at no extra cost."
            />
            <FAQ 
              question="Do you offer volume discounts?" 
              answer="Yes! Contact us for custom pricing on bulk projects or ongoing partnerships."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PricingFeature({ children, highlight = false }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${highlight ? 'text-amber-500' : 'text-emerald-500'}`} />
      <span className={`text-sm ${highlight ? 'text-charcoal font-medium' : 'text-slate-600'}`}>{children}</span>
    </li>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <h3 className="font-medium text-charcoal mb-1">{question}</h3>
      <p className="text-sm text-slate-600">{answer}</p>
    </div>
  );
}
