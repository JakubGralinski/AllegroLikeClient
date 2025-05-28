import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ImProfile } from "react-icons/im";
import { FaHouse } from "react-icons/fa6";
import { useState } from "react";
import AddressInputPopup from "./AddressInputPopup.tsx";
import UserUpdateFormPopup from "./UserUpdateFormPopup.tsx";

function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isAddressInputPopupOpen, setIsAddressInputPopupOpen] =
    useState<boolean>(false);
  const [isUserUpdateFormPopupOpen, setIsUserUpdateFormPopupOpen] =
    useState<boolean>(false);

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex items-center justify-center gap-10 flex-col max-md:mt-20">
      <div className="p-10 flex flex-col items-center gap-5">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2 text-center ">
          <ImProfile /> Your Profile
        </h2>
        <div className="space-y-4 text-lg flex gap-10 justify-between max-md:flex-col">
          <div>
            <p className="text-gray-500">Username:</p>
            <p className="font-semibold">{user.username}</p>
          </div>
          <div>
            <p className="text-gray-500">Email:</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Role:</p>
            <p className="font-semibold">{user.role.replace("ROLE_", "")}</p>
          </div>
        </div>
        {/*TODO: create update user data logic*/}
        <button
          onClick={() => setIsUserUpdateFormPopupOpen(true)}
          className="bg-primary w-[200px] max-md:w-[80%] py-3 rounded-2xl text-white transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md cursor-pointer"
        >
          Update your user data
        </button>
      </div>
      <div className="p-10 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2 text-center ">
          <FaHouse /> Your Address
        </h2>
        {user.address ? (
          <div className="p-10 flex flex-col items-center gap-5">
            <div className="space-y-4 text-lg flex gap-10 justify-between max-md:flex-col">
              <div>
                <p className="text-gray-500">Street:</p>
                <p className="font-semibold">{user.address.street}</p>
              </div>
              <div>
                <p className="text-gray-500">House number:</p>
                <p className="font-semibold">{user.address.houseNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">City:</p>
                <p className="font-semibold">{user.address.city}</p>
              </div>
              <div>
                <p className="text-gray-500">Country:</p>
                <p className="font-semibold">{user.address.country}</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddressInputPopupOpen(true)}
              className="bg-primary w-[200px] max-md:w-[80%] py-3 rounded-2xl text-white transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md cursor-pointer"
            >
              Update your address data
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-5">
            <p className="text-xl text-red-600 font-semibold">
              We do not have your address info currently, it will be needed to
              fulfill an order
            </p>
            <button
              onClick={() => setIsAddressInputPopupOpen(true)}
              className="bg-primary w-[200px] max-md:w-[80%] py-3 rounded-2xl text-white transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md cursor-pointer"
            >
              Fill in your address data
            </button>
          </div>
        )}
      </div>

      {isAddressInputPopupOpen && (
        <AddressInputPopup
          setIsAddressInputPopupOpen={setIsAddressInputPopupOpen}
        />
      )}
      {isUserUpdateFormPopupOpen && (
        <UserUpdateFormPopup
          setIsUserUpdatePopupOpen={setIsUserUpdateFormPopupOpen}
        />
      )}
    </div>
  );
}

export default Profile;
