import React from "react";
import { useNavigate } from "react-router-dom";

const Firstpage = () => {
    const navigate = useNavigate();
    return (
        <div>
            <button
                onClick={() => {
                    navigate("/login");
                }}
            >
                Click to sign in
            </button>
        </div>
    );
};

export default Firstpage;
