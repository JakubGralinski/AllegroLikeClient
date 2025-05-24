import {IoMdClose} from "react-icons/io";

interface AddressInputPopupProps {
    setIsAddressInputPopupOpen: (isAddressInputOpen: boolean) => void
}

function AddressInputPopup({ setIsAddressInputPopupOpen }: AddressInputPopupProps) {
    return (
        <div className="fixed bg-primary rounded-2xl flex-col items-center gap-5 w-[50%] h-[50%] max-md:w-[80%]">
            <button onClick={() => setIsAddressInputPopupOpen(false)} className="bg-secondary p-2 absolute top-2 right-2 rounded-2xl text-white transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md cursor-pointer">
                <IoMdClose />
            </button>

        </div>
    );
}

export default AddressInputPopup;