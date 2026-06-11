import { TopBar } from "./components/layout/TopBar";
import { MainWindow } from "./components/layout/MainWindow";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { AppContext } from "./contexts/AppContext";
import { useContext } from "react";
import { Settings } from "./pages/Settings";

function App() {
  const {isRecording, message, view, setView} = useAudioRecorder();
  const context = useContext(AppContext);

  return (
    <AppContext.Provider value={
      {isRecording,
        message,
        view,
      setView}
      }>
    <div className="min-h-screen flex flex-col w-full bg-[#0f1115] text-slate-100">
        <TopBar/>
        {view === 'Settings' ? <Settings/>: <MainWindow/>}
    </div>
    </AppContext.Provider>
  );
}
export default App;

{
  /*
  BUGS:
  1. AI takes the text as actual prompt
  2. Keyboard doesn't type properly */
}
