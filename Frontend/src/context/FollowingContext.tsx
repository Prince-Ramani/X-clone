import { createContext, SetStateAction, useContext, useState } from "react";

interface FollowingContextTypes {
  authUserFollowing: string[];
  setAuthUserFollowing: React.Dispatch<SetStateAction<string[]>>;
}

const FollowingContext = createContext<FollowingContextTypes | undefined>(
  undefined
);

const FollowingContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authUserFollowing, setAuthUserFollowing] = useState<string[] | []>([]);
  return (
    <FollowingContext.Provider
      value={{ authUserFollowing, setAuthUserFollowing }}
    >
      {children}
    </FollowingContext.Provider>
  );
};

export const useAuthUserFollowingContext = () => {
  const context = useContext(FollowingContext);
  if (!context) throw new Error();
  return useContext(FollowingContext);
};

export default FollowingContextProvider;
