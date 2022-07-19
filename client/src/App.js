import { Routes, Route } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";

import "./index.css";
import Layout from "./Layout";
import Home from "./components/Home";
import Data from "./components/Data";
import PageNotFound from "./components/PageNotFound";
import RequireAuth from "./components/RequireAuth";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Public routes */}
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                <Route element={<RequireAuth />}>
                    {/*Protected routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/data" element={<Data />} />
                </Route>

                {/* Catch All */}
                <Route path="*" element={<PageNotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
