import { useState, useEffect } from "react";
import { Preferences } from "@capacitor/preferences";

export type AlarmSound = "bell" | "chime" | "beep" | "melody";

const ALARM_SETTINGS_KEY = "flowstate_alarm_settings";

export const useAlarmSettings = () => {
  const [selectedSound, setSelectedSound] = useState<AlarmSound>("bell");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const { value } = await Preferences.get({ key: ALARM_SETTINGS_KEY });
      if (value) {
        setSelectedSound(value as AlarmSound);
      }
      setIsLoaded(true);
    };
    loadSettings();
  }, []);

  const updateSound = async (sound: AlarmSound) => {
    setSelectedSound(sound);
    await Preferences.set({
      key: ALARM_SETTINGS_KEY,
      value: sound,
    });
  };

  return { selectedSound, updateSound, isLoaded };
};
