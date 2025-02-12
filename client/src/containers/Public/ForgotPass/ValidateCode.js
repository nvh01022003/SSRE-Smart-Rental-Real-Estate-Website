import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail } from 'react-icons/fi';

// Import your logo asset
import logo from '../../../assets/logo.png';

// AuthWrapper component (move outside to prevent re-renders)
const AuthWrapper = ({ children }) => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?ixlib=rb-4.0.3')",
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backgroundBlendMode: 'overlay',
            }}
        >
            {/* Logo & Title Section */}
            <div
                className="flex items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-110 px-6 py-0 rounded-xl"
                onClick={() => navigate('/')}
            >
                <img src={logo} alt="Smart Rental Logo" className="w-[80px] h-[80px] mr-3" />
                <span className="text-3xl font-medium text-white">Smart Rental Real Estate</span>
            </div>

            {children}
        </div>
    );
};

// Form classes for consistent styling
const formClasses = {
    inputWrapper: 'min-h-[85px]',
    input:
        'pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300',
    error: 'text-red-500 text-xs mt-1',
    inputContainer: 'relative',
};

const ValidateCode = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [invalidFields, setInvalidFields] = useState([]);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const navigate = useNavigate();

    // Ref to track the first render for animation
    const isFirstRender = useRef(true);

    useEffect(() => {
        isFirstRender.current = false;
    }, []);

    // Countdown timer effect
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleChange = (e) => {
        setVerificationCode(e.target.value);

        // Clear the error message for this field
        setInvalidFields((prev) => prev.filter((field) => field.name !== 'verificationCode'));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Clear previous errors
        setInvalidFields([]);

        // Validation
        if (!verificationCode) {
            setInvalidFields([
                { name: 'verificationCode', message: 'Vui lòng nhập mã xác thực' },
            ]);
            setLoading(false);
            return;
        }

        const email = localStorage.getItem('email');

        try {
            const response = await axios.post(
                `http://localhost:5000/api/v1/auth/verifiedMail/${verificationCode}`,
                { email }
            );

            if (response.status === 200) {
                // Swal.fire('Thành công!', 'Mã xác thực đúng!', 'success').then(() => {
                //     navigate(path.RESET_PASS);
                // });
                navigate('dat-lai-mat-khau');
            }
        } catch (error) {
            if (error.response?.status === 400) {
                Swal.fire('Lỗi!', 'Mã xác thực không hợp lệ!', 'error');
            } else {
                Swal.fire('Lỗi!', 'Có lỗi xảy ra!', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setLoading(true);
        const email = localStorage.getItem('email');
        try {
            // If you have a resend code action
            // const response = await dispatch(actions.resendVerificationCode(email));

            // Or make an API call directly
            const response = await axios.post(
                'http://localhost:5000/api/v1/auth/codeChangePass',
                { email }
            );

            if (response.data.err === 0) {
                Swal.fire(
                    'Thành công!',
                    'Mã xác thực mới đã được gửi đến email của bạn!',
                    'success'
                );
                setCountdown(60);
                setCanResend(false);
            } else {
                Swal.fire('Lỗi!', 'Không thể gửi lại mã xác thực!', 'error');
            }
        } catch (error) {
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi lại mã xác thực!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthWrapper>
            <motion.div
                initial={isFirstRender.current ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-7 rounded-xl shadow-2xl w-full max-w-md"
            >
                <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">Nhập mã xác thực</h2>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className={formClasses.inputWrapper}>
                        <div className={formClasses.inputContainer}>
                            <FiMail className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                name="verificationCode"
                                value={verificationCode}
                                onChange={handleChange}
                                className={formClasses.input}
                                placeholder="Nhập mã xác thực"
                            />
                            {invalidFields.find((field) => field.name === 'verificationCode') && (
                                <p className={formClasses.error}>
                                    {
                                        invalidFields.find((field) => field.name === 'verificationCode')
                                            .message
                                    }
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium transform hover:scale-105"
                    >
                        {loading ? 'Đang xác thực...' : 'Xác thực'}
                    </button>
                </form>

                <div className="mt-4 flex items-center justify-between text-gray-600 text-sm">
                    <p className="flex-1">
                        Mã xác thực có hiệu lực trong {countdown} giây
                    </p>
                    <button
                        onClick={handleResendCode}
                        disabled={!canResend || loading}
                        className={`py-2 px-4 rounded-md font-medium shadow-md transition ease-in-out duration-200 ${canResend
                            ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Gửi lại mã
                    </button>
                </div>

                {/* Navigation Link to Go Back */}
                <div className="mt-4 text-center">
                    <span
                        onClick={() => navigate(-1)}
                        className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer transition-colors duration-300"
                    >
                        Quay lại bước trước
                    </span>
                </div>
            </motion.div>
        </AuthWrapper>
    );
};

export default ValidateCode;