// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import Swal from 'sweetalert2';
// import Button from '../../components/Button'; // Giữ lại Button component
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import * as actions from '../../store/actions';
// import { Loading } from '../../components';

// const Verify = () => {
//     const [verificationCode, setVerificationCode] = useState(''); // State để lưu mã xác thực
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const [countdown, setCountdown] = useState(60);
//     const [canResend, setCanResend] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);


//     useEffect(() => {
//         if (countdown > 0) {
//             const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//             return () => clearTimeout(timer);
//         } else {
//             setCanResend(true);
//         }
//     }, [countdown]);

//     // Xử lý sự kiện xác thực
//     const handleVerify = async (e) => {
//         e.preventDefault();

//         const registerData = JSON.parse(localStorage.getItem('registerData'));  // Lấy lại thông tin đăng ký từ localStorage
//         const { email, firstName, lastName, phone, password } = registerData; // Destructure thông tin
//         //console.log('Register Data:', registerData); // Log thông tin đăng ký


//         try {
//             const response = await axios.post(`http://localhost:5000/api/v1/auth/register/${verificationCode}`, {
//                 email, firstName, lastName, phone, password, verificationCode // Gửi toàn bộ dữ liệu cùng mã xác thực
//             });
//             console.log('API Register Response:', response); // Log the response

//             if (response && response.data.err === 0) {
//                 // Dispatch action VERIFY_SUCCESS sau khi xác thực thành công
//                 dispatch({
//                     type: 'VERIFY_SUCCESS',
//                     data: response.data.msg  // Dispatch action VERIFY_SUCCESS
//                 });

//                 // Xóa email khỏi localStorage sau khi xác thực thành công
//                 //localStorage.removeItem('email');

//                 localStorage.removeItem('registerData');  // Xóa dữ liệu tạm khi hoàn thành

//                 Swal.fire('Xác thực thành công !', '', 'success').then(() => {
//                     navigate('/login'); // Chuyển hướng đến trang đăng nhập
//                 });
//             } else {
//                 Swal.fire('Error', response.data.msg, 'error');
//             }
//         } catch (error) {
//             if (error.response?.status === 400) {
//                 Swal.fire('Mã xác thực không đúng !', '', 'error');
//             }
//         }
//     };

//     const handleResendCode = async () => {
//         setIsLoading(true);
//         const registerData = JSON.parse(localStorage.getItem('registerData'));
//         try {
//             const response = await dispatch(actions.register(registerData));
//             if (response && response.err === 0) {
//                 Swal.fire('Success', 'Mã xác thực mới đã được gửi đến email của bạn', 'success');
//                 setCountdown(60);
//                 setCanResend(false);
//             } else {
//                 Swal.fire('', "Lỗi khi gửi lại mã xác thực mới !", 'error');
//             }
//         } catch (error) {
//             const errorMessage = error.response?.message || 'An error occurred';
//             Swal.fire('Oops !', errorMessage, 'error');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     if (isLoading) {
//         return <Loading />;
//     }

//     return (
//         <div className="w-full flex  justify-center bg-gray-100 py-5 ">
//             <div className="bg-white w-[90%] max-w-md p-8 rounded-lg shadow-lg">
//                 <h3 className="font-semibold text-2xl mb-6 text-center text-gray-700">Nhập mã xác thực email</h3>

//                 <form className="w-full flex flex-col gap-6">
//                     {/* Thẻ input trực tiếp */}
//                     <input
//                         type="text"
//                         id="verificationCode"
//                         value={verificationCode}  // Giá trị từ state
//                         onChange={(e) => setVerificationCode(e.target.value)} // Cập nhật giá trị khi người dùng nhập
//                         className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-secondary1 text-gray-700"
//                         placeholder="Nhập mã xác thực"
//                     />

//                     {/* Button để xác minh */}
//                     <Button
//                         text="Xác minh"
//                         bgColor="bg-secondary1"
//                         textColor="text-white"
//                         fullWidth
//                         onClick={handleVerify} // Xử lý sự kiện khi nhấn nút xác minh
//                         className="py-3 rounded-md text-lg font-medium shadow-md hover:bg-secondary2 transition ease-in-out duration-200"
//                     />
//                 </form>

