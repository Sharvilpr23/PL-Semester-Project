import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import AppLayout from "./App/AppLayout";

function App() {
  // Router will allow easily having different "pages" (but it's still a single page application!)
  return (
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
        <AppLayout className="h-screen w-screen" />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
