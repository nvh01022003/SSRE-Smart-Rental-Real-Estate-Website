// import React, { useState, useEffect } from 'react';
// import { InputForm, Button } from '../../components';
// import { useNavigate } from 'react-router-dom';
// import * as actions from '../../store/actions';
// import { useDispatch, useSelector } from 'react-redux';
// import Swal from 'sweetalert2';
// import { Loading } from '../../components';
// const Register = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { msg, update } = useSelector(state => state.auth);
//     const [payload, setPayload] = useState({
//         email: '',
//         firstName: '',
//         lastName: '',
//         phone: '',
//         password: '',
//     });
//     const [invalidFields, setInvalidFields] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);



//     useEffect(() => {
//         if (msg) {
//             Swal.fire('Oops !', msg, 'error');
//         }
//     }, [msg, update]);

//     const validateForm = () => {
//         let invalids = 0;
//         const newInvalidFields = [];

//         const fields = ['email', 'firstName', 'lastName', 'phone', 'password'];
//         fields.forEach(field => {
//             if (!payload[field]) {
//                 newInvalidFields.push({
//                     name: field,
//                     message: 'Bạn không được bỏ trống trường này.'
//                 });
//                 invalids++;
//             }
//         });

//         if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
//             newInvalidFields.push({
//                 name: 'email',
//                 message: 'Email không hợp lệ.'
//             });
//             invalids++;
//         }

//         if (payload.password && payload.password.length < 6) {
//             newInvalidFields.push({
//                 name: 'password',
//                 message: 'Mật khẩu phải có tối thiểu 6 kí tự.'
//             });
//             invalids++;
//         }

//         if (payload.phone && !/^\d{10}$/.test(payload.phone)) {
//             newInvalidFields.push({
//                 name: 'phone',
//                 message: 'Số điện thoại không hợp lệ.'
//             });
//             invalids++;
//         }

//         setInvalidFields(newInvalidFields);
//         return invalids === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             return;
//         }

//         setIsLoading(true);

//         try {
//             const response = await dispatch(actions.register(payload));
//             if (response?.err === 0) {
//                 Swal.fire('Success', 'Mã xác thực đã được gửi đến tài khoản email !', 'success').then(() => {
//                     localStorage.setItem('registerData', JSON.stringify(payload));  // Lưu toàn bộ thông tin vào localStorage
//                     navigate('/register/verify');
//                 });
//             } else {
//                 Swal.fire('Oops!', response?.msg || 'No response data', 'error');
//             }
//         } catch (error) {
//             if (error.err === 1) {
//                 Swal.fire('Oops !', 'Email đã được sử dụng', 'error');
//             } else if (error.err === 2) {
//                 Swal.fire('Oops !', 'Số điện thoại đã được sử dụng', 'error');
//             } else {
//                 Swal.fire('Oops !', 'Đã có lỗi xảy ra', 'error');
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     };


//     if (isLoading) {
//         return <Loading />;
//     }

//     return (
//         <div className='w-full flex items-center justify-center'>
//             <div className='bg-white w-[600px] p-[30px] pb-[100px] rounded-md shadow-sm'>
//                 <h3 className='font-semibold text-2xl mb-3'>Đăng kí tài khoản</h3>

//                 <form className='w-full flex flex-col gap-5'>
//                     <InputForm
//                         setInvalidFields={setInvalidFields}
//                         invalidFields={invalidFields}
//                         label={'HỌ, TÊN ĐỆM'}
//                         value={payload.firstName}
//                         setValue={setPayload}
//                         keyPayload={'firstName'}
//                     />
//                     <InputForm
//                         setInvalidFields={setInvalidFields}
//                         invalidFields={invalidFields}
//                         label={'TÊN'}
//                         value={payload.lastName}
//                         setValue={setPayload}
//                         keyPayload={'lastName'}
//                     />
//                     <InputForm
//                         setInvalidFields={setInvalidFields}
//                         invalidFields={invalidFields}
//                         label={'SỐ ĐIỆN THOẠI'}
//                         value={payload.phone}
//                         setValue={setPayload}
//                         keyPayload={'phone'}
//                     />
//                     <InputForm
//                         setInvalidFields={setInvalidFields}
//                         invalidFields={invalidFields}
//                         label={'EMAIL'}
//                         value={payload.email}
//                         setValue={setPayload}
//                         keyPayload={'email'}
//                     />
//                     <InputForm
//                         setInvalidFields={setInvalidFields}
//                         invalidFields={invalidFields}
//                         label={'MẬT KHẨU'}
//                         value={payload.password}
//                         setValue={setPayload}
//                         keyPayload={'password'}
//                         type='password'
//                     />
//                     <Button
//                         text={'Đăng kí'}
//                         bgColor='bg-secondary1'
//                         textColor='text-white'
//                         fullWidth
//                         onClick={handleSubmit}
//                     />
//                 </form>
//                 <div className='mt-7 flex items-center justify-between'>
//                     <small>Bạn đã có tài khoản? <span
//                         onClick={() => navigate('/login')}
//                         className='text-blue-500 hover:underline cursor-pointer'
//                     >
//                         Đăng nhập ngay
//                     </span></small>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Register;


