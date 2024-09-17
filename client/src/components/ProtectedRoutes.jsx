import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

function ProtectedRoute({ children }) {
    const { auth } = useAuth();
    const location = useLocation();

    if (!auth) {
        return <Navigate to="/connexion" state={{ from: location }} />;
    }

    return <>{children}</>;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
