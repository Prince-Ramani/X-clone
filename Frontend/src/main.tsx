import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import UserContextProvider from "./context/userContext";
import CreatePostContextProvider from "./context/createPostContext";
import ReplyDialogContextProvider from "./context/ReplyPostContext";
import DeletePostContextProvider from "./context/DeletePostContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById("root") as HTMLElement;

if (rootElement) {
  createRoot(rootElement).render(
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <ReplyDialogContextProvider>
            <CreatePostContextProvider>
              <DeletePostContextProvider>
                <App />
              </DeletePostContextProvider>
            </CreatePostContextProvider>
          </ReplyDialogContextProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </>
  );
}
