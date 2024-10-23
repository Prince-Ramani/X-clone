import { createContext, useContext, useState } from "react";

const AuthUserContext = createContext();

export const AuthUserContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState({});

  return (
    <AuthUserContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuthUserContext = () => {
  return useContext(AuthUserContext);
};
