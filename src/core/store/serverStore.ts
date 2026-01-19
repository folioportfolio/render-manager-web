import { create } from "zustand";

type ServerState = {
    hostname: string;
    setHostname: (v: string) => void;
};

export const useServerStore = create<ServerState>((set) => ({
    hostname: "",
    setHostname: (hostname) => {
        console.log(`Setting: ${hostname}`);
        set({ hostname })
    },
}));
