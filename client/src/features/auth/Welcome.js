import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "./authSlice";

const Welcome = () => {
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);

    const welcome = user ? `Welcome ${user}` : "Welcome";

    const displayContent = (
        <div>
            <h1>{welcome}</h1>
            <p>Token: {token}</p>
        </div>
    );
    return displayContent;
};

export default Welcome;
