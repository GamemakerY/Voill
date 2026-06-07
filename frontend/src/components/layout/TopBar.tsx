import { Button } from "../ui/button";
import { Settings, X} from "lucide-react"
import { getCurrentWindow } from '@tauri-apps/api/window';

const appWindow = getCurrentWindow();

function NavBar(){
    return(
      <div data-tauri-drag-region className="flex flex-row h-10 items-center justify-between bg-card text-card-foreground select-none px-4 border-b  border-slate-800/60 ">
        <span className="text-xl font-bold items-center tracking-tight">Voill</span>

        <div>
        <Button className="h-9 w-9 hover:bg-accent"  variant="ghost">
          <Settings className="size-6" />
        </Button>
        <Button className="h-9 w-9 hover:bg-accent" variant="ghost" onClick={() => appWindow.close()}>
          <X className="size-6" />
        </Button>
        </div>

      </div>
    )
}

export {NavBar};