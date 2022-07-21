import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { selectCurrentToken } from "../features/auth/authSlice";
import { frontEndLogout } from "../features/auth/authSlice";
import { useLogoutMutation } from "../features/auth/authApiSlice";

const Navbar = () => {
    const token = useSelector(selectCurrentToken);
    const dispatch = useDispatch();
    const [logout] = useLogoutMutation();

    async function handleLogout() {
        dispatch(frontEndLogout());

        const data = await logout();
        console.log(data);
    }

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/home">Home</Link>
                </li>
                <li>
                    <Link to="/data">Data</Link>
                </li>
                <li>
                    <Link to="/createdata">Create Data</Link>
                </li>
            </ul>
            {token && <button onClick={handleLogout}>Logout</button>}
        </nav>
    );
};

export default Navbar;