//                 <div className="mt-6 flex items-center justify-between text-gray-600 text-sm">
//                     <p className="flex-1">
//                         Mã xác thực có hiệu lực trong {countdown} giây
//                     </p>
//                     <Button
//                         text="Gửi lại mã"
//                         bgColor="bg-secondary1"
//                         textColor="text-white"
//                         fullWidth={false} // Đặt false để nút vừa đủ kích thước nội dung
//                         onClick={handleResendCode}
//                         disabled={!canResend}
//                         className={`py-2 px-4 rounded-md font-medium shadow-md transition ease-in-out duration-200 ${canResend ? 'hover:bg-secondary2 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'
//                             }`}
//                     />
//                 </div>
//             </div>
//         </div>

//     );
// };

// export default Verify;


import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../components';
import { FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';
import * as actions from '../../store/actions';

// Import your logo asset
import logo from '../../assets/logo.png';

// Common wrapper component for both Login and Register forms
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

// Updated form component structure
const formClasses = {
    inputWrapper: 'min-h-[85px]',
    input:
        'pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300',
    error: 'text-red-500 text-xs mt-1',
    inputContainer: 'relative',
};

const Verify = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [invalidFields, setInvalidFields] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Ref to track the first render for animation
    const isFirstRender = useRef(true);

    useEffect(() => {
        isFirstRender.current = false;
    }, []);

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
        setInvalidFields((prev) =>
            prev.filter((field) => field.name !== 'verificationCode')
        );
    };

    // Handle verification
    const handleVerify = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setInvalidFields([]);

        // Validation
        if (!verificationCode) {
            setInvalidFields([
                { name: 'verificationCode', message: 'Vui lòng nhập mã xác thực' },
            ]);
            return;
        }

        const registerData = JSON.parse(localStorage.getItem('registerData'));
        const { email, firstName, lastName, phone, password } = registerData;

        try {
            const response = await axios.post(
                `http://localhost:5000/api/v1/auth/register/${verificationCode}`,
                {
                    email,
                    firstName,
                    lastName,
                    phone,
                    password,
                    verificationCode,
                }
            );

            if (response && response.data.err === 0) {
                dispatch({
                    type: 'VERIFY_SUCCESS',
                    data: response.data.msg,
                });

                localStorage.removeItem('registerData');

                Swal.fire('Xác thực thành công!', '', 'success').then(() => {
                    navigate('/login');
                });
            } else {
                Swal.fire('Error', response.data.msg, 'error');
            }
        } catch (error) {
            if (error.response?.status === 400) {
                Swal.fire('Mã xác thực không đúng!', '', 'error');
            } else {
                Swal.fire('Oops!', 'Có lỗi xảy ra', 'error');
            }
        }
    };

    const handleResendCode = async () => {
        setIsLoading(true);
        const registerData = JSON.parse(localStorage.getItem('registerData'));
        try {
            const response = await dispatch(actions.register(registerData));
            if (response && response.err === 0) {
                Swal.fire(
                    'Success',
                    'Mã xác thực mới đã được gửi đến email của bạn',
                    'success'
                );
                setCountdown(60);
                setCanResend(false);
            } else {
                Swal.fire('', 'Lỗi khi gửi lại mã xác thực mới!', 'error');
            }
        } catch (error) {
            const errorMessage = error.response?.message || 'An error occurred';
            Swal.fire('Oops!', errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <AuthWrapper>
            <motion.div
                initial={isFirstRender.current ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-7 rounded-xl shadow-2xl w-full max-w-md"
            >
                <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Nhập mã xác thực email
                    </h2>
                </div>

                <form className="space-y-4" onSubmit={handleVerify}>
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
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium transform hover:scale-105"
                    >
                        Xác minh
                    </button>
                </form>

                <div className="mt-4 flex items-center justify-between text-gray-600 text-sm">
                    <p className="flex-1">
                        Mã xác thực có hiệu lực trong {countdown} giây
                    </p>
                    <button
                        onClick={handleResendCode}
                        disabled={!canResend}
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
                        onClick={() => navigate('/register')}
                        className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer transition-colors duration-300"
                    >
                        Quay lại bước trước
                    </span>
                </div>
            </motion.div>
        </AuthWrapper>
    );
};

export default Verify;