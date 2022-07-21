import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useRefreshAccessTokenQuery } from "../features/auth/authApiSlice";
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
    const [skip, setSkip] = useState(true);
    const {
        data: newAccessToken,
        isError,
        isSuccess,
        error,
    } = useRefreshAccessTokenQuery(undefined, { skip });
    // console.log(newAccessToken);

    useEffect(() => {
        function verifyRefreshToken() {
            setSkip(false);
            if (isSuccess) {
                console.log(newAccessToken);
                dispatch(
                    setNewAccessToken({ token: newAccessToken.accessToken })
                );
            } else if (isError) {
                console.log(error);
            }
        }
        !accessToken && verifyRefreshToken();
        setIsLoading(false);
    }, [accessToken, dispatch, error, isError, isSuccess, newAccessToken]);

    return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistLogin;
