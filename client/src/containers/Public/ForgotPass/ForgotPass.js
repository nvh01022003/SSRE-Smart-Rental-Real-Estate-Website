// import React, { useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { useNavigate, Route, Routes } from 'react-router-dom';
// import ValidateCode from './ValidateCode';
// import { path } from '../../../ultils/constant';

// const ForgotPassword = () => {
//     const [email, setEmail] = useState('');
//     const [loading, setLoading] = useState(false);

//     const navigate = useNavigate();

//     const [invalidFields, setInvalidFields] = useState([]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await axios.post('http://localhost:5000/api/v1/auth/codeChangePass', { email });
//             console.log(response);
//             if (response.data.err === 0) {
//                 Swal.fire('Success', 'Mã xác thực đã được gửi đến email của bạn !', 'success');
//                 localStorage.setItem('email', email);
//                 navigate(path.VALIDATE_CODE);
//             }
//         } catch (error) {
//             //console.log(error);
//             if (error.response.data.err === 1) {
//                 Swal.fire('Error', 'Không tìm thấy tài khoản khớp với email bạn đã nhập !', 'error');
//             }
//             else {
//                 Swal.fire('Error', error.response.data.msg || 'Fail to sent code', 'error');
//             }

//         } finally {
//             setLoading(false);
//         }
//     };

//     const validateForm = () => {
//         let invalids = 0;
//         const newInvalidFields = [];


//         if (!email) {
//             newInvalidFields.push({
//                 name: 'email',
//                 message: 'Bạn không được bỏ trống email.'
//             });
//             invalids++;
//         }


//         if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//             newInvalidFields.push({
//                 name: 'email',
//                 message: 'Email không hợp lệ.'
//             });
//             invalids++;
//         }


//         setInvalidFields(newInvalidFields);
//         return invalids === 0;
//     };

//     return (
//         <Routes>
//             <Route path={path.VALIDATE_CODE} element={<ValidateCode />} />
//             <Route path="*" element={
//                 <div className="w-full flex items-center justify-center py-10 ">
//                     <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm font-bold ">
//                         <h2 className="text-2xl mb-4">Quên mật khẩu</h2>
//                         <div className="mb-4">
//                             <label className="block text-gray-700 text-sm  mb-2 font-normal" htmlFor="email">
//                                 Vui lòng nhập vào email để gửi mã xác thực
//                             </label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-normal"
//                             />
//                         </div>
//                         <button

//                             type="submit"
//                             disabled={loading}
//                             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                         >
//                             {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
//                         </button>
//                     </form>
//                 </div>
//             } />
//         </Routes>
//     );
// };

// export default ForgotPassword;  
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';

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
                    "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3')",
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

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [invalidFields, setInvalidFields] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Ref to track the first render for animation
    const isFirstRender = useRef(true);

    useEffect(() => {
        isFirstRender.current = false;
    }, []);

    const handleChange = (e) => {
        setEmail(e.target.value);

        // Clear the error message for email
        setInvalidFields((prev) => prev.filter((field) => field.name !== 'email'));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setInvalidFields([]);

        // Validate the form
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:5000/api/v1/auth/codeChangePass',
                { email }
            );

            if (response.data.err === 0) {
                // Swal.fire(
                //     'Thành công!',
                //     'Mã xác thực đã được gửi đến email của bạn!',
                //     'success'
                // );
                localStorage.setItem('email', email);
                navigate('verify');
            }
        } catch (error) {
            if (error.response?.data?.err === 1) {
                Swal.fire(
                    'Lỗi!',
                    'Không tìm thấy tài khoản khớp với email bạn đã nhập!',
                    'error'
                );
            } else {
                Swal.fire(
                    'Lỗi!',
                    error.response?.data?.msg || 'Không thể gửi mã xác thực!',
                    'error'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        let invalids = 0;
        const newInvalidFields = [];

        if (!email) {
            newInvalidFields.push({
                name: 'email',
                message: 'Bạn không được bỏ trống email.',
            });
            invalids++;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newInvalidFields.push({
                name: 'email',
                message: 'Email không hợp lệ.',
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
                    <h2 className="text-2xl font-bold text-gray-800">Quên Mật Khẩu</h2>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className={formClasses.inputWrapper}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vui lòng nhập email để nhận mã xác thực
                        </label>
                        <div className={formClasses.inputContainer}>
                            <FiMail className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                className={formClasses.input}
                                placeholder="yourname@example.com"
                            />
                            {invalidFields.find((field) => field.name === 'email') && (
                                <p className={formClasses.error}>
                                    {
                                        invalidFields.find((field) => field.name === 'email')
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
                        {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
                    </button>
                </form>

                {/* Navigation Link to Go Back */}
                <div className="mt-4 text-center">
                    <span
                        onClick={() => navigate('/login')}
                        className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer transition-colors duration-300"
                    >
                        Quay lại đăng nhập
                    </span>
                </div>
            </motion.div>
        </AuthWrapper>
    );
};

export default ForgotPassword;