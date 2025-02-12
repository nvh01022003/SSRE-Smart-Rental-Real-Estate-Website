import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';

// Import your logo asset
import logo from '../../../assets/logo.png';

// AuthWrapper component
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
                <span className="text-3xl font-medium text-white">
                    Smart Rental Real Estate
                </span>
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

const ResetPass = () => {
    // Ref to track the first render for animation
    const isFirstRender = useRef(true);

    useEffect(() => {
        isFirstRender.current = false;
    }, []);
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [invalidFields, setInvalidFields] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        const email = localStorage.getItem('email');

        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/resetPass', {
                email,
                newPass
            });
            if (response.data.err === 0) {
                localStorage.removeItem('email');
                Swal.fire('Success', 'Đặt lại mật khẩu thành công !', 'success').then(() => {
                    navigate('/login');
                });
            } else {
                Swal.fire('Error', response.data.msg, 'error');
            }
        } catch (error) {
            Swal.fire('Error', error.response?.err || 'Something went wrong', 'error');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        let invalids = 0;
        const newInvalidFields = [];

        if (!newPass) {
            newInvalidFields.push({
                name: 'newPass',
                message: 'Mật khẩu không được để trống!'
            });
            invalids++;
        } else if (newPass.length < 6) {
            newInvalidFields.push({
                name: 'newPass',
                message: 'Mật khẩu phải có ít nhất 6 ký tự!'
            });
            invalids++;
        }

        if (!confirmPass) {
            newInvalidFields.push({
                name: 'confirmPass',
                message: 'Xác nhận mật khẩu không được để trống!'
            });
            invalids++;
        } else if (newPass !== confirmPass) {
            newInvalidFields.push({
                name: 'confirmPass',
                message: 'Mật khẩu xác nhận không khớp!'
            });
            invalids++;
        }

        setInvalidFields(newInvalidFields);
        return invalids === 0;
    };

    return (
        <AuthWrapper>
            <motion.div
                initial={isFirstRender.current ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-7 rounded-xl shadow-2xl w-full max-w-md"
            >
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Đặt lại mật khẩu</h2>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className={formClasses.inputWrapper}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                        <div className={formClasses.inputContainer}>
                            <FiLock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="password"
                                name="newPass"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                className={formClasses.input}
                                placeholder="Nhập mật khẩu mới"
                            />
                            {invalidFields.find((field) => field.name === 'newPass') && (
                                <p className={formClasses.error}>
                                    {invalidFields.find((field) => field.name === 'newPass').message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={formClasses.inputWrapper}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                        <div className={formClasses.inputContainer}>
                            <FiLock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="password"
                                name="confirmPass"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                className={formClasses.input}
                                placeholder="Xác nhận mật khẩu"
                            />
                            {invalidFields.find((field) => field.name === 'confirmPass') && (
                                <p className={formClasses.error}>
                                    {invalidFields.find((field) => field.name === 'confirmPass').message}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium transform hover:scale-105"
                    >
                        {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                    </button>
                </form>
            </motion.div>
        </AuthWrapper>
    );
};

export default ResetPass;