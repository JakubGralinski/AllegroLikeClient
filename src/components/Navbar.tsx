import { Link, useLocation } from "react-router-dom";
import { ADMIN, navigations } from "../lib/constants.ts";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import authService from "../lib/auth.service.ts";
import ThemeToggleButton from "./ThemeToggleButton";

function Navbar() {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const trueNavigations = [...navigations];

  if (user?.role === ADMIN) {
    trueNavigations.push({ title: "Admin", to: "/admin" });
  }

  function toggleIsMobileOpen() {
    if (window.innerWidth < 800) {
      setIsMobileOpen(!isMobileOpen);
    }
  }

  return (
    <>
      <div
        className={`${
          isMobileOpen
            ? "md:z-100 md:w-[80%] md:left-[0.5]"
            : "max-md:hidden left-[2vw]"
        } top-[30vh] w-40 h-[auto] fixed border-2 border-gray-300 bg-gray-200 rounded-2xl flex flex-col justify-start items-center 
          dark:bg-slate-800 dark:border-slate-700`}
      >
        <nav className="flex flex-col items-center p-2 pt-4 gap-4 w-full flex-grow justify-start">
          <ThemeToggleButton />
          {trueNavigations.map((navigation) => (
            <Link
              key={navigation.to}
              to={navigation.to}
              onClick={() => toggleIsMobileOpen()}
              className={`rounded-2xl text-center px-4 py-2 text-sm text-white w-[90%] ${
                location.pathname === navigation.to
                  ? "bg-secondary font-semibold dark:bg-pink-700"
                  : "bg-primary dark:bg-sky-700"
              } transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md 
                dark:text-gray-100 dark:hover:bg-slate-600`}
            >
              {navigation.title}
            </Link>
          ))}
        </nav>

        <div className="w-full mt-auto">
          <button
            onClick={() => {
              authService.logout();
              window.location.href = "/login";
            }}
            className="rounded-2xl text-center px-4 py-2 text-sm text-white w-[90%] bg-red-500 font-semibold transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md mb-2
                       dark:bg-red-700 dark:hover:bg-red-600 mx-auto block"
          >
            Logout
          </button>
          <div className="w-full text-center px-4 py-2 text-sm text-black bg-gray-300 font-bold rounded-b-2xl mt-2
                          dark:bg-slate-700 dark:text-gray-200">
            {user?.username}
          </div>
        </div>
      </div>
      <button
        onClick={() => toggleIsMobileOpen()}
        className={`md:hidden fixed top-4 p-3 text-3xl text-white rounded-2xl ${
          isMobileOpen ? "bg-secondary dark:bg-pink-600" : "bg-primary dark:bg-sky-600"
        } transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md cursor-pointer 
          dark:text-gray-100 dark:hover:bg-slate-600`}
      >
        {isMobileOpen ? <IoMdClose /> : <IoMenu />}
      </button>
    </>
  );
}

export default Navbar;
