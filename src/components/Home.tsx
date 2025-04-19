import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function Home() {
  const username = useSelector((state: RootState) => state.auth.user?.username);
  return (
    <div>Home will be here, should be logged to access. Hello {username}</div>
  );
}
