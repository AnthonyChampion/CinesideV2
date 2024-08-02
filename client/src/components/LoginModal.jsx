import React from 'react';
import PropTypes from 'prop-types';

export default function LoginModal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <div className="mb-4">{children}</div>
                <button
                    onClick={onClose}
                    className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-800 transition duration-300"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}

LoginModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};
