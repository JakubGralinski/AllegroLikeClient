import {Link, useLocation} from "react-router-dom";
import {ADMIN, navigations} from "../lib/constants.ts";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import { useState } from "react";
import ThemeToggleButton from "./ThemeToggleButton";
import { useAuth } from "./AuthContext";

function Navbar() {
    const location = useLocation();
    const user = useSelector((state: RootState) => state.auth.user);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { logout } = useAuth();

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
        <div className="top-[30vh] left-[2vw] w-40 h-[40vh] fixed border-2 border-gray-300 bg-slate-800 rounded-2xl flex flex-col justify-between items-center">
            <div className="mt-4 mb-2">
                <ThemeToggleButton />
            </div>
            <nav className="flex flex-col items-center p-2 gap-6 w-full flex-grow justify-center">
                {trueNavigations.map((navigation) => (
                    <Link
                        key={navigation.to}
                        to={navigation.to}
                        className={`rounded-2xl text-center px-4 py-2 text-sm text-white w-[90%] ${
                            location.pathname === navigation.to
                                ? navigation.title === "Home"
                                    ? "bg-secondary font-semibold"
                                    : navigation.title === "Admin"
                                        ? "bg-indigo-700 font-semibold"
                                        : "bg-primary font-semibold"
                                : navigation.title === "Admin"
                                    ? "bg-indigo-600"
                                    : navigation.title === "Home"
                                        ? "bg-secondary"
                                        : "bg-primary"
                        } transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md`}
                    >
                        {navigation.title}
                    </Link>
                ))}
                <button
                    onClick={logout}
                    className="rounded-2xl text-center px-4 py-2 text-sm text-white w-[90%] bg-red-600 font-semibold transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md mt-2"
                >
                    Logout
                </button>
            </nav>
            <div className="w-full text-center px-4 py-2 text-sm text-white bg-slate-700 font-bold rounded-b-2xl mb-2">
                {user?.username}
            </div>
        </div>
    );
}

export default Navbar;