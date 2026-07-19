import { Separator } from "@base-ui/react";

interface SettingCardProps{
    title: string;
    description: string;
    learnMore?: string;
    layout: string;
    children?: React.ReactNode;
}

export function SettingCard({title, description, layout, children}:SettingCardProps){
  return(
      <div>
        {layout === 'h' ? 
        (<div className="flex w-full justify-between">
          <div className="space-y-1">
          <div className="leading-none font-medium">{title}</div>
            <div className="text-muted-foreground font-light">{description}</div>
          </div>
          <div>
            {children}
          </div>
        </div>) : (
        <div className="flex w-full justify-between flex-col">
          <div className="space-y-1">
          <div className="leading-none font-medium">{title}</div>
            <div className="text-muted-foreground font-light">{description}</div>
          </div>
          <div>
            {children}
          </div>
        </div>)      
}
<Separator className="w-full h-px bg-current opacity-15 my-4 shrink-0"/>
</div>
  )
}