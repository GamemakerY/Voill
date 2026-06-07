import { join, tempDir } from "@tauri-apps/api/path";
import { readFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";
import { checkPermission, requestPermission, startRecording, stopRecording } from "tauri-plugin-audio-recorder-api";
import { setEventTypes, startListening, text } from "tauri-plugin-user-input-api";


export function useAudioRecorder(){
    const [isRecording,setisRecording] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    //A variable for processing later, better error handling for message

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
            if(key_pressed.isSupersetOf(key_combo)){
                if(!is_recording){
                    //later add checks for permission
                    setisRecording(true);
                    is_recording = true;
                    console.log("File will be saved in: ", tempFolder)
                    
                    await startRecording({
                        outputPath: (filePath),
                        quality: "medium", 
                        maxDuration: 600, });
                    }
                }
                
            if(event.eventType=="KeyRelease"){
                if(key_pressed.has(event.key)){
                    key_pressed.delete(event.key)
                    
                    if(is_recording && !key_pressed.isSupersetOf(key_combo)){
                        
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
            };});
        async function getText(audio: Blob) {
            const url = 'http://localhost:8000/audios';
            try{
                const formData = new FormData();
                formData.append('file', audio, "output.wav")
                const response = await fetch(url, {
                    method: "POST",
                    body: formData
                });
        const responseText = await response.text();
        setMessage(responseText);

        await text(responseText);
    }
    catch(error){
    console.error(error.message);
}
}
    }
    setupRecorder();

}, []);
    return{isRecording, message};
}