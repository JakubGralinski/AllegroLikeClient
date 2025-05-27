import React, {createContext, useContext, useEffect, useState} from "react";
import authService from "../lib/auth.service";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {loginUser, logoutUser} from "../store/auth.ts";
import {User} from "../lib/types.ts";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = authService.getCurrentUser();
      if (token && !user) {
        try {
          const userResponse = await authService.checkCurrentUserToken(token);
          if (userResponse) {
            dispatch(loginUser(userResponse.user));
          } else {
            logout();
          }
        } catch (error) {
          console.error("Error occurred while validating token:", error);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    })();
  }, [dispatch, user]);


  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      dispatch(loginUser(response.user));
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await authService.register({
        username,
        email,
        password,
      });
      dispatch(loginUser(response.user));
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch(logoutUser());
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!user.username && !!user.role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
