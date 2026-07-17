import { useEffect, useState } from "react";
import { LazyStore } from '@tauri-apps/plugin-store';
import { appDataDir } from "@tauri-apps/api/path";
import { Client, Stronghold } from '@tauri-apps/plugin-stronghold';

//Important: Add an option to set randomized key password once for user, let it be for now

const store = new LazyStore('config.json');
export function useConfig(){

    //Proabably add loading because of the default value thing... (Better add now than later, I guess)

    const [theme, setTheme] = useState<string>("");
    const [GroqAPIKey, setGroqAPIKey] = useState<string>("");

    async function getRecord(store: any, key: string): Promise<string>{
        try{
            const data = await store.get(key);
            if (!data || !Array.isArray(data) || data.length === 0) return "";
            return new TextDecoder().decode(new Uint8Array(data));

        } catch(error){
            return "";
        }
    }

    async function insertRecord(store: any, stronghold:any, key:string, value:string){
        const data = Array.from(new TextEncoder().encode(value));
        await store.insert(key, data)
        await stronghold.save();
    }

    const initStronghold = async () => {
        const vaultPath = `${await appDataDir()}/vault.hold`
        const vaultPassword = 'vault password'; //p1
        const stronghold = await Stronghold.load(vaultPath, vaultPassword);

        let client: Client;
        const clientName = 'name your client';
        try{
            client = await stronghold.loadClient(clientName);
        } catch{
            client = await stronghold.createClient(clientName);
        }

        return{
            stronghold,
            client
        }
    }

    async function InitStore(){
        const { stronghold, client } = await initStronghold();

        if (!(await store.has("theme"))){
            console.log("Theme not found")
            await store.set("theme", "light");
            setTheme("light")
            await store.save()
        }
        else{
            console.log("Applying initial theme...")
            const savedTheme = await store.get<string>("theme") || "light";
            setTheme(savedTheme)
            applyTheme(savedTheme)
        }

        try{
            const store_stronghold = client.getStore();
            const key = 'my_key'; //p2
            const APIKey = await getRecord(store_stronghold, key)

            if(APIKey===null || APIKey===undefined){
                console.log("Set API as empty")
                await insertRecord(store_stronghold, stronghold, key, "");
                setGroqAPIKey("")
            }else{
                setGroqAPIKey(APIKey)
            }

        } catch (error){
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
            setTheme(theme)
            console.log("Theme set: ", theme)
            await store.save()
        }
        if(typeof GroqAPIKey === 'string'){
              const { stronghold, client } = await initStronghold();
              const store_stronghold = client.getStore();
              const key = 'my_key';

              await insertRecord(store_stronghold, stronghold, key, GroqAPIKey)
              setGroqAPIKey(GroqAPIKey)
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
        await writeConfig(newTheme, undefined);
    };

    const updateGroqAPIKey = async (newKey: string) => {
        await writeConfig(undefined, newKey);
    };

    return { 
        theme, 
        setTheme: updateTheme, 
        GroqAPIKey, 
        setGroqAPIKey: updateGroqAPIKey 
    };

}