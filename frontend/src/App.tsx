import "./index.css";
import { Button } from "./components/ui/button";
import { Settings } from "lucide-react"
import { setEventTypes, startListening } from "tauri-plugin-user-input-api";
import {startRecording, stopRecording, checkPermission, requestPermission} from "tauri-plugin-audio-recorder-api";
import {tempDir, join} from '@tauri-apps/api/path';

//When working prototype is done, make sure to make this all modular!!
await setEventTypes(["KeyPress", "KeyRelease"] as any);

const key_combo = new Set(["AltLeft", "KeyR"]);
const key_pressed = new Set();
let is_recording = false;

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
      is_recording=true;
      const tempFolder = await tempDir()
      const filePath = await join(tempFolder, "output")
      const fileSavePath = await join(tempFolder, "output.wav")
      console.log("File saved in: ", tempFolder)
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
        is_recording=false;
    }

    }
  };
});



//Add dragging
//bg-muted for center text?
function App() {
  return (
    <main className="min-h-screen flex flex-col w-full bg-[#0f1115] text-slate-100">
      <div data-tauri-drag-region className="flex flex-row h-10 items-center justify-between bg-card text-card-foreground select-none px-4 bg-[#161920] border-b border-slate-800/60 shadow-sm">
        <span className="text-xl font-bold items-center tracking-tight">Voill</span>
        <Button className="h-9 w-9 hover:bg-accent"  variant="ghost">
          <Settings className="size-6" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center bg-background px-4">
        <h1 className="text-xl text-muted-foreground text-center select-none">When you are ready, hold Alt + R to start!</h1>
      </div>
    </main>
  );
}
//Comments in TSX (Typescript)
export default App;
