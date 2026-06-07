import { NavBar } from "./components/layout/TopBar";
import { MainWindow } from "./components/layout/MainWindow";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { AppContext } from "./contexts/AppContext";


//When working prototype is done, make sure to make this all modular!!
{/*await setEventTypes(["KeyPress", "KeyRelease"] as any);

const key_combo = new Set(["AltLeft", "KeyR"]);
const key_pressed = new Set();
let is_recording = false;

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
      is_recording=true;

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
        getText(audioBlob)//Or mp3? All optimizations later
        is_recording=false;
    }

    }
  };
});

//http://127.0.0.1:8000

async function getText(audio: Blob) {
  const url = 'http://localhost:8000/audios';
  try{
    const formData = new FormData();
    formData.append('file', audio, "output.wav")
    const response = await fetch(url, {
      method: "POST",
      body: formData
    });
    const message = await response.text();
    await text(message);
  }
  catch(error){
    console.error(error.message);
  }
}
*/}

//bg-muted for center text?
function App() {
  const {isRecording, message} = useAudioRecorder();
  return (
    <AppContext.Provider value={{isRecording,message}}>
    <div className="min-h-screen flex flex-col w-full bg-[#0f1115] text-slate-100">
        <NavBar/>
        <MainWindow/>
    </div>
    </AppContext.Provider>
  );
}
//Comments in TSX (Typescript)
export default App;
