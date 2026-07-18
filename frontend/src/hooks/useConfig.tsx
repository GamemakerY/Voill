import { useEffect, useState } from "react";
import { LazyStore } from '@tauri-apps/plugin-store';
import { appDataDir } from "@tauri-apps/api/path";
import { Client, Stronghold } from '@tauri-apps/plugin-stronghold';

//Important: Add an option to set randomized key password once for user, let it be for now

const store = new LazyStore('config.json');
let hasInitialized = false;

let strongholdInstance: { stronghold: Stronghold; client: Client } | null = null;
let strongholdLoading: Promise<{ stronghold: Stronghold; client: Client }> | null = null;

async function getStronghold() {
    if (strongholdInstance) return strongholdInstance;
    if (strongholdLoading) return strongholdLoading; 

    strongholdLoading = (async () => {
        const vaultPath = `${await appDataDir()}/vault.hold`;
        const vaultPassword = 'vault password'; //p1

        const stronghold = await Stronghold.load(vaultPath, vaultPassword);

        let client: Client;
        const clientName = 'name your client';
        try {
            client = await stronghold.loadClient(clientName);
        } catch {
            client = await stronghold.createClient(clientName);
        }

        strongholdInstance = { stronghold, client };
        return strongholdInstance;
    })();

    try {
        return await strongholdLoading;
    } finally {
        strongholdLoading = null;
    }
}

export function useConfig(){

    //Proabably add loading because of the default value thing... (Better add now than later, I guess)

    const [theme, setTheme] = useState<string>("");
    const [GroqAPIKey, setGroqAPIKey] = useState<string>("");

    async function getRecord(store: any, key: string): Promise<string | null>{
        try{
            const data = await store.get(key);

            if (data === null || data === undefined) {
                console.log("No record found for key:", key);
                return null; 
            }

            const bytes = data instanceof Uint8Array ? data : new Uint8Array(data as any);

            if (bytes.length === 0) return "";

            console.log("Got record")
            return new TextDecoder().decode(bytes);

        } catch(error){
            console.log("Error reading record:", error)
            return null; 
        }
    }

    async function insertRecord(store: any, stronghold:any, key:string, value:string){
        const data = Array.from(new TextEncoder().encode(value));
        console.log("Data inserted: ", data)
        await store.insert(key, data)
        await stronghold.save();
    }

    async function InitStore(){
        const { stronghold, client } = await getStronghold();

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

            const hasSetKeyBefore = await store.get<boolean>("hasSetApiKeyBefore");

            const APIKey = await getRecord(store_stronghold, key)

            if (APIKey === null) {
                if (!hasSetKeyBefore) {
                    console.log("First run - initializing API key as empty")
                    await insertRecord(store_stronghold, stronghold, key, "");
                    setGroqAPIKey("")
                } else {
                    console.log("Warning: a key was set before but could not be read this launch. Leaving stored value untouched.")
                    setGroqAPIKey("")
                }
            } else {
                setGroqAPIKey(APIKey)
            }

        } catch (error){
            setGroqAPIKey("")
            console.log("Error, API key resetted")
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
              const { stronghold, client } = await getStronghold();
              const store_stronghold = client.getStore();
              const key = 'my_key';

              await insertRecord(store_stronghold, stronghold, key, GroqAPIKey)

              // Mark that a key has been intentionally set at least once,
              // so a future failed read never gets misread as "first run".
              await store.set("hasSetApiKeyBefore", true);
              await store.save();

              setGroqAPIKey(GroqAPIKey)
        }

    }

    useEffect(()=>{
        //React stric mode proof basically
        if (hasInitialized) return;
        hasInitialized = true;
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