import { createContext, useContext, useState } from "react";

type EditProfileContextType = {
  isEditProfileDialogOpen: boolean;
  setIsEditProfileDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditProfileContext = createContext<EditProfileContextType | undefined>(
  undefined
);

const EditProfileContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isEditProfileDialogOpen, setIsEditProfileDialog] =
    useState<boolean>(false);

  return (
    <EditProfileContext.Provider
      value={{ isEditProfileDialogOpen, setIsEditProfileDialog }}
    >
      {children}
    </EditProfileContext.Provider>
  );
};

export const useEditProfileContext = () => {
  const context = useContext(EditProfileContext);

  if (context === undefined) {
    throw new Error(
      "useEditProfileContext  must be used within a UserContextProvider"
    );
  }

  return context;
};

export default EditProfileContextProvider;
