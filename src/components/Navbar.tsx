import { Link, useLocation, useNavigate } from "react-router-dom";
import { ADMIN, navigations } from "../lib/constants";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import ThemeToggleButton from "./ThemeToggleButton";
import authService from "../lib/auth.service";

function Navbar() {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const trueNavigations = [...navigations];

  if (user?.role === ADMIN) {
    trueNavigations.push({ title: "Admin", to: "/admin" });
  }

  function toggleIsMobileOpen() {
    if (window.innerWidth < 800) {
      setIsMobileOpen(!isMobileOpen);
    }
  }

  function handleLogout() {
    authService.logout();
    navigate("/login");
  }

  return (
    <>
      <div
        className={`${
          isMobileOpen
            ? "md:z-100 md:w-[80%] md:left-[0.5]"
            : "max-md:hidden left-[2vw]"
        } top-[25vh] w-48 h-auto fixed border-2 border-gray-300 bg-gray-200 rounded-2xl flex flex-col justify-start items-center p-4
          dark:bg-slate-800 dark:border-slate-700`}
      >
        <nav className="flex flex-col items-center gap-5 w-full flex-grow justify-start">
          <ThemeToggleButton />
          {trueNavigations.map((navigation) => (
            <Link
              key={navigation.to}
              to={navigation.to}
              onClick={() => toggleIsMobileOpen()}
              className={`
                rounded-2xl text-center px-4 py-2.5 text-sm w-[90%]
                transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md
                text-white
                ${
                  location.pathname === navigation.to
                    ? "bg-pink-600 font-semibold dark:bg-pink-700"
                    : "bg-sky-600 hover:bg-sky-500 dark:bg-sky-800 dark:hover:bg-sky-700"
                }
              `}
            >
              {navigation.title}
            </Link>
          ))}
        </nav>

        <div className="w-full mt-auto pt-4">
          <button
            onClick={handleLogout}
            className="rounded-2xl text-center px-4 py-2.5 text-sm text-white w-[90%] bg-red-500 font-semibold transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md mb-3
                       dark:bg-red-700 dark:hover:bg-red-600 mx-auto block cursor-pointer"
          >
            Logout
          </button>
          <div
            className="w-full text-center px-4 py-3 text-sm text-black bg-gray-300 font-bold rounded-b-2xl
                          dark:bg-slate-700 dark:text-gray-200"
          >
            {user?.username}
          </div>
        </div>
      </div>
      <button
        onClick={() => toggleIsMobileOpen()}
        className={`
          md:hidden fixed top-4 p-3 text-3xl rounded-2xl
          transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md cursor-pointer
          text-white
          ${
            isMobileOpen
              ? "bg-pink-600 dark:bg-pink-700"
              : "bg-sky-600 dark:bg-sky-700"
          }
        `}
      >
        {isMobileOpen ? <IoMdClose /> : <IoMenu />}
      </button>
    </>
  );
}

export default Navbar;
