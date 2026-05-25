import "./index.css";
import { Button } from "./components/ui/button";
import { Settings } from "lucide-react"
//Add dragging
//bg-muted for center text?
function App() {
  return (
    <main className="min-h-screen flex flex-col w-full">
      <div className="flex flex-row justify-between bg-card text-card-foreground">
        <Button>Button 1</Button>
        <Button size="icon-lg"  variant="ghost">
          <Settings className="size-8"/>
        </Button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center bg-background">
      <Button variant="default" onClick={()=> {console.log("Button pressed")}}>
        Click
      </Button>
      </div>
    </main>
  );
}
//Comments in TSX (Typescript)
export default App;
