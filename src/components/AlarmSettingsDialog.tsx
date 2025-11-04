import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Volume2 } from "lucide-react";
import { AlarmSound, useAlarmSettings } from "@/hooks/useAlarmSettings";
import { Button } from "./ui/button";
import { playGeneratedSound } from "@/utils/audioGenerator";

interface AlarmSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const alarmSounds: { value: AlarmSound; label: string; description: string }[] = [
  { value: "bell", label: "Bell", description: "Classic bell sound" },
  { value: "chime", label: "Chime", description: "Gentle chime tones" },
  { value: "beep", label: "Beep", description: "Modern beep alert" },
  { value: "melody", label: "Melody", description: "Pleasant melody" },
];

export const AlarmSettingsDialog = ({ open, onClose }: AlarmSettingsDialogProps) => {
  const { selectedSound, updateSound } = useAlarmSettings();

  const playTestSound = async (sound: AlarmSound) => {
    try {
      await playGeneratedSound(sound, 0.5);
      console.log("Test sound played successfully");
    } catch (err) {
      console.error("Test sound failed:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            Alarm Sound Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <RadioGroup value={selectedSound} onValueChange={(value) => updateSound(value as AlarmSound)}>
            {alarmSounds.map((sound) => (
              <div key={sound.value} className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={sound.value} id={sound.value} />
                  <Label htmlFor={sound.value} className="cursor-pointer">
                    <div className="font-medium">{sound.label}</div>
                    <div className="text-xs text-muted-foreground">{sound.description}</div>
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => playTestSound(sound.value)}
                  className="ml-auto"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </RadioGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
};
