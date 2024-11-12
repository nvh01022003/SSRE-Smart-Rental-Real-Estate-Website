// import React, { useState, useEffect, useContext } from 'react';
// import { InputForm, Button } from '../../components';
// import { useNavigate, Route, Routes } from 'react-router-dom';
// import * as actions from '../../store/actions';
// import { useDispatch, useSelector } from 'react-redux';
// import Swal from 'sweetalert2';
// import { path } from '../../ultils/constant';
// import ForgotPassword from './ForgotPass/ForgotPass';
// import { AuthContext } from '../../../src/Context/AuthContext';


// const Login = () => {

//     const { login } = useContext(AuthContext);

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { isLoggedIn, msg, update } = useSelector(state => state.auth);
//     const [payload, setPayload] = useState({
//         email: '',
//         password: '',
//     });
//     const [invalidFields, setInvalidFields] = useState([]);

//     useEffect(() => {
//         if (isLoggedIn) {
//             navigate('/');
//         }
//     }, [isLoggedIn, navigate]);

//     useEffect(() => {
//         if (msg) {
//             Swal.fire('Oops !', msg, 'error');
//         }
//     }, [msg, update]);

//     const validateForm = () => {
//         let invalids = 0;
//         const newInvalidFields = [];

//         const fields = ['email', 'password'];
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

//         setInvalidFields(newInvalidFields);
//         return invalids === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             return;
//         }

//         try {
//             const response = await dispatch(actions.login(payload)); // Gọi hàm login từ redux action
//             console.log(response); // Log response để kiểm tra
//             if (response?.access_token) {
//                 login(response?.access_token); // Update token in context
//                 navigate('/');
//             } else {
//                 Swal.fire('Oops !', response?.payload?.msg || 'No response data', 'error');
//             }
//         } catch (error) {
//             Swal.fire('Oops !', 'Tài khoản hoặc mật khẩu không đúng !', 'error');
//         }
//     };

//     return (
//         <Routes>
//             <Route path={path.FORGOT_PASS} element={<ForgotPassword />} />
//             <Route path="*" element={
//                 <div className='w-full flex items-center justify-center'>
//                     <div className='bg-white w-[600px] p-[30px] pb-[100px] rounded-md shadow-sm'>
//                         <h3 className='font-semibold text-2xl mb-3'>Đăng nhập</h3>
//                         <form className='w-full flex flex-col gap-5' >
//                             {/* onSubmit={handleSubmit} */}
//                             <InputForm
//                                 setInvalidFields={setInvalidFields}
//                                 invalidFields={invalidFields}
//                                 label={'EMAIL'}
//                                 value={payload.email}
//                                 setValue={setPayload}
//                                 keyPayload={'email'}
//                             />
//                             <InputForm
//                                 setInvalidFields={setInvalidFields}
//                                 invalidFields={invalidFields}
//                                 label={'MẬT KHẨU'}
//                                 value={payload.password}
//                                 setValue={setPayload}
//                                 keyPayload={'password'}
//                                 type='password'
//                             />
//                             <Button
//                                 //type='submit'
//                                 text={'Đăng nhập'}
//                                 bgColor='bg-secondary1'
//                                 textColor='text-white'
//                                 fullWidth
//                                 onClick={handleSubmit}
//                             />
//                         </form>
//                         <div className='mt-7 flex items-center justify-between'>
//                             <small
//                                 onClick={() => navigate(path.FORGOT_PASS)}
//                                 className='text-[blue] hover:text-[red] cursor-pointer'
//                             >
//                                 Bạn quên mật khẩu ?
//                             </small>

//                             <small
//                                 onClick={() => navigate('/register')}
//                                 className='text-[blue] hover:text-[red] cursor-pointer'
//                             >
//                                 Tạo tài khoản mới
//                             </small>
//                         </div>
//                     </div>
//                 </div>
//             } />
//         </Routes>
//     );
// };

// export default Login;
// src/containers/Public/Login.js

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { Loading } from '../../components';
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

const formClasses = {
    inputWrapper: 'min-h-[85px]', // Fixed height container for input + error
    input:
        'pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300',
    error: 'absolute text-red-500 text-xs mt-1',
    inputContainer: 'relative',
};

const Login = () => {
    // Ref to track the first render
    const isFirstRender = useRef(true);

    useEffect(() => {
        isFirstRender.current = false;
    }, []);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [payload, setPayload] = useState({
        email: '',
        password: '',
    });
    const [invalidFields, setInvalidFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        let invalids = 0;
        const newInvalidFields = [];

        const fields = ['email', 'password'];
        fields.forEach(field => {
            if (!payload[field]) {
                newInvalidFields.push({
                    name: field,
                    message: 'Bạn không được bỏ trống trường này.'
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
            const response = await dispatch(actions.login(payload));
            if (response?.err === 0) {
                // Swal.fire('Success', 'Đăng nhập thành công!', 'success').then(() => {
                //     navigate('/');
                // });
                navigate('/');
            } else {
                Swal.fire('Oops!', response?.msg || 'No response data', 'error');
            }
        } catch (error) {
            Swal.fire('Oops !', 'Tài khoản hoặc mật khẩu không đúng !', 'error');
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
                className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
            >
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Đăng Nhập</h2>
                </div>

                <form className="space-y-2" onSubmit={handleSubmit}>
                    <div className={formClasses.inputWrapper}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className={formClasses.inputContainer}>
                            <FiMail className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={payload.email}
                                onChange={handleChange}
                                className={formClasses.input}
                                placeholder="nguyenvana@email.com"
                            />
                            {invalidFields.find(field => field.name === 'email') && (
                                <p className={formClasses.error}>
                                    {invalidFields.find(field => field.name === 'email').message}
                                </p>
                            )}
                        </div>
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

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium transform hover:scale-105"
                    >
                        Đăng nhập
                    </button>

                    {/* Links */}
                    <div className="text-center">
                        <span>
                            Bạn chưa có tài khoản?{' '}
                            <span
                                onClick={() => navigate('/register')}
                                className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer transition-colors duration-300"
                            >
                                Tạo tài khoản mới
                            </span>
                        </span>
                    </div>

                    <div className="text-center">
                        <span
                            onClick={() => navigate('quen-mat-khau')}
                            className='text-blue-600 hover:text-blue-700 hover:underline cursor-pointer  transition-colors duration-300'
                        >
                            Quên mật khẩu?
                        </span>

                    </div>
                </form>
            </motion.div>
        </AuthWrapper>
    );
};

export default Login;