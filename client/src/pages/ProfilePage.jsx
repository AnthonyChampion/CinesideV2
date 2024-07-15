import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilPage = () => {
    const { auth } = useAuth();

    return (
        <div className="container mx-auto mt-8">
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden md:max-w-2xl">
                <div className="md:flex">
                    <div className="w-full p-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Mon Ciné profil</h2>
                        <p className="mt-2 text-gray-600">Nom: {auth.name}</p>
                        <p className="mt-2 text-gray-600">Email: {auth.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilPage;
