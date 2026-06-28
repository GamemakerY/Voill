import { TopBar } from "./components/layout/TopBar";
import { MainWindow } from "./components/layout/MainWindow";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { AppContext } from "./contexts/AppContext";
import { Settings } from "./pages/Settings";
import { ConfigContext } from "./contexts/ConfigContext";
import { useConfig } from "./hooks/useConfig";

function App() {
  const { isRecording, message, view, setView} = useAudioRecorder();
  const {theme, setTheme, GroqAPIKey, setGroqAPIKey} = useConfig();
  return (
    <ConfigContext.Provider value = {
      {theme, setTheme, GroqAPIKey, setGroqAPIKey}
      }>
    <AppContext.Provider value={
      {isRecording, message, view, setView}
      }>
    <div className="min-h-screen flex flex-col w-full bg-[#0f1115] text-slate-100">
        <TopBar/>
        {view === 'Settings' ? <Settings/>: <MainWindow/>}
    </div>
    </AppContext.Provider>
    </ConfigContext.Provider>
  );
}
export default App;

{
  /*
  BUGS:
  1. AI takes the text as actual prompt (Basically fixed)
  2. Keyboard doesn't type properly (Fixed)
  3. For spaces, it just presses enter (Meaning it sends it in a prompt box), really wish a clipboard feature could be ipmlemented without removing user's clipboard or some alternative (Fixed)
  4. Limitation with Notepad - Doesn't type properly  

  BASIC FEATURES (Before Alpha):
  1. Add working system theme option

  FEATURES (For alpha version)
  1. App minizes to system tray and works with a small icon in that form
  2. 
  */
}
