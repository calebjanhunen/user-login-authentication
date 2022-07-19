import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";

const Login = () => {
    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [login, { isLoading }] = useLoginMutation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const userData = await login({ user, pwd }).unwrap();
            dispatch(setCredentials({ user, token: userData.accessToken }));
            console.log(userData);
            setUser("");
            setPwd("");
            navigate("/welcome");
        } catch (err) {
            if (!err.data) {
                console.log("Server error");
            } else if (err.status === 401) {
                console.log(err.data.message);
            } else {
                console.log(err.data);
            }
        }
    }

    return (
        <div className="sign-in-form">
            <h1>Sign in</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    autoComplete="off"
                    onChange={e => setUser(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={e => setPwd(e.target.value)}
                    required
                />

                <button>Sign In</button>
                <p>
                    Need an account? <br />
                    <span>
                        {/*router link here */}
                        <a href="#">Register</a>
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;
