import { useEffect, useState } from "react";
import { LazyStore } from '@tauri-apps/plugin-store';

const store = new LazyStore('config.json');
export function useConfig(){
    

    const [theme, setTheme] = useState<string>("");
    const [GroqAPIKey, setGroqAPIKey] = useState<string>("");

    //Probably add loading because of the default value thing... (Better add now than later, I guess)

    async function InitStore(){
        if (!(await store.has("theme"))){
            console.log("Theme not found")
            await store.set("theme", "light");
            setTheme("light")
        }
        else{
            console.log("Applying initial theme...")
            const savedTheme = await store.get<string>("theme") || "light";
            applyTheme(savedTheme)
        }
        if (!(await store.has("GroqAPIKey"))){
            console.log("GroqAPIKey not found")
            await store.set("GroqAPIKey", "");
            setGroqAPIKey("")
        }
    }

    function applyTheme(selectedTheme:string){
        if(selectedTheme==="light"){
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add('light')
            console.log("Set theme to light")
        }
        else if(selectedTheme==="dark"){
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add('dark')
            console.log("Set theme to dark")
        }
        else{
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add('light')
            console.log("No theme found, set to light")
            //Later change this to automatically be the system theme
        }
    }

    async function writeConfig(theme?:string, GroqAPIKey?:string){
        if(typeof theme === 'string'){
            await store.set('theme', theme);
            console.log("Theme set: ", theme)
            await store.save()
        }
        if(typeof GroqAPIKey === 'string'){
            await store.set('GroqAPIKey', GroqAPIKey);
            console.log("GroqAPIKey set")
            await store.save()
        }

    }

    useEffect(()=>{
        InitStore()
    }, [])

    useEffect(()=>{
        if (theme) {
        applyTheme(theme);
        }}, 
    [theme]);

    const updateTheme = async (newTheme: string) => {
        setTheme(newTheme);
        await writeConfig(newTheme, undefined);
    };

    const updateGroqAPIKey = async (newKey: string) => {
        setGroqAPIKey(newKey);
        await writeConfig(undefined, newKey);
    };

    return { 
        theme, 
        setTheme: updateTheme, 
        GroqAPIKey, 
        setGroqAPIKey: updateGroqAPIKey 
    };

}