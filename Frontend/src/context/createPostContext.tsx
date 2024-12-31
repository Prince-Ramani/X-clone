import { createContext, useContext, useState } from "react";

type CreatePostContextType = {
  isCreateDialogOpen: boolean;
  setCreateDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreatePostContext = createContext<CreatePostContextType | undefined>(
  undefined
);

const CreatePostContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isCreateDialogOpen, setCreateDialog] = useState<boolean>(false);
  return (
    <CreatePostContext.Provider value={{ isCreateDialogOpen, setCreateDialog }}>
      {children}
    </CreatePostContext.Provider>
  );
};

export const useCreatePostContext = () => {
  const context = useContext(CreatePostContext);

  if (context === undefined) {
    throw new Error("Postcontext must be used within a PostContextProvider");
  }

  return context;
};

export default CreatePostContextProvider;
