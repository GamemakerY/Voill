import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { SettingCard } from "@/components/ui/settingcard";
import { AppContext } from "@/contexts/AppContext";
import { useContext } from "react";


export function Settings(){
  const context = useContext(AppContext);
  return(
        <div className='flex-1 flex flex-col bg-background text-card-foreground px-4 py-4 w-full h-screen max-h-screen overflow-hidden'>
          <SettingCard title="Theme" description="Choose how Voill appears on your device." children={
            <ButtonGroup className="flex border-2 border-border rounded-full overflow-hidden shadow-[4px_4px_0px_var(--border)] bg-card">
              <Button onClick={()=>{
                document.documentElement.classList.remove('light', 'dark')
                document.documentElement.classList.add('light')

              }}>Light</Button>
              <Button onClick={()=>{
                document.documentElement.classList.remove('light', 'dark')
                document.documentElement.classList.add('dark')
              }}>Dark</Button>
              
            </ButtonGroup>
          }/>
        </div>
    )
}



//<Switch className="border-2 border-border box-content p-0.5 shadow-[4px_4px_0px_var(--border)]"/>