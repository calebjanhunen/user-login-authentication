import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { selectCurrentUser, selectCurrentToken } from "./authSlice";

const Welcome = () => {
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);

    const welcome = user ? `Welcome ${user}` : "Welcome";

    const displayContent = (
        <div>
            <Navbar />
            <h1>{welcome}</h1>
            <p>Token: {token}</p>
        </div>
    );
    return displayContent;
};

export default Welcome;
