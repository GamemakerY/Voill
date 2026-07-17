import { TopBar } from "./components/layout/TopBar";
import { MainWindow } from "./components/layout/MainWindow";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { AppContext } from "./contexts/AppContext";
import { Settings } from "./pages/Settings";
import { ConfigContext } from "./contexts/ConfigContext";
import { useConfig } from "./hooks/useConfig";

function App() {
  const {theme, setTheme, GroqAPIKey, setGroqAPIKey} = useConfig();
  const { isRecording, message, view, setView} = useAudioRecorder(GroqAPIKey);
  return (
    <ConfigContext.Provider value = {
      {theme, setTheme, GroqAPIKey, setGroqAPIKey}
      }>
    <AppContext.Provider value={
      {isRecording, message, view, setView}
      }>
    <div className="h-screen flex flex-col w-full bg-[#0f1115]text-slate-100 overflow-hidden">
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
  5. Combination doesn't work when app is focused (Fixed previously but showing up again) - Seems to be Windows-specific, working fine in Linux
  6. Bug in first time API key set (Only on first time ever): It saves but doesn't load when you try it then and there

  BASIC FEATURES (Before Alpha):
  1. Add working system theme option

  FEATURES (For alpha version)
  1. App minizes to system tray and works with a small icon in that form
  2. 
  */
}
