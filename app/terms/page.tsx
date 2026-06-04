"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { HeroNav } from "@/components/hero-nav";
import { SiteFooter } from "@/components/site-footer";
import { motion, AnimatePresence } from "framer-motion";

const POLICIES = [
  {
    title: "Terms and Conditions",
    effectiveDate: "June 2026 · Version 1.0",
    body: `1. About StickModel and VeCube

StickModel (stickmodel.com) is a brand, platform, and service wholly owned and operated by VeCube ("Company", "we", "us", or "our"). The name "StickModel", the domain stickmodel.com, and all associated branding, logos, and trademarks are the exclusive property of VeCube. Nothing in these Terms grants you any right, title, or interest in the StickModel brand or the stickmodel.com domain name. VeCube is the contracting entity for all services delivered through the StickModel platform. Any references to "StickModel" in these Terms are references to VeCube operating under that brand.

2. Description of Services

StickModel converts 2D structural drawings (PDF or CAD format) into 3D stick models (wireframe models), automated grid systems, Bill of Materials (BOM), member identification data, levels and elevations, and associated outputs (collectively, "Deliverables") for use in structural steel detailing workflows, including Tekla Structures and similar software. The standard turnaround time is twenty-four (24) hours from the time of confirmed order and successful receipt of complete, legible input files. Turnaround times are targets and not contractual guarantees unless expressly confirmed in writing.

3. Eligibility and Account Registration

The Service is intended for professional use by structural steel fabricators, detailers, estimators, and related engineering professionals. By using the Service, you represent and warrant that: you are at least 18 years of age; you are using the Service for professional or commercial purposes; the information you provide during registration is accurate and complete; and you have the authority to bind your organisation to these Terms if acting on its behalf. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.

4. Client Responsibilities – Input Files

4.1 Acceptable Inputs: You may upload 2D structural drawings in PDF or CAD format. Files must be legible, dimensioned, and structurally complete, including plan views, elevations, sections, and connection details as applicable.

4.2 Your Obligations: You represent and warrant that you own or are duly licensed to share all drawings and files uploaded to the Service; the drawings do not contain third-party confidential information you are not authorised to share; the drawings are accurate and not materially incomplete or misleading; and you will promptly respond to any requests for clarification on ambiguous or incomplete input.

We reserve the right to reject files that are illegible or structurally ambiguous. In such cases, we will notify you and offer a refund or resubmission opportunity.

5. Fees, Payment, and Access to Deliverables

Fees for the Service are as set out at stickmodel.com/pricing or as separately agreed in writing. All prices are exclusive of applicable taxes unless stated otherwise. Payment is required in full before Deliverables are made available for download. Completed models will be held on our platform until payment is confirmed. Orders will not be commenced until payment is received and cleared, unless credit terms have been separately agreed in writing. We accept payment via the methods listed on our platform at the time of order. In the event of disputed invoices, you must notify us in writing within seven (7) days of the invoice date. Undisputed amounts remain due and payable. Failure to pay within the agreed timeframe may result in suspension of your account and forfeiture of Deliverables held on the platform.

6. Deliverables and Accuracy

6.1 Scope of Deliverables: Each completed order includes a constructible 3D stick model (wireframe), automated grid and coordinate system, member identification and labelling, levels and elevations, and files in formats compatible with Tekla Structures (and IFC where applicable).

6.2 Exclusions: The following are explicitly not included unless separately agreed in writing: connection design or detailing; structural engineering calculations or analysis; compliance review against any building code or standard; clash detection or multi-discipline BIM coordination.

6.3 Client Review Obligation: You are responsible for reviewing all Deliverables before use in fabrication, detailing, or downstream engineering. A qualified structural engineer or senior detailer should review the model prior to use in production. By proceeding to fabrication or further detailing, you accept the Deliverables as-is.

7. Turnaround, Delivery, and Delays

We target delivery within 24 hours of confirmed receipt of complete and legible input files. We are not liable for delays caused by: incomplete, ambiguous, or illegible input files; unanswered requests for clarification; force majeure events (see Section 13); or platform maintenance or technical outages communicated in advance. If we anticipate a delay beyond the standard turnaround, we will notify you promptly. Delay does not entitle you to a refund unless we have committed to a specific deadline in writing and have materially breached it.

8. Intellectual Property

8.1 Your Input Files: You retain all ownership rights in your drawings and uploaded documents. By uploading files, you grant StickModel (VeCube) a limited, non-exclusive, royalty-free licence to use and process your files solely for the purpose of delivering the Service.

8.2 Deliverables: Upon full payment of all applicable fees, you receive a perpetual, non-exclusive licence to use the Deliverables for your internal professional purposes, including structural detailing, fabrication, and estimation. You may not resell, sublicence, or redistribute the Deliverables as a standalone product without our prior written consent.

8.3 Platform, Brand, and Domain: All rights in the StickModel platform, the stickmodel.com domain name, VeCube's proprietary modelling systems, software, algorithms, workflows, and all associated branding and trademarks remain the exclusive property of VeCube. Nothing in these Terms transfers any such rights to you. Unauthorised use of the StickModel name, brand, or domain is strictly prohibited.

8.4 Anonymised Data: We may use anonymised, aggregated, and de-identified usage data to improve our systems and publish performance benchmarks. No personally identifiable or project-specific information will be disclosed.

9. Confidentiality

Each party agrees to treat as confidential all non-public information received from the other party. We will not disclose your project drawings or files to any third party except: to our employees or contractors who need access to perform the Service, under equivalent confidentiality obligations; as required by applicable law, regulation, or court order; or with your prior written consent.

10. Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW: We are not liable for any indirect, incidental, consequential, or punitive damages, including loss of profit, fabrication errors, or project delays arising from your use of the Deliverables. Our total aggregate liability shall not exceed the fees paid by you for the specific order giving rise to the claim. The Deliverables are geometric modelling aids and do not constitute structural engineering advice or certification. We do not accept liability for structural failures, engineering errors, or code non-compliance.

11. Indemnification

You agree to indemnify and hold harmless StickModel, VeCube, and their respective officers, employees, and contractors from and against any claims, damages, and costs arising from: your use of the Deliverables, including reliance on them in fabrication without appropriate professional review; your breach of these Terms; any infringement of third-party intellectual property rights arising from your uploaded files; or any claim by your clients arising from errors in the underlying drawings you provided to us.

12. Revisions

If you believe a Deliverable contains an error attributable to our processing (not an error in your input drawings), you must notify us in writing within five (5) business days of delivery. If the error is attributable to us, we will provide a corrected Deliverable at no additional charge. Revisions due to design changes or new information not present in the original drawings will be treated as new orders.

13. Force Majeure

We shall not be liable for failure or delay caused by circumstances beyond our reasonable control, including acts of God, natural disasters, war, cyber-attacks, power failures, or government actions.

14. Termination

We may suspend or terminate your access if you breach these Terms, if we suspect fraudulent or unlawful activity, or if we discontinue the Service with reasonable notice. Sections 8, 9, 10, 11, and 16 survive termination.

15. Modifications to These Terms

We may update these Terms at any time with reasonable notice by email or platform notice. Continued use of the Service after the effective date of any update constitutes acceptance of the revised Terms.

16. Governing Law and Dispute Resolution

These Terms are governed by the laws of India. Disputes shall be submitted to the exclusive jurisdiction of the courts of Mumbai, Maharashtra. You agree to attempt informal resolution by contacting us before commencing formal proceedings.

17. General Provisions

Entire Agreement: These Terms constitute the entire agreement between you and StickModel (VeCube) regarding the Service. Severability: If any provision is found unenforceable, the remaining provisions continue in full force. Waiver: Our failure to enforce any provision does not constitute a waiver of that provision. Assignment: You may not assign your rights without our prior written consent. No Agency: Nothing herein creates any partnership, joint venture, or agency between the parties.`,
  },
  {
    title: "Privacy Policy",
    effectiveDate: "June 2026 · Version 1.0",
    body: `1. Who We Are

The data fiduciary for all personal data collected through stickmodel.com is VeCube. StickModel is a brand and service wholly owned and operated by VeCube. When this policy refers to "we", "us", or "our", it refers to VeCube.

2. What Data We Collect

2.1 Account and Registration Data: Name, email address, phone number, and company/organisation name. Job title or professional role (e.g., fabricator, detailer, estimator). Billing information — invoicing details, GST number where applicable.

2.2 Project and File Data: 2D structural drawings and CAD/PDF files you upload to the platform. Project names, descriptions, and associated metadata. Completed Deliverables (3D models, BOM files) generated from your inputs.

2.3 Payment Data: Transaction records, payment confirmation status, and invoice history. We do not store raw card numbers or banking credentials — payment processing is handled by our payment gateway partners.

2.4 Usage and Technical Data: IP address, browser type, device type, operating system. Pages visited, actions taken on the platform, session duration. Error logs and performance data.

3. How We Use Your Data

We use your personal data to: create and manage your account; process orders, deliver Deliverables, and manage billing; communicate with you about your orders, including status updates and clarification requests; respond to support queries and complaints; improve our platform, modelling systems, and service quality; comply with legal and regulatory obligations; and send service-related notices (not marketing) by email.

We do not sell, rent, or trade your personal data to third parties for marketing purposes.

4. Legal Basis for Processing

We process your personal data under the following bases (as applicable under the DPDP Act, 2023): Consent — where you have given us clear consent at the point of data collection. Contract performance — processing necessary to fulfil our service obligations to you. Legal obligation — where processing is required to comply with applicable law. Legitimate interests — for platform security, fraud prevention, and service improvement, where these interests are not overridden by your rights.

5. Data Sharing

We share your data only in the following circumstances: Internal team and contractors — employees and freelance professionals engaged by VeCube to deliver the Service, bound by confidentiality obligations. Payment processors — to process transactions; these partners operate under their own privacy policies and PCI-DSS obligations. Technology providers — cloud hosting, email delivery, and platform infrastructure providers, under data processing agreements. Legal requirements — where disclosure is required by law, court order, or regulatory authority. Business transfers — in the event of a merger, acquisition, or sale of VeCube assets, your data may be transferred to the successor entity.

We do not share your project drawings or structural files with any third party other than the internal team assigned to your order.

6. Data Retention

We retain your personal data for as long as your account is active or as needed to provide the Service. Specifically: Account data — retained for the duration of your account plus 3 years. Project files and Deliverables — retained for 90 days after delivery, after which they may be deleted from our servers; you are responsible for downloading and storing your Deliverables. Payment records — retained for 7 years to comply with Indian financial regulations. Support correspondence — retained for 2 years.

7. Data Security

We implement appropriate technical and organisational measures to protect your data, including: encrypted transmission (HTTPS/TLS) for all file uploads and downloads; secure cloud storage with access controls; and restricted access to project files on a need-to-know basis.

No system is completely secure. In the event of a data breach that is likely to result in high risk to your rights and freedoms, we will notify you and the relevant authorities as required under applicable law.

8. Your Rights Under the DPDP Act, 2023

Under the DPDP Act, 2023 and applicable law, you have the right to: Access — request a copy of the personal data we hold about you. Correction — request correction of inaccurate or incomplete data. Erasure — request deletion of your data, subject to our legal and contractual obligations. Withdraw consent — where processing is based on consent, withdraw it at any time without affecting the lawfulness of prior processing. Grievance redressal — lodge a complaint with us or with the Data Protection Board of India.

To exercise any of these rights, please contact us using the details in Section 10.

9. Cookies and Tracking

We use essential cookies to maintain your session and enable core platform functionality. We may use analytics cookies to understand platform usage patterns. You can control cookie settings through your browser, though disabling essential cookies may affect platform functionality.

10. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of material changes by email or by posting a notice on the platform. Continued use of the Service after the effective date of any update constitutes acceptance of the revised policy.`,
  },
  {
    title: "Refund Policy",
    effectiveDate: "June 2026 · Version 1.0",
    body: `1. Payment and Access

Payment is required in full before Deliverables are released for download. By making payment, you acknowledge that you have reviewed the Service description and agree to the scope of work as described in our Terms and Conditions.

2. Eligible Refunds

We will issue a full refund in the following circumstances:

Non-delivery: We are unable to deliver a usable Deliverable from your input files and cannot provide a corrected output within a reasonable time.

Material processing error: The Deliverable contains a significant geometric error that is demonstrably attributable to our processing and not to your input drawings, and we are unable to correct it within five (5) business days of your written notification.

Missed contractual deadline: We have committed in writing to a specific delivery deadline and have materially failed to meet it.

Service non-commencement: You cancel your order before we have commenced modelling work (see Cancellation Policy).

3. Non-Eligible Refunds

Refunds will not be issued in the following circumstances: errors in the underlying input drawings you provided — including incomplete drawings, incorrect dimensions, missing members, or structural ambiguities; dissatisfaction with the scope of the Service as clearly described at the time of order (e.g., the model does not include connection design, structural calculations, or code compliance review); design changes made after the order was placed; failure to download Deliverables within the retention window (90 days post-delivery); downstream losses arising from your use or reliance on the Deliverables, including fabrication errors or project delays; or partial dissatisfaction where the Deliverable substantially meets the agreed scope.

4. Partial Refunds

In cases where work has partially commenced and a refund is warranted for reasons outside our control (e.g., client withdraws project), we may at our discretion issue a partial refund reflecting the proportion of work not yet completed.

5. How to Request a Refund

To request a refund, contact us within five (5) business days of the delivery date (or the expected delivery date in cases of non-delivery). Your request must include: your order reference number; a clear description of the issue; and supporting evidence (e.g., screenshots, annotated model files) where applicable.

We will acknowledge your request within two (2) business days and aim to resolve it within ten (10) business days.

6. Refund Method and Timeline

Approved refunds will be processed to the original payment method. Processing times depend on your payment provider: UPI / Bank transfer — 3 to 5 business days. Credit or debit card — 5 to 10 business days, depending on your card issuer.

We are not responsible for delays caused by your bank or payment provider.

7. Disputes

If you are not satisfied with the outcome of your refund request, you may escalate to us in writing. Unresolved disputes will be handled in accordance with the governing law and dispute resolution provisions in our Terms and Conditions.`,
  },
  {
    title: "Cancellation Policy",
    effectiveDate: "June 2026 · Version 1.0",
    body: `1. Cancellation Before Modelling Commences

If you wish to cancel an order before our modelling team has commenced work on your files, you are entitled to a full refund of any payment made. To cancel at this stage, contact us immediately via stickmodel.com/contact with your order reference. Given our 24-hour turnaround, the window for pre-commencement cancellation is narrow. We recommend contacting us as soon as possible after order placement if you need to cancel.

2. Cancellation After Modelling Has Commenced

Once our team has begun processing your input files, we reserve the right to charge for the work completed to that point. The applicable charge will be assessed based on the proportion of work completed at the time of cancellation:

Less than 25% complete: 25% of the order value will be charged.
25% to 75% complete: 50% of the order value will be charged.
More than 75% complete: The full order value will be charged. At this stage, we will proceed to delivery.

Progress estimates will be provided by our team upon cancellation request and are final. We will make reasonable efforts to inform you of progress if you contact us during the modelling window.

3. Cancellation After Delivery

Once Deliverables have been made available for download, no cancellation or refund is available on the basis of a change of mind or project cancellation on your side. Please refer to our Refund Policy for circumstances in which a post-delivery refund may be considered.

4. Cancellation by StickModel (VeCube)

We reserve the right to cancel an order in the following circumstances: the input files are found to be illegible, incomplete, or unsuitable for processing and clarification cannot be obtained within a reasonable time; we identify a violation of our Terms and Conditions; or a force majeure event prevents us from fulfilling the order.

In the event of cancellation by us, you will receive a full refund of any payment made.

5. How to Cancel

To request a cancellation, contact us immediately via the contact form at stickmodel.com/contact. Include your order reference number and reason for cancellation. Cancellations are only effective upon written acknowledgement from our team. We aim to respond to cancellation requests within two (2) business hours during working hours.

6. Recurring Arrangements

If you have a recurring or volume agreement with us, cancellation terms will be as specified in your separate agreement. In the absence of a separate agreement, this Cancellation Policy applies to each individual order.`,
  },
  {
    title: "Delivery Policy",
    effectiveDate: "June 2026 · Version 1.0",
    body: `1. Nature of Delivery – Digital Only

All Deliverables — including 3D stick models, Bill of Materials (BOM), grid systems, and associated files — are delivered digitally through your StickModel account. No physical goods are shipped at any point. This policy uses the term "delivery" exclusively to refer to digital file delivery.

2. Standard Delivery Turnaround

Our standard delivery turnaround is twenty-four (24) hours. The 24-hour clock begins when all of the following conditions are met: your order has been placed and payment confirmed; all required input files (2D drawings in PDF or CAD format) have been successfully uploaded; and our team has confirmed receipt and that the files are complete and legible.

If your input files require clarification, the clock pauses until we receive your response.

3. How You Receive Your Deliverables

Upon completion, your Deliverables will be made available in your StickModel account dashboard. You will receive an email notification to your registered email address when the files are ready. Payment must be confirmed before Deliverables are released for download. If your payment has not yet cleared at the time of completion, your files will be held securely in your account and released immediately upon payment confirmation.

4. File Formats Delivered

Unless otherwise agreed, Deliverables are provided in formats optimised for Tekla Structures, including: 3D stick model files (native Tekla-compatible formats); IFC export files for use in other BIM-compatible software; Bill of Materials in structured spreadsheet format (Excel / CSV); and grid and coordinate reference documentation.

If you require a specific file format not listed above, please specify this at the time of order. Additional formats may be accommodated at our discretion and may attract additional charges.

5. Delivery Retention and Download Window

Completed Deliverables are stored in your account for ninety (90) days from the date of delivery. After this period, files may be deleted from our servers without further notice. You are responsible for downloading and securely storing your Deliverables within the 90-day window. We are not obligated to retain or re-deliver files after this period. Re-delivery requests after expiry may be accommodated at our discretion and may attract an administration fee.

6. Delayed or Failed Delivery

If you have not received a delivery notification within 24 hours of meeting all the conditions in Section 2, please first: check your spam or junk email folder; log into your StickModel account to check your order status directly; and verify that your input files were accepted and no clarification request is outstanding.

If the issue persists, contact us immediately via stickmodel.com/contact with your order reference. We will investigate and respond within two (2) business hours during working hours.

7. International Clients

StickModel serves clients globally. All delivery is digital and there are no geographic restrictions on receiving Deliverables. Payments from international clients may be subject to currency conversion and international transfer fees applied by your bank or payment provider, which are your responsibility. Deliverables are provided in English and standard international file formats.

8. No Physical Goods

For the avoidance of doubt, StickModel does not ship any physical goods, hardware, printed drawings, or physical media. This policy does not constitute a "shipping policy" in the conventional e-commerce sense. It is provided to meet standard platform disclosure requirements and to clearly set expectations for digital delivery.`,
  },
];

