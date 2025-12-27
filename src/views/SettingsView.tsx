import {useEffect, useState} from "react";
import type {SettingsInput, SettingsKeys} from "@/core/types/settings.ts";
import {useServerStore} from "@/core/store/serverStore.ts";
import {getUserData, setUserData} from "@/core/hooks/userSettings.ts";
import {Card, CardContent, CardFooter, CardHeader} from "@/ui/Card.tsx";
import {Input} from "@/ui/Input.tsx";
import {Button} from "@/ui/Button.tsx";

export default function SettingsView() {
    const [defaultSettings, setDefaultSettings] = useState<Map<SettingsKeys, string>>(() => new Map());
    const [settings, setSettings] = useState<Map<SettingsKeys, string>>(() => new Map());
    
    const setHostname = useServerStore((s) => s.setHostname);

    const settingsInputs : Map<SettingsKeys, SettingsInput> = new Map([
        ["hostname", { key: "hostname", label: "Hostname", type: "text", default: import.meta.env.VITE_API_HOST, process: (s: string) => {setHostname(s); return s} }],
    ]);

    const saveSettings = () => {
        for (const key of settingsInputs.keys()) {
            const k = key as SettingsKeys;

            if (!k)
                continue;

            const definition = settingsInputs.get(k);
            const defaultValue = defaultSettings.get(k);
            const value = settings.get(k) ?? defaultValue;

            if (definition && defaultValue && value){
                const processedValue = definition?.process ? definition.process(value) : value;
                setUserData(k, processedValue);
            }
        }

        setDefaultSettings(settings);
    }

    const resetSettings = () => {
        setSettings(defaultSettings);
        setDefaultSettings(new Map(defaultSettings));
    }

    const loadSettings = async () => {
        const result: Map<SettingsKeys, string> = new Map();

        for (const s of settingsInputs.keys()) {
            const defaultValue = await loadSetting(s, settingsInputs.get(s)?.default);
            result.set(s, defaultValue ?? "");
        }

        setDefaultSettings(result);
        setSettings(result);
    }

    const loadSetting = async (key: SettingsKeys, defaultValue?: string): Promise<string | undefined> => {
        return await getUserData(key) ?? defaultValue;
    }


    useEffect(() => {
        loadSettings();
    }, []);

    return (
        <>
            <div className="flex flex-col gap-1 w-full">
                <Card>
                    <CardHeader>
                        Server Settings
                    </CardHeader>
                    <CardContent>
                        {Array.from(defaultSettings.keys()).map((s) => {
                            return (
                                <div key={s}>
                                    <Input value={settings.get(s)}
                                           onChange={(e) =>
                                               setSettings(prev => {
                                                   const next = new Map(prev);
                                                   next.set(s, e.target.textContent);
                                                   return next;
                                               })
                                           }
                                    />
                                </div>
                            );
                        })}
                    </CardContent>
                    <CardFooter>
                        <div className="flex flex-row gap-2">
                            <Button variant="default" onClick={saveSettings}>
                                Apply
                            </Button>
                            <Button variant="secondary" onClick={resetSettings}>
                                Cancel
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}