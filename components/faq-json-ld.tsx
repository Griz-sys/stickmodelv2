import { JsonLd } from "@/components/json-ld";

export interface FaqItem {
  question: string;
  answer: string;
}

// Renders schema.org FAQPage structured data. Pass the exact same `faqs`
// array used to render the visible FaqSection(s) on the page so the
// question/answer text can never drift from what crawlers see.
export function FaqJsonLd({ faqs }: { faqs: FaqItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}
