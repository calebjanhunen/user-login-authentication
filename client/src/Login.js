import { useState, useContext } from "react";
import axios from "./api/axios";
import AuthContext from "./context/AuthProvider";

const Login = () => {
    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [success, setSuccess] = useState(false);
    const { setAuth } = useContext(AuthContext);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await axios.post(
                "/login",
                JSON.stringify({ user, pwd }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            const accessToken = response.data.accessToken;
            setAuth(user, pwd, accessToken);

            setSuccess(true);
            setUser("");
            setPwd("");
        } catch (err) {
            console.log(err.response.status, err.response.data);
        }
    }

    return (
        <>
            {success ? (
                <div>
                    <p>Successfully logged in</p>
                    <button>Go home</button>
                </div>
            ) : (
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
            )}
        </>
    );
};

export default Login;
