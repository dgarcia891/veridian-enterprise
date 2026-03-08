import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  const ampm = h < 12 ? "AM" : "PM";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return { value: `${String(h).padStart(2, "0")}:${m}`, label: `${hour}:${m} ${ampm}` };
});

export interface DaySchedule {
  enabled: boolean;
  open: string;
  close: string;
}

export type BusinessHoursData = Record<string, DaySchedule>;

interface Props {
  data: BusinessHoursData;
  voicemailEnabled: boolean;
  onChange: (data: BusinessHoursData) => void;
  onVoicemailChange: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

const defaultSchedule = (): BusinessHoursData =>
  Object.fromEntries(DAYS.map((d) => [d, { enabled: d !== "Saturday" && d !== "Sunday", open: "08:00", close: "17:00" }]));

export { defaultSchedule };

const BusinessHoursStep = ({ data, voicemailEnabled, onChange, onVoicemailChange, onNext, onBack }: Props) => {
  const toggleDay = (day: string) => {
    onChange({ ...data, [day]: { ...data[day], enabled: !data[day].enabled } });
  };

  const setTime = (day: string, field: "open" | "close", value: string) => {
    onChange({ ...data, [day]: { ...data[day], [field]: value } });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {DAYS.map((day) => (
          <div key={day} className="flex items-center gap-3">
            <Switch checked={data[day]?.enabled ?? false} onCheckedChange={() => toggleDay(day)} />
            <span className="w-24 text-sm font-medium">{day}</span>
            {data[day]?.enabled && (
              <div className="flex items-center gap-2 text-sm">
                <Select value={data[day].open} onValueChange={(v) => setTime(day, "open", v)}>
                  <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>{TIMES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
                <span className="text-muted-foreground">to</span>
                <Select value={data[day].close} onValueChange={(v) => setTime(day, "close", v)}>
                  <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>{TIMES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}
            {!data[day]?.enabled && <span className="text-xs text-muted-foreground">Closed</span>}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
        <div>
          <Label className="font-medium">After-Hours Voicemail</Label>
          <p className="text-xs text-muted-foreground">AI takes a message when you're closed</p>
        </div>
        <Switch checked={voicemailEnabled} onCheckedChange={onVoicemailChange} />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  );
};

export default BusinessHoursStep;
