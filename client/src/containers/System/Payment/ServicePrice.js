import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const ServicePrice = () => {
    const services = [
        {
            name: "Basic Property Listing",
            price: "$29",
            features: [
                "Single property listing",
                "30 days visibility",
                "Email support"
            ]
        },
        {
            name: "Premium Property Package",
            price: "$89",
            features: [
                "Multiple property listings",
                "90 days visibility",
                "Advanced analytics",
                "Priority support",
            ]
        },
        {
            name: "Professional Real Estate Suite",
            price: "$199",
            features: [
                "Unlimited property listings",
                "365 days visibility",
                "Real-time analytics",
                "24/7 Premium support",
                "Featured listings",
            ]
        }
    ];

    return (
        <div className=" h-[calc(100vh-50px)] bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 pt-10">
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
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
                        >
                            <div className="p-8">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        {service.name}
                                    </h3>
                                    <div className="mt-4 flex justify-center items-baseline">
                                        <span className="text-5xl font-extrabold text-gray-900">
                                            {service.price}
                                        </span>
                                        <span className="ml-1 text-xl text-gray-500">/ngày</span>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    {service.features.map((feature, featureIndex) => (
                                        <div
                                            key={featureIndex}
                                            className="flex items-center space-x-3"
                                        >
                                            <FiCheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            <span className="text-gray-600">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200"
                                >
                                    Get Started
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
