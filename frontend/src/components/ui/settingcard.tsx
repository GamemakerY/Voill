import { Separator } from "@base-ui/react";

interface SettingCardProps{
    title: string;
    description: string;
    children: React.ReactNode;
}

export function SettingCard({title, description, children}:SettingCardProps){

    return(
<div>
        <div className="flex w-full justify-between">
          <div>
          <div className="leading-none font-medium">{title}</div>
            <div className="text-muted-foreground">{description}</div>
          </div>
          <div>
            {children}
          </div>
        </div>
        <Separator className="w-full h-px bg-current opacity-15 my-4 shrink-0 "/>
</div>
)
}