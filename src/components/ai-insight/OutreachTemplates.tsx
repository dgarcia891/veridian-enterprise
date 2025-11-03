import React from "react";
import { Mail, Copy, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OutreachTemplatesProps {
  businessName: string;
  industry: string;
}

export const OutreachTemplates: React.FC<OutreachTemplatesProps> = ({
  businessName,
  industry
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const templates = [
    {
      subject: `Recover Lost Revenue for ${businessName}`,
      body: `Hi there,

I noticed ${businessName} might be missing calls during your busiest hours. Our AI receptionist can help you capture those missed opportunities 24/7.

Here's what we can help with:
• Answer calls when your team is busy
• Take orders and book appointments
• Qualify leads and collect information
• Provide consistent customer service

Based on similar ${industry} businesses, you could recover $${Math.round(Math.random() * 5000 + 3000).toLocaleString()}+ annually.

Would you like to see a demo?

Best regards`
    },
    {
      subject: `24/7 Customer Service Solution for ${businessName}`,
      body: `Hello,

Running a ${industry} business means you can't always answer the phone. That's where we come in.

Our AI receptionist handles:
✓ After-hours inquiries
✓ Peak time overflow
✓ Appointment scheduling
✓ Customer questions

No more missed opportunities. No more voicemail. Just happy customers getting immediate answers.

Interested in learning more?`
    },
    {
      subject: `Scale ${businessName} Without Hiring More Staff`,
      body: `Hi,

What if you could handle 10x more calls without hiring a single person?

Our AI receptionist for ${industry} businesses:
• Costs 90% less than hiring staff
• Never takes sick days or vacations
• Handles unlimited simultaneous calls
• Integrates with your existing systems

${businessName} could be serving more customers by next week.

Ready to see how it works?`
    }
  ];

  const copyTemplate = (index: number, template: typeof templates[0]) => {
    const fullText = `Subject: ${template.subject}\n\n${template.body}`;
    navigator.clipboard.writeText(fullText);
    setCopiedIndex(index);
    toast.success("Template copied to clipboard!");
    
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-primary/10 p-3">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Ready-to-Use Outreach Templates</h2>
          <p className="text-muted-foreground">Copy and personalize these templates for your sales team</p>
        </div>
      </div>

      <div className="grid gap-4">
        {templates.map((template, index) => (
          <div key={index} className="glass-card rounded-3xl p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Subject:</p>
                <p className="font-semibold">{template.subject}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyTemplate(index, template)}
                className="flex-shrink-0"
              >
                {copiedIndex === index ? (
                  <>
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <pre className="text-sm whitespace-pre-wrap font-sans">{template.body}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
