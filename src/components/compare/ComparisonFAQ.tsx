import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface ComparisonFAQProps {
  competitorName: string;
  extraFaqs?: FAQItem[];
}

const ComparisonFAQ = ({ competitorName, extraFaqs = [] }: ComparisonFAQProps) => {
  const baseFaqs: FAQItem[] = [
    {
      question: `How do I switch from ${competitorName} to AI Agents 3000?`,
      answer: `Switching is simple and takes under 48 hours. Sign up for AI Agents 3000, and our team handles the entire setup — configuring your AI receptionist, integrating with your CRM, and porting your number if needed. You can run both services in parallel during the transition so you never miss a call.`,
    },
    {
      question: `What about my existing contract with ${competitorName}?`,
      answer: `We recommend checking your ${competitorName} agreement for any cancellation terms or early-termination fees. Many customers run AI Agents 3000 alongside their current service during the notice period, then cancel once they're fully transitioned. Since we have no contracts, you only pay month-to-month.`,
    },
    {
      question: `Will my callers notice the difference?`,
      answer: `Our AI receptionist is trained on your business details — services, hours, FAQs, and tone — so callers get a seamless, professional experience. Most businesses report that callers can't tell they're speaking with AI, and response times actually improve since there's zero hold time.`,
    },
    {
      question: `Can I keep my current phone number?`,
      answer: `Yes. We can port your existing business number to AI Agents 3000 or set up call forwarding so your number stays the same. Your customers won't need to update anything.`,
    },
    {
      question: `What if I'm not satisfied after switching?`,
      answer: `AI Agents 3000 is month-to-month with no long-term contracts. If it's not the right fit, you can cancel anytime — no penalties, no hassle. We also offer a free demo so you can hear the AI in action before committing.`,
    },
  ];

  const allFaqs = [...baseFaqs, ...extraFaqs];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Switching from {competitorName} — FAQs
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {allFaqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </div>
    </section>
  );
};

export default ComparisonFAQ;
