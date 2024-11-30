import { createContext, useContext, useState } from "react";

type ReplyDialogContextType = {
  isReplyDialogOpen: boolean;
  setIsReplyDialog: React.Dispatch<React.SetStateAction<boolean>>;
  postContent: any;
  setPostContent: React.Dispatch<React.SetStateAction<any>>;
};

const ReplyDialogContext = createContext<ReplyDialogContextType | undefined>(
  undefined
);

const ReplyDialogContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isReplyDialogOpen, setIsReplyDialog] = useState<boolean>(false);
  const [postContent, setPostContent] = useState();
  return (
    <ReplyDialogContext.Provider
      value={{
        isReplyDialogOpen,
        setIsReplyDialog,
        postContent,
        setPostContent,
      }}
    >
      {children}
    </ReplyDialogContext.Provider>
  );
};

export const useReplyDialogContext = () => {
  const context = useContext(ReplyDialogContext);

  if (context === undefined) {
    throw new Error("useAuthUser must be used within a UserContextProvider");
  }

  return context;
};

export default ReplyDialogContextProvider;
