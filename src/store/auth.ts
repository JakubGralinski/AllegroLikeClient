import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { JWT_TOKEN_COOKIE_NAME } from "../lib/constants";
import { User } from "../lib/types";

interface TokenPayload {
  sub: string;
  role: string[];
  exp: number;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action: PayloadAction<string>) {
      const token = action.payload;
      const user = jwtDecode<TokenPayload>(token);
      Cookies.set(JWT_TOKEN_COOKIE_NAME, token);
      console.log(user);
      state.user = {
        username: user.sub,
        role: user.role[0],
      } as User;
    },
    logoutUser(state) {
      Cookies.remove(JWT_TOKEN_COOKIE_NAME);
      state.user = null;
    },
    trySetUserFromCookie(state) {
      const token = Cookies.get(JWT_TOKEN_COOKIE_NAME);
      if (token) {
        try {
          const payload = jwtDecode<TokenPayload>(token);
          if (payload.exp * 1000 > Date.now()) {
            state.user = {
              username: payload.sub,
              role: payload.role[0],
            } as User;
          } else {
            Cookies.remove(JWT_TOKEN_COOKIE_NAME);
          }
        } catch {
          Cookies.remove(JWT_TOKEN_COOKIE_NAME);
        }
      }
    },
  },
});

export const { loginUser, logoutUser, trySetUserFromCookie } =
  authSlice.actions;
export default authSlice.reducer;
