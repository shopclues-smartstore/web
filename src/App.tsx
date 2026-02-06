import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">SmartStore</h1>
      <p className="text-muted-foreground">React + Vite + shadcn/ui</p>
      <Button asChild>
        <Link to="/signup">Get started</Link>
      </Button>
    </div>
  );
}

export default App;
