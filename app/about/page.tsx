import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Users, Zap, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-3xl font-semibold text-charcoal mb-4">
          About StickModel
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          We help structural detailers transform their drawings into accurate stick models, 
          saving time and reducing errors in the detailing process.
        </p>
      </div>

      {/* Mission */}
      <Card className="mb-12 rounded-lg animate-slide-up">
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold text-charcoal mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed">
            StickModel was founded with a simple goal: to streamline the structural detailing workflow. 
            We understand the challenges detailers face when converting 2D drawings into 3D models. 
            Our service bridges this gap, delivering precise stick models that integrate seamlessly 
            with your existing tools and processes.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <FeatureCard
          icon={<Zap className="w-6 h-6" />}
          title="Fast Turnaround"
          description="Get your stick models in as little as 4 hours. We know time is critical in construction projects."
          delay="100ms"
        />
        <FeatureCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          title="Accurate Models"
          description="Our team of experienced detailers ensures every model meets industry standards and your specifications."
          delay="150ms"
        />
        <FeatureCard
          icon={<Shield className="w-6 h-6" />}
          title="Secure & Confidential"
          description="Your drawings are handled with strict confidentiality. We use encrypted storage and secure transfers."
          delay="200ms"
        />
        <FeatureCard
          icon={<Users className="w-6 h-6" />}
          title="Expert Support"
          description="Questions about your model? Our support team is available to help you every step of the way."
          delay="250ms"
        />
      </div>

      {/* How It Works */}
      <Card className="rounded-lg animate-slide-up" style={{ animationDelay: "300ms" }}>
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold text-charcoal mb-6">How It Works</h2>
          <div className="space-y-6">
            <Step number={1} title="Upload Your Drawing" description="Upload your structural PDF drawing through our secure platform." />
            <Step number={2} title="We Create Your Model" description="Our team converts your drawing into an accurate IFC stick model." />
            <Step number={3} title="Review & Approve" description="Preview a video snippet of your model before making payment." />
            <Step number={4} title="Download & Use" description="Pay and download your IFC file, ready to use in your workflow." />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureCard({ 
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
      <CardContent className="p-6">
        <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-charcoal mb-2">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-charcoal font-semibold text-sm flex-shrink-0">
        {number}
      </div>
      <div>
        <h3 className="font-medium text-charcoal">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}
