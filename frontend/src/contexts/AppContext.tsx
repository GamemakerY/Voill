import { createContext } from "react";

interface AppInterface{
    isRecording: boolean,
    message: string
}

export const AppContext = createContext<AppInterface | undefined>(undefined);


