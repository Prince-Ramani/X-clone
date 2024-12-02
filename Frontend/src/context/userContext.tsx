import React, { createContext, useContext, useState } from "react";

export interface User {
  _id: string;
  username: string;
  email: string;
  bio: string;
  banner: string;
  profilePic: string;
  followers: string[];
  following: string[];
  links: string[];
  location?: string;
}

interface UserContextType {
  authUser: User | null;
  setAuthUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuthUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useAuthUser must be used within a UserContextProvider");
  }

  return context;
};

export default UserContextProvider;
