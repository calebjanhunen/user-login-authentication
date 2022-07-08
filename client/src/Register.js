import React, { useState, useRef, useEffect } from "react";
import {
    faCheck,
    faTimes,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAweomseIcon } from "@fortawesome/react-fontawesome";

// const USER_REGEX = /^[a-zA-Z][a-z-A-Z0-9-_]{3, 23}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pswrd, setPswrd] = useState("");
    const [validPswrd, setValidPswrd] = useState(false);
    const [pswrdFocus, setPswrdFocus] = useState(false);

    const [matchPswrd, setMatchPswrd] = useState("");
    const [validMatch, setvalidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        const result = user.length > 4 ? true : false;
        console.log(result);
        console.log(user);
        setValidName(result);
    }, [user]);

    useEffect(() => {
        const result = pswrd.length > 7 ? true : false;
        console.log(result);
        console.log(pswrd);
        setValidPswrd(result);
        const match = pswrd === matchPswrd;
        setvalidMatch(match);
    }, [pswrd, matchPswrd]);

    useEffect(() => {
        setErrMsg("");
    }, [user, pswrd, matchPswrd]);

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(user, pswrd);
        setSuccess(true);
    }

    return (
        <div className="register-form">
            <p ref={errRef} className={errMsg ? "error-message" : "offscreen"}>
                {errMsg}
            </p>
            <h1>Register</h1>
            <form onSubmit={e => handleSubmit(e)}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={e => setUser(e.target.value)}
                    required
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={e => setPswrd(e.target.value)}
                    required
                    onFocus={() => setPswrdFocus(true)}
                    onBlur={() => setPswrdFocus(false)}
                />

                <label htmlFor="confirm-pwd">Confirm Password: </label>
                <input
                    type="password"
                    id="confirm-pwd"
                    onChange={e => setMatchPswrd(e.target.value)}
                    required
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
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
                        <a href="#">Sign In</a>
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Register;