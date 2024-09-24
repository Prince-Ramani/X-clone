import { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState();

  return (
    <ProfileContext.Provider value={{ currentProfile, setCurrentProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  return useContext(ProfileContext);
};
