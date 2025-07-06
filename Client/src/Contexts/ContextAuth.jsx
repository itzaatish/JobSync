import { createContext , useState } from "react";

const AuthContext = createContext({
    user: "",
    isLoggedIn: false,
    login: (userData) => {},
    logout: () => {}
});
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [user , setUser] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = (userData) => {
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setUser("");
        setIsLoggedIn(false);
    };

    return(
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}