import React, { useContext } from "react";
import AuthContext from "../Contexts/ContextAuth";
import UserContext from "../Contexts/ContextUser";
import Unauthorized from "../Pages/UnauthorizedRoute";
import { jwtDecode } from "jwt-decode";

const AuthCheck = ({ children }) => {
    // console.log("this function is running for auth check");

    const { isLoggedIn, login, logout } = useContext(AuthContext);
    const {clearData} = useContext(UserContext);
    // console.log("Is logged in:", isLoggedIn);

    if (!isLoggedIn) {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp > currentTime) {
                    if (!isLoggedIn) login(decoded);    
                    } else {
                        logout();
                        clearData();
                        return <Unauthorized />;
                    }
            } catch (error) {
                console.error("Token decoding error:", error);
                logout();
                clearData();
                return <Unauthorized />;
            }

        }
        else return <Unauthorized />;
    }

    return children;
};

export default AuthCheck;
