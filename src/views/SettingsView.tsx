import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    BlurEvent,
    TextInputEndEditingEvent,
} from "react-native";
import { SettingsInput, SettingsKeys } from "../../types/settings";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../controls/Card";
import TextInput from "../controls/TextInput";
import { getUserData, setUserData } from "../../hooks/userSettings";
import { useEffect, useState } from "react";
import Button from "../controls/Button";
import { theme } from "../../themes/themes";
import { useServerStore } from "../store/serverStore";

export default function SettingsView() {
    const [defaultSettings, setDefaultSettings] = useState<Map<SettingsKeys, string>>(() => new Map());
    const [settings, setSettings] = useState<Map<SettingsKeys, string>>(() => new Map());
    
    const setHostname = useServerStore((s) => s.setHostname);

    const settingsInputs : Map<SettingsKeys, SettingsInput> = new Map([
        ["hostname", { key: "hostname", label: "Hostname", type: "text", default: process.env.EXPO_PUBLIC_API_HOST, process: (s: string) => {setHostname(s); return s} }],
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
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView>
                        <Card style={styles.settingsCard}>
                            {Array.from(defaultSettings.keys()).map((s) => {
                                const setting = settingsInputs.get(s);
                                return (
                                    <View key={s}>
                                        <TextInput
                                            style={styles.textInput}
                                            label={setting?.label}
                                            value={settings.get(s)}
                                            onChangeText={(text) =>
                                                setSettings(prev => {
                                                    const next = new Map(prev);
                                                    next.set(s, text);
                                                    return next;
                                                })
                                            }
                                        />
                                    </View>
                                );
                            })}

                            <View style={styles.buttonPanel}>
                                <Button style={styles.button} onPress={saveSettings}>
                                    <Text>Apply</Text>
                                </Button>
                                <Button onPress={resetSettings} style={[styles.button, {backgroundColor: theme.background}]}>
                                    <Text style={{color: theme.color}}>Cancel</Text>
                                </Button>
                            </View>
                        </Card>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    settingsCard: {
        marginLeft: 10,
        marginRight: 15,
        marginTop: 20,
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 30,
        paddingHorizontal: 10,
    },
    settingsLabel: {
        fontSize: 20,
        fontWeight: 600,
    },
    textInput: {
        marginVertical: 10,
    },
    buttonPanel: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    button: {
        marginRight: 0
    }
});
