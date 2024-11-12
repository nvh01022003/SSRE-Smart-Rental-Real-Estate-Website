import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import { FiCheckCircle } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import axios from 'axios';

const PriceModal = ({ setIsPriceModalOpen }) => {
    const { token } = useSelector((state) => state.auth);
    const [typePosts, setTypePosts] = useState([]);

    const fetchTypePost = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/admin/showAllTypePost', {
                headers: {
                    'token': `${token}`,
                }
            });
            if (res.data.err === 0) {
                setTypePosts(res.data.postType);
            }
        } catch (error) {
            console.error('Error fetching typePosts:', error);
        }
    };

    useEffect(() => {
        fetchTypePost();
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md h-5/6 overflow-y-auto relative"
            >
                <button
                    onClick={() => setIsPriceModalOpen(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <AiOutlineClose size={20} />
                </button>
                <h2 className="text-xl font-semibold mb-3">Bảng Giá Tin Đăng</h2>
                <div className="space-y-4">
                    {typePosts.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 rounded-md p-3 shadow-sm hover:bg-gray-200 transition"
                        >
                            <h3 className="text-lg font-medium text-red-500 mb-1 uppercase">
                                {item.name}
                            </h3>
                            <div className="flex items-baseline">
                                <span className="text-2xl font-bold text-green-600">
                                    {new Intl.NumberFormat('vi-VN').format(item.price)}
                                </span>
                                <span className="ml-1 text-sm text-gray-500">VNĐ/ngày</span>
                            </div>
                            <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                                {item.features && item.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center">
                                        <FiCheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default PriceModal;