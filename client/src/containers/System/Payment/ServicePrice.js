import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { useSelector } from 'react-redux';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const ServicePrice = () => {
    const navigate = useNavigate();
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
        <div className="md:my-auto md:h-full sm:h-1/2 rounded-2xl shadow-xl bg-gradient-to-br from-gray-200 to-gray-100 py-12 px-4 sm:px-6 lg:px-8  overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Bảng Giá Dịch Vụ
                    </h2>
                    <p className="text-xl text-gray-600">
                        Chọn phương án hoàn hảo cho nhu cầu bất động sản của bạn
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {typePosts.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-transform duration-300"
                        >
                            <div className="p-8">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-red-600 mb-4 uppercase">
                                        {item.name}
                                    </h3>
                                    <div className="mt-4 flex justify-center items-baseline">
                                        <span className="text-4xl font-bold text-green-600">
                                            {new Intl.NumberFormat('vi-VN').format(item.price)}
                                        </span>
                                        <span className="ml-1 text-xl text-gray-500">VNĐ/ngày</span>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    {item.features && item.features.map((feature, featureIndex) => (
                                        <div
                                            className="flex items-center space-x-3"
                                            key={featureIndex}
                                        >
                                            <FiCheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            <span className="text-gray-600">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <motion.button
                                    onClick={() => {
                                        navigate('/he-thong/tao-moi-bai-dang', { state: { selectedTypePostId: item.id } });
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200"
                                >
                                    Tạo tin ngay
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* <div className="mt-12 text-center">
                    <p className="text-gray-600 text-sm">
                        All plans include 24/7 customer support and a 30-day money-back guarantee
                    </p>
                </div> */}
            </div>
        </div>
    );
};

export default ServicePrice;