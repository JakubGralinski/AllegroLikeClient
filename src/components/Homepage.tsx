import {useSelector} from "react-redux";
import {RootState} from "../store";

function Homepage() {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <div>Welcome {user?.username}, you hve {user?.role} permissions</div>
    );
}

export default Homepage;