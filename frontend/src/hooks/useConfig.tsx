import { useEffect, useState } from "react";
import { LazyStore } from '@tauri-apps/plugin-store';

const store = new LazyStore('config.json');
export function configHook(){
    
    const [theme, setTheme] = useState('') //get later
    const [GroqAPIKey, setGroqAPIKey] = useState('') //same

    //Probably add loading because of the default value thing... (Better add now than later, I guess)
    applyTheme(theme);

    async function InitStore(){
        if (!(await store.has("theme"))){
            await store.set("theme", "light");
        }
        if (!(await store.has("GroqAPIKey"))){
            await store.set("GroqAPIKey", "");
        }
        return {}
    }

    function applyTheme(selectedTheme:string){
        if(selectedTheme==="light"){
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add('light')
        }
        else if(selectedTheme==="dark"){
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add('dark')
        }
        else{
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add('light')
            //Later change this to automatically be the system theme
        }
    }
    useEffect(()=>{
        applyTheme(theme);
        }, 
    [theme]);

    useEffect(()=>{

    }, [GroqAPIKey])

    return {theme, setTheme, GroqAPIKey, setGroqAPIKey};
}