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

    const login = useCallback((user, token) => {
        setAuth(user);
        // On ajoute le token dans chaque requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }, []);

    const logout = useCallback(() => {
        setAuth(null);
        // On retire le token des requêtes 
        delete axios.defaults.headers.common['Authorization'];
    }, []);

    // Récupère le User dans le local storage pour alimenter le AuthContext
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setAuth(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (auth) {
            // On ajoute le user dans le local storage
            localStorage.setItem("user", JSON.stringify(auth));
        } else {
            localStorage.removeItem("user");
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