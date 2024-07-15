import {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
    useCallback,
} from "react";

import PropTypes from "prop-types";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(null);

    const login = useCallback((userData) => {
        setAuth(userData);
    }, []);

    const logout = useCallback(() => {
        setAuth(null);
    }, []);

    useEffect(() => {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
            setAuth(JSON.parse(storedAuth));
        }
    }, []);

    useEffect(() => {
        if (auth) {
            localStorage.setItem("auth", JSON.stringify(auth));
        } else {
            localStorage.removeItem("auth");
        }
    }, [auth]);

    const authValue = useMemo(
        () => ({ auth, login, logout }),
        [auth, login, logout]
    );

    return (
        <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};