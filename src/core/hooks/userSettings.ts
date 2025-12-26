import AsyncStorage from "@react-native-async-storage/async-storage";
import { type SettingsKeys } from "../types/settings.ts";

export const setUserData = async (key: SettingsKeys, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.log(e);
    }
};

export const getUserData = async (
    key: SettingsKeys,
    defaultValue?: string,
): Promise<string | undefined> => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ?? defaultValue;
    } catch (e) {
        console.log(e);
    }
};