import React, { useState } from 'react';
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import * as actions from '../../store/actions';
import logo from '../../assets/logo.png';
import { motion } from 'framer-motion';

// Common wrapper component for both Login and Register forms
const AuthWrapper = ({ children }) => {
    // Import navigate if it's used here
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

const formClasses = {
    inputWrapper: 'min-h-[85px]', // Fixed height container for input + error
    input:
        'pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300',
    error: 'absolute text-red-500 text-xs mt-1',
    inputContainer: 'relative',
};

const Register = () => {
    // Ref to track the first render
    const isFirstRender = useRef(true);

    useEffect(() => {
        isFirstRender.current = false;
    }, []);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [payload, setPayload] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [invalidFields, setInvalidFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        let invalids = 0;
        const newInvalidFields = [];

        const fields = ['email', 'firstName', 'lastName', 'phone', 'password', 'confirmPassword'];
        fields.forEach(field => {
            if (!payload[field]) {
                newInvalidFields.push({
                    name: field,
                    message: 'Không để trống.'
                });
                invalids++;
            }
        });

        if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
            newInvalidFields.push({
                name: 'email',
                message: 'Email không hợp lệ.'
            });
            invalids++;
        }

        if (payload.password && payload.password.length < 6) {
            newInvalidFields.push({
                name: 'password',
                message: 'Mật khẩu phải có tối thiểu 6 kí tự.'
            });
            invalids++;
        }

        if (payload.password !== payload.confirmPassword) {
            newInvalidFields.push({
                name: 'confirmPassword',
                message: 'Mật khẩu không khớp.'
            });
            invalids++;
        }

        if (payload.phone && !/^\d{10}$/.test(payload.phone)) {
            newInvalidFields.push({
                name: 'phone',
                message: 'Số điện thoại không hợp lệ.'
            });
            invalids++;
        }

        setInvalidFields(newInvalidFields);
        return invalids === 0;
    };

    const handleChange = (e) => {
        setPayload({ ...payload, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await dispatch(actions.register(payload));
            if (response?.err === 0) {
                Swal.fire('', 'Mã xác thực đã được gửi đến tài khoản email!', 'success').then(() => {
                    localStorage.setItem('registerData', JSON.stringify(payload));
                    navigate('/register/verify');
                });
            } else {
                Swal.fire('Oops!', response?.msg || 'No response data', 'error');
            }
        } catch (error) {
            if (error.err === 1) {
                Swal.fire('Oops!', 'Email đã được sử dụng', 'error');
            } else if (error.err === 2) {
                Swal.fire('Oops!', 'Số điện thoại đã được sử dụng', 'error');
            } else {
                Swal.fire('Oops!', 'Đã có lỗi xảy ra', 'error');
            }
        } finally {
            setIsLoading(false);
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
                    <h2 className="text-2xl font-bold text-gray-800">Đăng Kí Tài Khoản</h2>
                </div>

                <form className="space-y-2" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row md:space-x-2">
                        <div className={formClasses.inputWrapper}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
                            <div className={formClasses.inputContainer}>
                                <FiUser className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="firstName"
                                    value={payload.firstName}
                                    onChange={handleChange}
                                    className={formClasses.input}
                                    placeholder="Nguyễn Văn"
                                />
                                {invalidFields.find(field => field.name === 'firstName') && (
                                    <p className={formClasses.error}>
                                        {invalidFields.find(field => field.name === 'firstName').message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 mt-4 md:mt-0">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={payload.lastName}
                                    onChange={handleChange}
                                    className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                    placeholder="A"
                                />
                            </div>
                            {invalidFields.find(field => field.name === 'lastName') && (
                                <p className="text-red-500 text-xs mt-1">
                                    {invalidFields.find(field => field.name === 'lastName').message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <div className="relative">
                            <FiPhone className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={payload.phone}
                                onChange={handleChange}
                                className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="0123456789"
                            />
                        </div>
                        {invalidFields.find(field => field.name === 'phone') && (
                            <p className="text-red-500 text-xs mt-1">
                                {invalidFields.find(field => field.name === 'phone').message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={payload.email}
                                onChange={handleChange}
                                className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="nguyenvana@email.com"
                            />
                        </div>
                        {invalidFields.find(field => field.name === 'email') && (
                            <p className="text-red-500 text-xs mt-1">
                                {invalidFields.find(field => field.name === 'email').message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                value={payload.password}
                                onChange={handleChange}
                                className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="********"
                            />
                        </div>
                        {invalidFields.find(field => field.name === 'password') && (
                            <p className="text-red-500 text-xs mt-1">
                                {invalidFields.find(field => field.name === 'password').message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={payload.confirmPassword}
                                onChange={handleChange}
                                className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="********"
                            />
                        </div>
                        {invalidFields.find(field => field.name === 'confirmPassword') && (
                            <p className="text-red-500 text-xs mt-1">
                                {invalidFields.find(field => field.name === 'confirmPassword').message}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium transform hover:scale-105"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng kí'}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-4 text-center">
                    <span>Bạn đã có tài khoản? </span>
                    <span
                        onClick={() => navigate('/login')}
                        className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer transition-colors duration-300"
                    >
                        Đăng nhập ngay
                    </span>
                </div>
            </motion.div>
        </AuthWrapper>
    );
};

export default Register;