export default function TermsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroNav />

      <section className="max-w-4xl mx-auto px-6 pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs tracking-widest text-slate-400 uppercase mb-5">Legal</p>
          <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-5">
            Terms &amp; <span style={{ color: "#E67E00" }}>Policies</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            All policies governing your use of StickModel — effective June 2026.
          </p>
        </motion.div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-28">
        <div className="space-y-4">
          {POLICIES.map((policy, idx) => {
            const isOpen = expanded === String(idx);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
              >
                <button
                  onClick={() => toggle(String(idx))}
                  className="w-full flex items-start justify-between py-5 px-6 text-left group border border-slate-200 rounded-lg hover:border-[#E67E00] hover:bg-[#E67E00]/5 transition-all"
                >
                  <div>
                    <span className="font-semibold text-slate-900 group-hover:text-[#E67E00] transition-colors text-base">
                      {policy.title}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-widest">
                      Effective Date: {policy.effectiveDate}
                    </p>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 text-slate-400 group-hover:text-[#E67E00] transition-colors mt-1"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-4 text-slate-600 leading-relaxed text-sm border-l-4 border-[#E67E00] whitespace-pre-line">
                        {policy.body}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center p-8 bg-slate-50 rounded-lg border border-slate-200"
        >
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Questions about our policies?
          </h3>
          <p className="text-slate-500 text-sm mb-1">StickModel — a service of VeCube</p>
          <p className="text-slate-500 text-sm">
            Contact us at{" "}
            <a href="mailto:shubhu@stickmodel.com" className="text-[#E67E00] hover:underline">
              shubhu@stickmodel.com
            </a>{" "}
            or via{" "}
            <a href="/contact" className="text-[#E67E00] hover:underline">
              stickmodel.com/contact
            </a>
          </p>
        </motion.div>
      </section>

      <SiteFooter />
    </div>
  );
}
