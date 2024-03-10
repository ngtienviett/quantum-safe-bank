import { Camelized } from "humps";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { URL_CONFIG } from "../config/url.config";
import { TOKEN } from "../http";
import { IAuth } from "../services/auth.service";

type AuthContextType = {
  // userRole: string | null;
  auth: Camelized<IAuth> | null;
  setAuth: (auth: Camelized<IAuth>) => void;
  // login: (role: string) => void;
  // logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // const [userRole, setUserRole] = useState<string | null>(null);
  const [auth, setAuth] = useState<Camelized<IAuth> | null>(null);

  // const login = (role: string) => {
  //   setUserRole(role);
  // };

  // const logout = () => {
  //   setUserRole(null);
  // };

  useEffect(() => {
    if (
      (!auth || !auth.accessToken) &&
      ![URL_CONFIG.LOGIN, URL_CONFIG.REGISTER, URL_CONFIG.HOME].includes(
        pathname
      )
    ) {
      sessionStorage.removeItem(TOKEN);
      sessionStorage.removeItem(TOKEN);
    }
  }, [navigate, pathname, auth]);

  return (
    // <AuthContext.Provider value={{ userRole, userInfo, setUserInfo, login, logout }}>
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
