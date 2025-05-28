import { IoMdClose } from "react-icons/io";
import { FormEvent, useState } from "react";
import { Address } from "../lib/types.ts";
import addressService from "../lib/address.service.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import userService from "../lib/user.service.ts";
import { loginUser } from "../store/auth.ts";

interface AddressInputPopupProps {
  setIsAddressInputPopupOpen: (isAddressInputOpen: boolean) => void;
}

function AddressInputPopup({
  setIsAddressInputPopupOpen,
}: AddressInputPopupProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [foundAddresses, setFoundAddresses] = useState<Address[] | null>(null);
  const [isCreatingAddressInput, setIsCreatingAddressInput] =
    useState<boolean>(false);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFoundAddresses(await addressService.searchAddress(searchQuery));
  }

  async function handleAddressCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const userResult = await userService.createCurrentUserAddress(
      {
        city,
        country,
        street,
        houseNumber,
      },
      user!.id,
    );

    if (userResult.isSuccess) {
      dispatch(loginUser(userResult.content));
      setIsAddressInputPopupOpen(false);
    } else {
      setError(userResult.errMessage);
    }
  }

  async function handleAddressUpdate(addressId: number) {
    const userResult = await userService.updateCurrentUserAddress(
      addressId,
      user!.id,
    );

    if (userResult.isSuccess) {
      dispatch(loginUser(userResult.content));
      setIsAddressInputPopupOpen(false);
    } else {
      setError(userResult.errMessage);
    }
  }

  return (
    <div className="flex fixed bg-primary rounded-2xl flex-col items-center gap-5 w-[70%] h-[70%] max-md:w-[80%] justify-center text-center">
      <button
        onClick={() => setIsAddressInputPopupOpen(false)}
        className="bg-secondary p-2 absolute top-2 right-2 rounded-2xl text-white transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md cursor-pointer"
      >
        <IoMdClose />
      </button>

      {isCreatingAddressInput ? (
        <>
          <form
            onSubmit={(e) => handleAddressCreate(e)}
            className="flex flex-col gap-4 items-center justify-center mt-10"
          >
            <h2 className="text-white font-semibold text-xl">
              Provide your address information
            </h2>
            <input
              type="text"
              required
              value={city}
              placeholder="Your city..."
              onChange={(e) => setCity(e.target.value)}
              className="bg-white text-black p-2 w-70 rounded-lg focus:ring-0 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
            />
            <input
              type="text"
              required
              value={country}
              placeholder="Your country..."
              onChange={(e) => setCountry(e.target.value)}
              className="bg-white text-black p-2 w-70 rounded-lg focus:ring-0 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
            />
            <input
              type="text"
              required
              value={street}
              placeholder="Your street..."
              onChange={(e) => setStreet(e.target.value)}
              className="bg-white text-black p-2 w-70 rounded-lg focus:ring-0 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
            />
            <div className="flex gap-2 items-center justify-center">
              <p className="text-white">House number:</p>
              <input
                type="number"
                required
                value={houseNumber}
                placeholder="Your house number..."
                onChange={(e) => setHouseNumber(+e.target.value)}
                className="bg-white p-2 rounded-lg focus:ring-0 focus:outline-none w-[50%] text-black placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              className="p-2 rounded-lg bg-secondary text-white transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md cursor-pointer"
            >
              Create address
            </button>
          </form>

          <button
            className="hover:underline underline-offset-2 cursor-pointer mt-5 text-white"
            onClick={() => setIsCreatingAddressInput(false)}
          >
            Want to search your address? Click here
          </button>
        </>
      ) : (
        <>
          <form
            onSubmit={(e) => handleSearch(e)}
            className="flex items-center justify-center mt-10 max-md:mt-20"
          >
            <input
              type="text"
              required
              value={searchQuery}
              placeholder="Type to search your address..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-black p-2 w-70 rounded-l-lg focus:ring-0 focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 rounded-r-lg bg-secondary text-white transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md cursor-pointer"
            >
              Search
            </button>
          </form>
          {foundAddresses && (
            <div className="flex gap-2 flex-col items-center justify-center mt-10 max-md:mt-20">
              <h2 className="font-semibold text-lg text-white">
                Search Results:
              </h2>
              {foundAddresses.length > 0 ? (
                foundAddresses.map((item) => (
                  <button
                    className="hover:underline underline-offset-2 cursor-pointer mt-5 text-white"
                    onClick={() => handleAddressUpdate(item.id)}
                  >
                    {item.id}. {item.street} {item.houseNumber} in {item.city},{" "}
                    {item.country}
                  </button>
                ))
              ) : (
                <div>Could not find any address for this query</div>
              )}
            </div>
          )}

          <br />

          <button
            className="hover:underline underline-offset-2 cursor-pointer mt-5 text-white"
            onClick={() => setIsCreatingAddressInput(true)}
          >
            Can't find your address? Click here to create one
          </button>
        </>
      )}
      {error && <div className="text-secondary font-semibold">{error}</div>}
    </div>
  );
}

export default AddressInputPopup;
