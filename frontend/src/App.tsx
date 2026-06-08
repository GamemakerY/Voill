import { TopBar } from "./components/layout/TopBar";
import { MainWindow } from "./components/layout/MainWindow";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { AppContext } from "./contexts/AppContext";

function App() {
  const {isRecording, message} = useAudioRecorder();

  return (
    <AppContext.Provider value={{isRecording,message}}>
    <div className="min-h-screen flex flex-col w-full bg-[#0f1115] text-slate-100">
        <TopBar/>
        <MainWindow/>
    </div>
    </AppContext.Provider>
  );
}
export default App;
