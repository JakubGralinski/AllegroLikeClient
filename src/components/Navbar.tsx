import {Link, useLocation} from "react-router-dom";
import {ADMIN, navigations} from "../lib/constants.ts";
import {useSelector} from "react-redux";
import {RootState} from "../store";

function Navbar() {
    const location = useLocation();
    const user = useSelector((state: RootState) => state.auth.user);

    const trueNavigations = [...navigations];

    // Treat user with username 'admin' as admin for now
    if (/*user?.role === ADMIN ||*/ user?.username === 'kuba1') {
        trueNavigations.push(
            { title: "Admin", to: "/admin" },
        );
    }

    return (
        <div className="top-[30vh] left-[2vw] w-40 h-[40vh] fixed border-2 border-gray-300 bg-gray-200 rounded-2xl flex flex-col justify-between items-center">
            <nav className="flex flex-col items-center p-2 gap-6 w-full flex-grow justify-center">
                {trueNavigations.map((navigation) => (
                    <Link
                        key={navigation.to}
                        to={navigation.to}
                        className={`rounded-2xl text-center px-4 py-2 text-sm text-white w-[90%] ${
                            location.pathname === navigation.to
                                ? "bg-secondary font-semibold"
                                : "bg-primary"
                        } transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md`}
                    >
                        {navigation.title}
                    </Link>
                ))}
            </nav>

            <div className="w-full text-center px-4 py-2 text-sm text-black bg-gray-300 font-bold rounded-b-2xl">
                {user?.username}
            </div>
        </div>
    );
}

export default Navbar;