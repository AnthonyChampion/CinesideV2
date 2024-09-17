import {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
    useCallback,
} from "react";
import axios from 'axios';
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(null);
    const [token, setToken] = useState("");


    const login = useCallback((user, token) => {
        setAuth(user);
        setToken(token);

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }, []);


    const logout = useCallback(() => {
        setAuth(null);
        setToken(null)

        delete axios.defaults.headers.common['Authorization'];
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser) {
            setToken(storedToken);
            setAuth(JSON.parse(storedUser));
        }

    }, []);

    useEffect(() => {
        if (auth) {
            localStorage.setItem("user", JSON.stringify(auth));
            localStorage.setItem("token", token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
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