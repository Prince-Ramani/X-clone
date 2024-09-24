import { createContext, useContext, useState } from "react";

const FollowersContext = createContext();

export const FollowersContextProvider = ({ children }) => {
  const [totalFollowers, setTotalFollowers] = useState();

  return (
    <FollowersContext.Provider value={{ totalFollowers, setTotalFollowers }}>
      {children}
    </FollowersContext.Provider>
  );
};

export const useFollowersContext = () => {
  return useContext(FollowersContext);
};
