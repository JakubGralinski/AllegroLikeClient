const DEFAULT_SERVER_URL = "http://localhost:8080";
export const SERVER_URL = import.meta.env.SERVER_URL ?? DEFAULT_SERVER_URL;
export const BASE_API_URL = `${SERVER_URL}/api/`;

export const JWT_TOKEN_COOKIE_NAME = "allegrolike-jwttoken";

export const navigations: { title: string; to: string }[] = [
  {
    title: "Home",
    to: "/",
  },
  {
    title: "Profile",
    to: "/profile",
  },
  {
    title: "Cart",
    to: "/cart",
  },
  {
    title: "Orders",
    to: "/orders",
  },
];

export const ADMIN = "ROLE_ADMIN";

export const NETWORK_ERR_MSG =
  "Network error occurred, cannot connect to our servers, please try again later";
export const SERVER_ERR_MSG =
  "An internal server error occured, please try again later";
