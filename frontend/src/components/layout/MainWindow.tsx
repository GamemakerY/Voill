import { Textarea } from "../ui/textarea"
import { useApp } from "@/contexts/AppContext"

function MainWindow(){

    const { message, isRecording } = useApp();

    return(
        <div className={`flex-1 flex flex-col bg-background justify-between items-center px-4 py-4 w-full h-screen max-h-screen overflow-hidden
        ${isRecording? 'ring-accent ring-4' : ''}`}> 
        <h1 className="text-xl text-muted-foreground text-center select-none">
            {isRecording? "Recording In Progress..." : "Let's test your setup. Hold Alt + R, speak, then release!"}
        </h1>
        <Textarea value={message} placeholder="Last captured text will show here as a preview..." className={`border text-foreground transition-all duration-200 
            ${isRecording? 'border-accent ring-2 ring-accent shadow-[3px_4px_0px_0px_var(--accent)]' : 'border-black dark:border-slate-800 shadow-[3px_4px_0px_0px_var(--border)]'}`}
            />
        </div>
    )
}

export{MainWindow}