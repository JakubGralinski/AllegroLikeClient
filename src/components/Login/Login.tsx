import { useState } from "react";
import "./login.css";
import { login } from "../../lib/auth";
import { loginUser } from "../../store/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    try {
      const token = await login(username, password);
      dispatch(loginUser(token));
      navigate("/");
    } catch (err: any) {
      setErrMessage(err.message);
    }
  }
  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <button type="submit">Login</button>
      </form>
      {errMessage && <div className="error">{errMessage}</div>}
    </div>
  );
}
