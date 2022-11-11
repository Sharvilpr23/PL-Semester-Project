import { BrowserRouter } from "react-router-dom";
import AppLayout from "./App/AppLayout";

function App() {
  // Router will allow easily having different "pages" (but it's still a single page application!)
  return (
    <BrowserRouter>
      <AppLayout className="h-screen w-screen" />
    </BrowserRouter>
  );
}

export default App;
