import { useSelector } from "react-redux";
import { RootState } from "../store";

function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex items-center justify-center gap-20">
      <div className="p-10 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center ">Your Profile</h2>
        <div className="space-y-4 text-lg">
          <div>
            <p className="text-gray-500">Username:</p>
            <p className="font-semibold">{user.username}</p>
          </div>
          <div>
            <p className="text-gray-500">Role:</p>
            <p className="font-semibold">{user.role.replace("ROLE_", "")}</p>
          </div>
        </div>
      </div>
      <div className="p-10 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center">Your Wishlist</h2>
        <div className="space-y-4 text-lg">wishlist will be here</div>
      </div>
    </div>
  );
}

export default Profile;
