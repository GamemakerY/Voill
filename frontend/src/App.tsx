import "./index.css";
import { Button } from "./components/ui/button";
import { Settings } from "lucide-react"
import { setEventTypes, startListening } from "tauri-plugin-user-input-api";

await setEventTypes(["KeyPress", "KeyRelease"] as any);

const key_combo = new Set(["AltLeft", "KeyR"]);
const key_pressed = new Set();
let is_recording = false;

await startListening((event) => {
  if(event.eventType=="KeyPress"){
    if(!event.key) return;

    if(key_combo.has(event.key)){
      key_pressed.add(event.key)
    }

    if(key_pressed.isSupersetOf(key_combo)){
      if(!is_recording){
        is_recording=true;
        record_audio(is_recording);
      }
      
    }

  };

  if(event.eventType=="KeyRelease"){
    if(key_pressed.has(event.key)){
      key_pressed.delete(event.key)
      if(is_recording){
        is_recording=false;
      }

    }
  };
});

function record_audio(is_recording:boolean){
  while(is_recording){
    console.log("Pretend Audio is recording...")
  }

  //Save Recording 
  //Send Recording to backend

}



//Add dragging
//bg-muted for center text?
function App() {
  return (
    <main className="min-h-screen flex flex-col w-full">
      <div data-tauri-drag-region className="flex flex-row h-14 justify-between bg-card text-card-foreground select-none px-4">
        <span className="text-lg font-bold flex-col items-center leading-none">Voill</span>
        <Button size="icon-lg" className="-mr-2 flex-col items-center"  variant="ghost">
          <Settings className="size-8"/>
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
