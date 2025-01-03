import { createContext, useContext, useState } from "react";

type DeletePostsContextType = {
  setDeletePostId: React.Dispatch<React.SetStateAction<any>>;
  DeletePostId: string;
  setHasDeletedAnyPost: React.Dispatch<React.SetStateAction<boolean>>;
  hasDeletedAnyPost: boolean;
};

const DeletePostContext = createContext<DeletePostsContextType | undefined>(
  undefined
);

const DeletePostContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [DeletePostId, setDeletePostId] = useState<any>(undefined);
  const [hasDeletedAnyPost, setHasDeletedAnyPost] = useState<boolean>(false);
  return (
    <DeletePostContext.Provider
      value={{
        DeletePostId,
        setDeletePostId,
        hasDeletedAnyPost,
        setHasDeletedAnyPost,
      }}
    >
      {children}
    </DeletePostContext.Provider>
  );
};

export const useDeletePostContext = () => {
  const context = useContext(DeletePostContext);

  if (context === undefined) {
    throw new Error(
      "useDeletePostContext must be used within a UserContextProvider"
    );
  }

  return context;
};

export default DeletePostContextProvider;
