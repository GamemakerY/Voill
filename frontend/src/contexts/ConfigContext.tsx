import { createContext, useContext } from "react";

interface ConfigInterface{
    theme: string,
    setTheme: (theme: string) => void,
    GroqAPIKey: string | '',
    setGroqAPIKey: (GroqAPIKey: string) => void;
}

export const ConfigContext = createContext<ConfigInterface | undefined>(undefined);

export function useConfig() {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig must be used within a useConfig.Provider");
    }
    return context;
}


