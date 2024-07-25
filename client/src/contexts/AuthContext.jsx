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
    const [token, setToken] = useState(""); //On initialise l'état du token par une string vide

    //fonction permettant de set le user + le token
    const login = useCallback((user, token) => {
        setAuth(user);
        setToken(token);
        // On ajoute le token dans chaque requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }, []);

    //fonction qui réinitialise l'état de base du auth et du token
    const logout = useCallback(() => {
        setAuth(null);
        setToken(null)
        // On retire le token des requêtes 
        delete axios.defaults.headers.common['Authorization'];
    }, []);

    // Récupère le User et le token dans le local storage pour alimenter le AuthContext
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
            // On ajoute le user et le token dans le local storage
            localStorage.setItem("user", JSON.stringify(auth)); // ajouter une durée de temps
            localStorage.setItem("token", token); // ajouter une durée de temps
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