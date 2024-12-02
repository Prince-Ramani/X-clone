import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import UserContextProvider from "./context/userContext";
import CreatePostContextProvider from "./context/createPostContext";
import ReplyDialogContextProvider from "./context/ReplyPostContext";
import EditProfileContextProvider from "./context/EditProfileContext";
import UnfollowContextProvider from "./context/UnfollowContext";

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
          <EditProfileContextProvider>
            <UnfollowContextProvider>
              <ReplyDialogContextProvider>
                <CreatePostContextProvider>
                  <App />
                </CreatePostContextProvider>
              </ReplyDialogContextProvider>
            </UnfollowContextProvider>
          </EditProfileContextProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </>
  );
}
