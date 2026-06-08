import { createContext } from "react";

interface AppInterface{
    isRecording: boolean,
    message: string,
    view: string
}

export const AppContext = createContext<AppInterface | undefined>({
    isRecording: false,
    message: '',
    view: 'App'
});


