import React, { useState } from 'react';

const Momo = () => {
    const [showModal, setShowModal] = useState(false);

    const handleMomoClick = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <div className="flex justify-center items-center">
                <button onClick={handleMomoClick} className="p-4 bg-gray-200 rounded">
                    <img src="momo-logo.png" alt="MOMO" className="w-16 h-16" />
                    MOMO
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">MOMO Payment</h2>
                        <p>Thông tin chi tiết về thanh toán MOMO.</p>
                        <button onClick={closeModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Momo;