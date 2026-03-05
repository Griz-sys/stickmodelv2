import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Users, Zap, Shield } from "lucide-react";
import { SimpleNav } from "@/components/simple-nav";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SimpleNav />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-widest text-slate-400 mb-4 uppercase">
              About StickModel
            </p>

            <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-6">
              Transforming Structural Drawings Into
              <span className="text-orange-600"> Accurate Stick Models</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              StickModel helps structural detailers convert 2D drawings into
              precise IFC stick models quickly and reliably — reducing manual
              effort and eliminating costly detailing errors.
            </p>
          </div>

          {/* Right Visual Block */}
          <div className="rounded-xl h-[340px] overflow-hidden bg-slate-100">
            <img
              src="/11bg.png"
              alt="Model Visualization"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <Stat number="500+" label="Models Delivered" />
          <Stat number="120+" label="Happy Clients" />
          <Stat number="4hr" label="Fastest Delivery" />
          <Stat number="99%" label="Accuracy Rate" />
        </div>
      </section>

      {/* MISSION */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="rounded-xl h-[380px] overflow-hidden bg-slate-100">
          <img
            src="/BSGS1.png"
            alt="Workflow Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="text-xs tracking-widest text-slate-400 mb-4 uppercase">
            Our Mission
          </p>

          <h2 className="text-3xl font-semibold mb-6">
            Simplifying Structural Detailing Workflows
          </h2>

          <p className="text-slate-600 leading-relaxed mb-6">
            Structural detailers spend countless hours manually converting
            drawings into models. StickModel removes this bottleneck by
            providing fast, reliable stick model generation from your structural
            drawings.
          </p>

          <p className="text-slate-600 leading-relaxed">
            Our goal is simple: reduce manual work, improve model accuracy, and
            allow engineers to focus on higher-value design decisions.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="mb-14">
          <p className="text-xs tracking-widest text-slate-400 uppercase mb-3">
            Why StickModel
          </p>

          <h2 className="text-3xl font-semibold">
            Designed for Structural Professionals
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Feature
            icon={<Zap />}
            title="Fast Turnaround"
            description="Receive accurate stick models in as little as 4 hours."
          />

          <Feature
            icon={<CheckCircle2 />}
            title="Precision Modeling"
            description="Industry-standard models compatible with your workflows."
          />

          <Feature
            icon={<Shield />}
            title="Secure Files"
            description="All drawings are stored and transferred securely."
          />

          <Feature
            icon={<Users />}
            title="Expert Support"
            description="Our team assists you through every stage of modeling."
          />
        </div>
      </section>

      {/* GALLERY */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-14">
          <p className="text-xs tracking-widest text-slate-400 uppercase mb-3">
            Showcase
          </p>

          <h2 className="text-3xl font-semibold">Our Work</h2>
        </div>

        <div className="rounded-xl h-[400px] overflow-hidden bg-slate-100">
          <img
            src="/cupbg1.png"
            alt="Our Work Showcase"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-5xl mx-auto px-6 text-center mb-16">
          <p className="text-xs tracking-widest text-slate-400 uppercase mb-3">
            Process
          </p>

          <h2 className="text-3xl font-semibold">How StickModel Works</h2>
        </div>

        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <Step
            number="01"
            title="Upload Your Drawing"
            desc="Upload your structural PDF or drawings securely."
          />

          <Step
            number="02"
            title="Model Generation"
            desc="Our experts convert drawings into IFC stick models."
          />

          <Step
            number="03"
            title="Preview Model"
            desc="Watch a preview video of your generated model."
          />

          <Step
            number="04"
            title="Download IFC"
            desc="Approve and download your production-ready model."
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-semibold text-lg">StickModel</div>

          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="/about">About</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, description }: any) {
  return (
    <Card className="border-slate-200 hover:shadow-lg transition">
      <CardContent className="p-6">
        <div className="w-10 h-10 flex items-center justify-center bg-orange-100 text-orange-600 rounded-md mb-4">
          {icon}
        </div>

        <h3 className="font-semibold mb-2">{title}</h3>

        <p className="text-sm text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function Step({ number, title, desc }: any) {
  return (
    <div className="flex gap-4 items-start">
      <div className="text-2xl font-semibold text-orange-600">{number}</div>

      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

function Stat({ number, label }: any) {
  return (
    <div>
      <div className="text-3xl font-semibold mb-1">{number}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}
