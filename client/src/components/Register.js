import React, { useState, useRef, useEffect } from "react";

// const USER_REGEX = /^[a-zA-Z][a-z-A-Z0-9-_]{3, 23}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";

const Register = () => {
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [validName, setValidName] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPswrd, setValidPswrd] = useState(false);

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setvalidMatch] = useState(false);

    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const result = user.length > 4 ? true : false;
        console.log(result);
        console.log(user);
        setValidName(result);
    }, [user]);

    useEffect(() => {
        const result = pwd.length > 7 ? true : false;
        console.log(pwd);
        setValidPswrd(result);
        const match = pwd === matchPwd;
        setvalidMatch(match);
    }, [pwd, matchPwd]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setSuccess(true);
            //clear input fields
        } catch (err) {
            console.log(err.response.status, err.response.data);
        }
    }

    return (
        <div className="register-form">
            <p ref={errRef} className={errMsg ? "error-message" : "offscreen"}>
                {errMsg}
            </p>
            <h1>Register</h1>
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

                <label htmlFor="confirm-pwd">Confirm Password: </label>
                <input
                    type="password"
                    id="confirm-pwd"
                    onChange={e => setMatchPwd(e.target.value)}
                    required
                />

                <button
                    disabled={
                        !validName || !validPswrd || !validMatch ? true : false
                    }
                >
                    Sign up
                </button>
                <p>
                    Already registered? <br />
                    <span>
                        {/*router link here */}
                        <a href="/login">Sign In</a>
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Register;
