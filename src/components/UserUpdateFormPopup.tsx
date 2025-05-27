import { IoMdClose } from "react-icons/io";
import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import userService from "../lib/user.service.ts";
import { loginUser } from "../store/auth.ts";

interface UserUpdatePopupProps {
  setIsUserUpdatePopupOpen: (isUserUpdateOpen: boolean) => void;
}

function UserUpdateFormPopup({
  setIsUserUpdatePopupOpen,
}: UserUpdatePopupProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [email, setEmail] = useState<string>(user!.email);
  const [username, setUsername] = useState<string>(user!.username);
  const [error, setError] = useState<string | null>(null);

  if (!user) return <div>Loading...</div>;

  async function handleUserUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email == user!.email && username == user!.username) {
      console.log("im here");
      setError("At least one of the fields has to be changed");
      return;
    }
    const userResp = await userService.updateCurrentUser(
      {
        username,
        email,
      },
      user!.id,
    );

    dispatch(loginUser(userResp));
    setIsUserUpdatePopupOpen(false);
  }

  return (
    <div className="flex fixed bg-primary rounded-2xl flex-col items-center w-[70%] h-[70%] max-md:w-[80%] justify-center text-center">
      <button
        onClick={() => setIsUserUpdatePopupOpen(false)}
        className="bg-secondary p-2 absolute top-2 right-2 rounded-2xl text-white transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md cursor-pointer"
      >
        <IoMdClose />
      </button>

      <form
        onSubmit={(e) => handleUserUpdate(e)}
        className="flex flex-col gap-4 items-center justify-center mt-10"
      >
        <h2 className="text-white font-semibold text-xl">
          Provide information to update your profile
        </h2>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white text-black p-2 w-70 rounded-lg focus:ring-0 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
        />
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-white text-black p-2 w-70 rounded-lg focus:ring-0 focus:outline-none placeholder-gray-500"
        />
        <button
          type="submit"
          className="p-2 rounded-lg bg-secondary text-white transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md cursor-pointer"
        >
          Update
        </button>

        {error && <div className="text-secondary font-semibold">{error}</div>}
      </form>
    </div>
  );
}

export default UserUpdateFormPopup;
