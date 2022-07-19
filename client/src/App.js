import { Routes, Route } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";

import "./index.css";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Data from "./components/Data";
import PageNotFound from "./components/PageNotFound";
import RequireAuth from "./features/auth/RequireAuth";
import Welcome from "./features/auth/Welcome";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Public routes */}
                <Route index element={<Register />} />
                <Route path="login" element={<Login />} />

                <Route element={<RequireAuth />}>
                    {/*Protected routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/data" element={<Data />} />
                    <Route path="/welcome" element={<Welcome />} />
                </Route>

                {/* Catch All */}
                <Route path="*" element={<PageNotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
