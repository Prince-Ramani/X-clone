import { createContext, useContext, useState } from "react";

type UnfollowContextType = {
  isUnfollowContextOpen: boolean;
  setUnfollowContext: React.Dispatch<React.SetStateAction<boolean>>;
  setPersonInfo: React.Dispatch<React.SetStateAction<any>>;
  personInfo: any;
};

const UnfollowContext = createContext<UnfollowContextType | undefined>(
  undefined
);

const UnfollowContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isUnfollowContextOpen, setUnfollowContext] = useState<boolean>(false);
  const [personInfo, setPersonInfo] = useState<any>(undefined);
  return (
    <UnfollowContext.Provider
      value={{
        isUnfollowContextOpen,
        setUnfollowContext,
        personInfo,
        setPersonInfo,
      }}
    >
      {children}
    </UnfollowContext.Provider>
  );
};

export const useUnfollowContext = () => {
  const context = useContext(UnfollowContext);

  if (context === undefined) {
    throw new Error(
      "useUnfollowContext  must be used within a UserContextProvider"
    );
  }

  return context;
};

export default UnfollowContextProvider;
