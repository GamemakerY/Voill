import { join, tempDir } from "@tauri-apps/api/path";
import { readFile } from "@tauri-apps/plugin-fs";
import { useEffect, useRef, useState } from "react";
import { checkPermission, requestPermission, startRecording, stopRecording } from "tauri-plugin-audio-recorder-api";
import { key, setEventTypes, startListening, text } from "tauri-plugin-user-input-api";
// Note: uninstall this, '@tauri-apps/plugin-clipboard-manager';



export function useAudioRecorder(GroqAPIKey: string){
    const [isRecording,setisRecording] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [view, setView] = useState<string>("App")
    const keyRef = useRef(GroqAPIKey)

    //A variable for processing later, better error handling for message

    useEffect(() => {
        keyRef.current = GroqAPIKey;

    }, [GroqAPIKey]);

    useEffect(()=>{
        let is_recording = false;

        async function setupRecorder(){
            await setEventTypes(["KeyPress", "KeyRelease"] as any);
            const key_combo = new Set(["AltLeft", "KeyR"]);
            const key_pressed = new Set();
            const tempFolder = await tempDir()
            const filePath = await join(tempFolder, "output")
            const fileSavePath = await join(tempFolder, "output.wav")
            const permission = await checkPermission();
            
            if (!permission.granted) {
                const result = await requestPermission();
                if (!result.granted) {
                    console.error("Microphone permission denied");
                }
            }
            
            await startListening(async (event) => {
                if(event.eventType=="KeyPress"){
                    
                    if(!event.key) return;
                    
                    if(key_combo.has(event.key)){
                        key_pressed.add(event.key)
                    }
                }
            if(key_pressed.has("AltLeft") && key_pressed.has("KeyR")){
                if(!is_recording){
                    //later add checks for permission
                    setisRecording(true);
                    is_recording = true;
                    
                    await startRecording({
                        outputPath: (filePath),
                        quality: "medium", 
                        maxDuration: 600, });
                    }
                }
                
            if(event.eventType=="KeyRelease"){
                if(key_pressed.has(event.key)){
                    key_pressed.delete(event.key)
                    
                    if(is_recording && (!key_pressed.has("AltLeft") || !key_pressed.has("KeyR"))){
                        
                        const result = await stopRecording();
                        console.log(`Recorded ${result.durationMs}ms to ${result.filePath}`);
                        console.log(`File size: ${result.fileSize} bytes`);
                        console.log(`Sample rate: ${result.sampleRate}Hz, Channels: ${result.channels}`);
                        
                        const audio_data = await readFile(fileSavePath)
                        const audioBlob = new Blob([audio_data], { type: 'audio/wav' }); 
                        setisRecording(false);
                        is_recording = false;
                        getText(audioBlob)//Or mp3? All optimizations later
                    }
                }
            };
        });
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        async function text_w_delay(response_text:string, delay:number=15){
            for (const char of response_text) {
                await text(char); 
                await sleep(delay); 
            }
        }
        async function multiline_text(response_text:string){
            const lines = response_text.split('\n');

            for(let i=0; i < lines.length-1; i++){
                await text(lines[i])
                await key("KeyPress", "ShiftLeft");
                await key("KeyClick", "Enter");
                await key("KeyRelease", "ShiftLeft");
            }
            if(lines.length>0){
                await text(lines[lines.length-1])
            }

        }

        async function getText(audio: Blob) {
            const url = 'http://localhost:8000/audios';
            try{
                const formData = new FormData();
                formData.append('file', audio, "output.wav")
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        'APIKey': keyRef.current
                    },
                    body: formData
                });
        const responseText = await response.text();
        setMessage(responseText);
        //await text_w_delay(responseText);
        await multiline_text(responseText);
        //text(responseText);
    }
    catch(error){
    console.error(error.message);
}
}
    }
    setupRecorder();

}, []);
    return{isRecording, message, view, setView};
}