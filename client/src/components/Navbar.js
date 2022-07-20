import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectCurrentToken } from "../features/auth/authSlice";

const Navbar = () => {
    const token = useSelector(selectCurrentToken);

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
            {token && <button>Logout</button>}
        </nav>
    );
};

export default Navbar;
