import { Button } from "../ui/button";
import { ArrowLeft, Settings as SettingsIcon, X} from "lucide-react"
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useContext } from "react";
import { AppContext } from "@/contexts/AppContext";


export function TopBar(){
  const context = useContext(AppContext)
  const appWindow = getCurrentWindow();

  return(
      <div data-tauri-drag-region className="flex flex-row h-10 items-center justify-between bg-card text-card-foreground select-none px-4 border-b  border-slate-800/60 ">
        
        {context?.view === "Settings" ?
          <Button className="h-9 w-9 hover:bg-accent"  variant="ghost" onClick={()=>{
          context?.setView("App")
        }}>
          <ArrowLeft className="size-6"></ArrowLeft>
        </Button> :
        <span className="text-xl font-bold items-center tracking-tight pointer-events-none">Voill</span>
        }
        {
          context?.view === 'Settings' && 
          <span className="text-xl font-bold items-center tracking-tight pointer-events-none">Settings</span>
        }
        <div>
        <Button className="h-9 w-9 hover:bg-accent"  variant="ghost" onClick={()=>{
          context?.setView("Settings")
        }}>
          <SettingsIcon className="size-6" />
        </Button>
        <Button className="h-9 w-9 hover:bg-accent" variant="ghost" onClick={() => appWindow.close()}>
          <X className="size-6" />
        </Button>
        </div>
      </div>
    )
}


