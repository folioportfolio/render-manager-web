export interface Theme {
    accent: string;
    accentDark: string;
    accentLight: string;
    accentSecondary: string;
    background: string;
    backgroundE1: string;
    backgroundE2: string;
    backgroundE3: string;
    backgroundE4: string;
    borderColor: string;
    color: string;
    shadow: string;
    done: string;
    canceled: string;
    inProgress: string;
}

export const theme: Theme = {
    accent: "#85DAFF",
    accentDark: "#67D2FF",
    accentLight: "#A2E3FF",

    accentSecondary: "#FFC972",

    background: "#171a21ff",
    backgroundE1: "#242934",
    backgroundE2: "#323847",
    backgroundE3: "#3F475A",
    backgroundE4: "#4C566E",

    borderColor: "#617073ff",

    color: "#eff7ffff",
    shadow: "#232731ff",
    done: "#00FF75",
    canceled: "#FF5E5E",
    inProgress: "#39DBFF",
};
