import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MessageSquare, Phone } from "lucide-react";

interface CommunicationPreferenceSliderProps {
  value: number; // 0-100 (0 = all phone, 100 = all text)
  onChange: (value: number) => void;
}

export const CommunicationPreferenceSlider = ({ value, onChange }: CommunicationPreferenceSliderProps) => {
  const textPercent = value;
  const phonePercent = 100 - value;

  return (
    <div className="space-y-4">
      <Label className="text-base">How do your customers prefer to communicate?</Label>
      
      <div className="relative">
        <Slider
          value={[value]}
          onValueChange={(val) => onChange(val[0])}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
        
        <div className="absolute -top-8 left-0 flex items-center gap-1 text-sm text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>Phone</span>
        </div>
        <div className="absolute -top-8 right-0 flex items-center gap-1 text-sm text-muted-foreground">
          <MessageSquare className="w-4 h-4" />
          <span>Text/Chat</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 p-4 rounded-lg bg-muted/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{textPercent}%</p>
            <p className="text-xs text-muted-foreground">prefer text/chat</p>
          </div>
        </div>
        
        <div className="h-12 w-px bg-border" />
        
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{phonePercent}%</p>
            <p className="text-xs text-muted-foreground">prefer phone calls</p>
          </div>
        </div>
      </div>
    </div>
  );
};
