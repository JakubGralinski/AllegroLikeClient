import { BASE_API_URL } from "./constants";

export async function login(
  username: string,
  password: string
): Promise<string> {
  const loginDto = {
    username,
    password,
  };
  const serverResponse = await fetch(BASE_API_URL + "auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginDto),
  });

  if (!serverResponse.ok) {
    throw new Error(await serverResponse.text());
  }

  const serverResponseBody = await serverResponse.json();
  return serverResponseBody.token;
}

export async function register(
  username: string,
  password: string
): Promise<string> {
  const serverResponse = await fetch(BASE_API_URL + "auth/registerUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!serverResponse.ok) {
    throw new Error(await serverResponse.text());
  }

  const serverResponseBody = await serverResponse.json();
  return serverResponseBody.token;
}
