import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProfileContextProvider } from "./context/ProfileContex.jsx";
import { AuthUserContextProvider } from "./context/AuthUserContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <>
    <Toaster />
    <AuthUserContextProvider>
      <ProfileContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ProfileContextProvider>
    </AuthUserContextProvider>
  </>
);
