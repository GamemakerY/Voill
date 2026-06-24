import { createContext, useContext } from "react";

interface AppInterface{
    isRecording: boolean,
    message: string,
    view: string,
    setView: (view: string) => void,
}

export const AppContext = createContext<AppInterface | undefined>(undefined);

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppContext.Provider");
    }
    return context;
}


