import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useRefreshAccessTokenMutation } from "../features/auth/authApiSlice";
import {
    selectCurrentToken,
    selectCurrentUser,
    setCredentials,
    setNewAccessToken,
} from "../features/auth/authSlice";

const PersistLogin = () => {
    const dispatch = useDispatch();
    const accessToken = useSelector(selectCurrentToken);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshAccessToken] = useRefreshAccessTokenMutation();

    useEffect(() => {
        async function verifyRefreshToken() {
            try {
                const data = await refreshAccessToken();
                console.log(data);
                dispatch(
                    setCredentials({
                        user: data.data.user,
                        token: data.data.accessToken,
                    })
                );
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
        console.log(accessToken);
        !accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, [refreshAccessToken, accessToken, dispatch]);

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
    }, [isLoading]);

    return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistLogin;
