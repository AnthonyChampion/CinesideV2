import React from 'react';
import PropTypes from 'prop-types';

function PopupMessage({ message, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
            <div className="bg-white p-4 rounded shadow-lg text-center max-w-sm w-full">
                <p className="text-lg font-semibold">{message}</p>
                <button
                    onClick={onClose}
                    className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}

PopupMessage.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default PopupMessage;

