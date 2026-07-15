import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { SettingCard } from "@/components/ui/settingcard";
import { validateAPIKey } from "@/components/utils/auth";
import { useConfig } from "@/contexts/ConfigContext";
import { Form } from "@base-ui/react";
import { useState } from "react";

export function Settings(){

  const { setTheme, setGroqAPIKey} = useConfig();
  const [ inputKey, setInputKey] = useState<string>('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();

    const isValidated = validateAPIKey(inputKey)

    if(isValidated){
      setGroqAPIKey(inputKey)
    }
    else {
      alert("Invalid API Key")
    }

  }

  return(
        <div className='flex-1 flex flex-col bg-background text-card-foreground px-4 py-4 w-full h-screen max-h-screen overflow-hidden'>
          <SettingCard title="Theme" description="Choose how Voill appears on your device." layout = 'h' children={
            <ButtonGroup className="flex border-2 border-border rounded-full overflow-hidden shadow-[4px_4px_0px_var(--border)] bg-card">
              <Button onClick={()=>{
                setTheme("light")
              }}>Light</Button>
              <Button onClick={()=>{
                setTheme('dark')
              }}>Dark</Button>
            </ButtonGroup>
          }/>

    <SettingCard title="Groq API Key" layout = 'v' description="Enter your API key to power Voill's AI features. It is stored locally."
        children={
    <div className="relative flex items-center w-full max-w-3xl mt-2 group"> 
      <Form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-row items-center justify-between rounded-full border border-black dark:border-slate-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] bg-transparent overflow-hidden h-10 pr-1.5">
          <Input 
            name="GroqAPIKey" 
            onChange={(e)=> setInputKey(e.target.value)} 
            type="password" 
            placeholder="gsk_..." 
            className="flex-1 pl-4 border-0 bg-transparent text-foreground text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="flex items-center">
            <Button 
              type="submit" 
              size="sm" 
              className="rounded-full border border-black dark:border-slate-800 bg-primary text-primary-foreground font-medium px-4 text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-none transition-all">
              Save
            </Button>
          </div>
        </div>
      </Form >
    </div>
          }/>

  </div>
    )
}



//<Switch className="border-2 border-border box-content p-0.5 shadow-[4px_4px_0px_var(--border)]"/>