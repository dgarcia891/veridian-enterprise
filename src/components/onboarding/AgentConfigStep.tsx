import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface AgentConfigData {
  greetingMessage: string;
  faqEntries: FaqEntry[];
  preferredVoice: string;
}

const VOICE_OPTIONS = [
  { value: "professional-female", label: "Professional Female" },
  { value: "professional-male", label: "Professional Male" },
  { value: "friendly-female", label: "Friendly Female" },
  { value: "friendly-male", label: "Friendly Male" },
];

interface Props {
  data: AgentConfigData;
  onChange: (data: AgentConfigData) => void;
  onNext: () => void;
  onBack: () => void;
}

const AgentConfigStep = ({ data, onChange, onNext, onBack }: Props) => {
  const addFaq = () => {
    onChange({ ...data, faqEntries: [...data.faqEntries, { question: "", answer: "" }] });
  };

  const removeFaq = (index: number) => {
    onChange({ ...data, faqEntries: data.faqEntries.filter((_, i) => i !== index) });
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const updated = data.faqEntries.map((f, i) => (i === index ? { ...f, [field]: value } : f));
    onChange({ ...data, faqEntries: updated });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="greeting">Greeting Message</Label>
        <Textarea
          id="greeting"
          value={data.greetingMessage}
          onChange={(e) => onChange({ ...data, greetingMessage: e.target.value })}
          placeholder="Hello, thank you for calling [Business Name]. How can I help you today?"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">This is the first thing callers will hear.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="voice">Voice</Label>
        <Select value={data.preferredVoice} onValueChange={(v) => onChange({ ...data, preferredVoice: v })}>
          <SelectTrigger id="voice"><SelectValue /></SelectTrigger>
          <SelectContent>
            {VOICE_OPTIONS.map((v) => (
              <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>FAQ Entries</Label>
          <Button type="button" variant="outline" size="sm" onClick={addFaq}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>

        {data.faqEntries.length === 0 && (
          <p className="text-sm text-muted-foreground">Add common questions your AI should answer.</p>
        )}

        {data.faqEntries.map((faq, i) => (
          <div key={i} className="p-3 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`faq-question-${i}`} className="text-xs font-medium text-muted-foreground">FAQ #{i + 1}</Label>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeFaq(i)} aria-label={`Remove FAQ ${i + 1}`}>
                <Trash2 className="w-4 h-4 text-destructive" aria-hidden="true" />
              </Button>
            </div>
            <Input
              id={`faq-question-${i}`}
              placeholder="Question"
              value={faq.question}
              onChange={(e) => updateFaq(i, "question", e.target.value)}
              aria-label={`FAQ ${i + 1} question`}
            />
            <Textarea
              id={`faq-answer-${i}`}
              placeholder="Answer"
              value={faq.answer}
              onChange={(e) => updateFaq(i, "answer", e.target.value)}
              rows={2}
              aria-label={`FAQ ${i + 1} answer`}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  );
};

export default AgentConfigStep;
