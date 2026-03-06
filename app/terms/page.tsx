"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Terms of Use</h1>
          <Link href="/">
            <Button variant="secondary" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-sm max-w-none space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using StickModel, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on StickModel 
              for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and 
              under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile, reverse engineer, or disassemble any software</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials</li>
              <li>Using the materials for any unlawful purpose or in violation of applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">3. File Upload and Content</h2>
            <p>
              When uploading files to StickModel, you warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>You own or have authorization to upload the files</li>
              <li>The files do not violate any intellectual property rights</li>
              <li>The files do not contain malicious code, viruses, or harmful content</li>
              <li>You have the right to share the files with StickModel</li>
            </ul>
            <p className="mt-4">
              StickModel reserves the right to remove any content that violates these terms or is otherwise inappropriate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">4. Service Description and Modifications</h2>
            <p>
              StickModel provides services for converting structural drawings into stick models and related deliverables. 
              We strive for accuracy and quality, but do not guarantee the accuracy of the final models or deliverables. 
              We reserve the right to modify or discontinue services at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. Limitation of Liability</h2>
            <p>
              The materials on StickModel are provided on an 'as is' basis. StickModel makes no warranties, expressed or implied, 
              and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions 
              of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">6. Data Protection and Privacy</h2>
            <p>
              Your use of StickModel is also governed by our Privacy Policy. By using this service, you consent to our collection 
              and use of personal information as outlined in our Privacy Policy. We take data security seriously and implement 
              industry-standard protections for your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">7. User Accounts</h2>
            <p>
              If you create an account on StickModel, you are responsible for maintaining the confidentiality of your account 
              information and password. You agree to accept responsibility for all activities that occur under your account. 
              You must notify us of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">8. Intellectual Property Rights</h2>
            <p>
              The contents of StickModel, including but not limited to text, graphics, images, and code, are the property of 
              StickModel or its content suppliers and are protected by international copyright laws. The compilation of all content 
              on this service is the exclusive property of StickModel and protected by international copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">9. Limitations</h2>
            <p>
              In no event shall StickModel or its suppliers be liable for any damages (including, without limitation, damages for 
              loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on 
              StickModel, even if StickModel or a StickModel authorized representative has been notified orally or in writing of 
              the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">10. Revisions and Errors</h2>
            <p>
              The materials appearing on StickModel could include technical, typographical, or photographic errors. StickModel 
              does not warrant that any of the materials on its website are accurate, complete, or current. StickModel may make 
              changes to the materials contained on its service at any time without notice. However, StickModel does not commit to 
              updating the materials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">11. Links</h2>
            <p>
              StickModel has not reviewed all of the sites linked to its website and is not responsible for the contents of any 
              such linked site. The inclusion of any link does not imply endorsement by StickModel of the site. Use of any such 
              linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">12. Modifications of Terms of Service</h2>
            <p>
              StickModel may revise these terms of service for its service at any time without notice. By using this service, 
              you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">13. Jurisdiction</h2>
            <p>
              These conditions and terms are governed by and construed according to the laws of the jurisdiction in which 
              StickModel operates, and you irrevocably submit to the exclusive jurisdiction of the courts located there.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">14. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Use, please contact us at support@stickmodel.com or visit our 
              contact page for more information.
            </p>
          </section>

          <div className="border-t border-slate-200 pt-8 mt-12">
            <p className="text-sm text-slate-500">
              Last Updated: March 6, 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
