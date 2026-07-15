import { useEffect, useState } from "react";
import { LazyStore } from '@tauri-apps/plugin-store';
import { appDataDir } from "@tauri-apps/api/path";
import { Client, Stronghold } from '@tauri-apps/plugin-stronghold';


const store = new LazyStore('config.json');
export function useConfig(){

    //Proabably add loading because of the default value thing... (Better add now than later, I guess)

    const [theme, setTheme] = useState<string>("");
    const [GroqAPIKey, setGroqAPIKey] = useState<string>("");

    async function getRecord(store: any, key: string): Promise<string>{
        const data = await store.get(key);
        if (!data || data.length === 0) return "";
        console.log("Got record: ", new TextDecoder().decode(new Uint8Array(data)))
        return new TextDecoder().decode(new Uint8Array(data))
    }

    async function insertRecord(store: any, stronghold:any, key:string, value:string){
        const data = Array.from(new TextEncoder().encode(value));
        await store.insert(key, data)
        console.log("Inserted: ", data)
        await stronghold.save();
    }

    const initStronghold = async () => {
        const vaultPath = `${await appDataDir()}/vault.hold`
        const vaultPassword = 'vault password';
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
        }
        else{
            console.log("Applying initial theme...")
            const savedTheme = await store.get<string>("theme") || "light";
            applyTheme(savedTheme)
        }
        try{
            const store_stronghold = client.getStore();
            const key = 'my_key';
            const APIKey = await getRecord(store_stronghold, key)

            if(!(APIKey)){
                console.log("Set API as empty")
                await insertRecord(store_stronghold, stronghold, key, "");
            }else{
                setGroqAPIKey(APIKey)
            }

        } catch (error){
            setGroqAPIKey("")
        }
        {/*if (!(await store.has("GroqAPIKey"))){
            console.log("GroqAPIKey not found")
            await store.set("GroqAPIKey", "");
            setGroqAPIKey("")
        }
        else{
            const savedAPIKey = await store.get<string>("GroqAPIKey") || "";
            console.log("Initial GroqAPIKey: ", savedAPIKey)
            setGroqAPIKey(savedAPIKey)
        }*/}
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
            
            {/*await store.set('GroqAPIKey', GroqAPIKey);
            setGroqAPIKey(GroqAPIKey);
            console.log("GroqAPIKey set: ", GroqAPIKey)
            await store.save()*/}
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