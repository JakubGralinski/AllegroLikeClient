import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import { JWT_TOKEN_COOKIE_NAME } from "../lib/constants";

type AuthContext = {
  isAuthenticated: boolean;
  token: string | null;
  loginHandler: (token: string) => void;
  logoutHandler: () => void;
};

const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  token: null,
  loginHandler: () => {},
  logoutHandler: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [jwtToken, setJwtToken] = useState<string | null>(
    Cookies.get(JWT_TOKEN_COOKIE_NAME) || null
  );

  const loginHandler = (token: string) => {
    Cookies.set(JWT_TOKEN_COOKIE_NAME, token, { expires: 1 });
    setJwtToken(token);
  };

  const logoutHandler = () => {
    Cookies.remove(JWT_TOKEN_COOKIE_NAME);
    setJwtToken(null);
  };

  const isAuthenticated = jwtToken !== null && isValidToken(jwtToken);

  useEffect(() => {
    if (jwtToken && !isValidToken(jwtToken)) {
      logout();
    }
  }, [jwtToken]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token: jwtToken, loginHandler, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
