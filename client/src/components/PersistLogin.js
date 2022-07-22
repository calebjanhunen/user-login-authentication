import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useLazyRefreshAccessTokenQuery } from "../features/auth/authApiSlice";
import { selectCurrentToken, setCredentials } from "../features/auth/authSlice";

const PersistLogin = () => {
    const dispatch = useDispatch();
    const accessToken = useSelector(selectCurrentToken);
    const [isLoading, setIsLoading] = useState(true);

    const [refreshAccessToken] = useLazyRefreshAccessTokenQuery();
    useEffect(() => {
        async function verifyRefreshToken() {
            try {
                const { data } = await refreshAccessToken();
                // console.log(data);
                dispatch(
                    setCredentials({ user: data.user, token: data.accessToken })
                );
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
        !accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, [accessToken, refreshAccessToken, dispatch]);

    return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistLogin;
