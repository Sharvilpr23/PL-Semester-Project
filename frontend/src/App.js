import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import AppLayout from "./App/AppLayout";
import ConnectionProvider from "./App/AppContext";

function App() {
  // Router will allow easily having different "pages" (but it's still a single page application!)
  return (
    <BrowserRouter>
      <ConnectionProvider>
        <QueryClientProvider client={new QueryClient()}>
          <AppLayout />
        </QueryClientProvider>
      </ConnectionProvider>
    </BrowserRouter>
  );
}

export default App;
