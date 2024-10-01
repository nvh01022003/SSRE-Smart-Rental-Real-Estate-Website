import React, { useState, useEffect } from 'react';
import { InputForm, Button } from '../../components';
import { useLocation, useNavigate } from 'react-router-dom';
import * as actions from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';


const Login = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn, msg, update } = useSelector(state => state.auth);
    const [isRegister, setIsRegister] = useState(location.state?.flag);
    const [invalidFields, setInvalidFields] = useState([]);
    const [payload, setPayload] = useState({
        email: '',
        firstName: '',
        lastName: '',
        numberPhone: '',
        password: '',
        codeMail: '',
    });
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [sentVerificationCode, setSentVerificationCode] = useState('');

    useEffect(() => {
        setIsRegister(location.state?.flag);
    }, [location.state?.flag]);

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (msg) {
            Swal.fire('Oops !', msg, 'error');
        }
    }, [msg, update]);


    const validateForm = () => {
        let invalids = 0;
        const newInvalidFields = [];

        if (isRegister) {
            // Validate all fields for registration
            const fields = ['email', 'firstName', 'lastName', 'numberPhone', 'password'];
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

            if (payload.password && payload.password.length < 6) {
                newInvalidFields.push({
                    name: 'password',
                    message: 'Mật khẩu phải có tối thiểu 6 kí tự.'
                });
                invalids++;
            }

            if (payload.numberPhone && !/^\d+$/.test(payload.numberPhone)) {
                newInvalidFields.push({
                    name: 'numberPhone',
                    message: 'Số điện thoại không hợp lệ.'
                });
                invalids++;
            }
        } else {
            // Validate only email and password for login
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

            if (payload.password && payload.password.length < 6) {
                newInvalidFields.push({
                    name: 'password',
                    message: 'Mật khẩu phải có tối thiểu 6 kí tự.'
                });
                invalids++;
            }
        }

        setInvalidFields(newInvalidFields);
        console.log('Invalid Fields:', newInvalidFields); // Debugging log
        return invalids === 0;
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     console.log('Payload:', payload); // Debugging log

    //     if (!validateForm()) {
    //         Swal.fire('Error', 'Please fill in all fields correctly', 'error');
    //         return;
    //     }

    //     try {
    //         const response = isRegister
    //             ? await axios.post('http://localhost:5000/api/v1/auth/register', payload)
    //             : await axios.post('http://localhost:5000/api/v1/auth/login', { email: payload.email, password: payload.password });
    //         console.log(response)
    //         console.log(payload)
    //         if (response && response.data) {
    //             const data = response.data;
    //             console.log('Response Data:', data); // Debugging log



    //             if (data.token) {
    //                 dispatch(actions.loginSuccess(data));
    //                 Swal.fire('Success', 'User logged in successfully', 'success').then(() => {
    //                     navigate('/');
    //                 });
    //             }

    //             else if (isRegister && response.data.err === 0) {
    //                 Swal.fire('Success', 'Verification code sent to your email', 'success').then(() => {
    //                     navigate('/');
    //                 });
    //                 setSentVerificationCode(response.data.verificationCode); // Store the sent verification code
    //                 setIsVerifying(true);
    //                 console.log('Sent Verification Code:', sentVerificationCode); // Debugging log
    //             }
    //             else {
    //                 Swal.fire('Oops !', response.data.message, 'error');
    //             }
    //         } else {
    //             Swal.fire('Oops !', 'No response data', 'error');
    //         }
    //     } catch (error) {
    //         console.error('Error response:', error.response);
    //         const errorMessage = error.response?.data?.message || 'An error occurred';
    //         Swal.fire('Oops !', errorMessage, 'error');
    //     }
    // };



    // const handleSubmit = async () => {
    //     let finalPayload = isRegister ? payload : {
    //         email: payload.email,
    //         firstName: payload.firstName,
    //         lastName: payload.lastName,
    //         numberPhone: payload.numberPhone,
    //         password: payload.password
    //     }
    //     let invalids = validateForm(finalPayload)
    //     console.log(payload)
    //     console.log(invalids)
    //     if (invalids === 0) isRegister ? dispatch(actions.register(payload)) : dispatch(actions.login(payload))
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Payload:', payload); // Debugging log

        if (!validateForm()) {
            Swal.fire('Error', 'Please fill in all fields correctly', 'error');
            return;
        }

        try {
            // Kiểm tra trạng thái isRegister để gọi API đăng kí hoặc đăng nhập
            const response = isRegister
                ? await dispatch(actions.register(payload))  // Gọi action đăng ký
                : await dispatch(actions.login({ email: payload.email, password: payload.password }));  // Gọi action đăng nhập

            console.log('Response:', response); // Debugging log

            if (response && response.data) {   // Bớt tạm && response.data
                const data = response.data;   // check lại thằng này .data nữa
                console.log('Response Data:', data); // Debugging log


                // Xử lý nếu là đăng nhập và có token
                if (data.token) {
                    Swal.fire('Success', 'User logged in successfully', 'success').then(() => {
                        navigate('/');
                    });
                }
                // Xử lý nếu là đăng ký và mã xác thực được gửi thành công
                else if (isRegister && response.data.err === 0) {  // check lại thằng này response nữa
                    Swal.fire('Success', 'Verification code sent to your email', 'success').then(() => {
                        // Lưu email vào localStorage để sử dụng khi xác thực
                        localStorage.setItem('email', payload.email);
                        setIsVerifying(true); // Chuyển sang trạng thái nhập mã xác thực
                    });
                } else {
                    Swal.fire('Oops !', response.data.msg, 'error'); // check lại thằng này response nữa
                }
            } else {
                Swal.fire('Oops !', 'No response data', 'error');
            }
        } catch (error) {
            console.error('Error response:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred';
            Swal.fire('Oops !', errorMessage, 'error');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        // Lưu mã vào localStorage
        localStorage.setItem('verificationCode', verificationCode);
        try {
            const response = await dispatch(actions.register({ codeMail: verificationCode }));

            if (response && response.data.err === 0) {
                Swal.fire('Success', 'Verification successful', 'success').then(() => {
                    // Chuyển đến trang chủ sau khi xác thực thành công
                    navigate('/');
                });
            } else {
                Swal.fire('Error', response.data.msg, 'error');
            }
        } catch (error) {
            console.error('Error response:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred';
            Swal.fire('Oops !', errorMessage, 'error');
        }
    };

    //ádas
    return (
        <div className='w-full flex items-center justify-center'>
            <div className='bg-white w-[600px] p-[30px] pb-[100px] rounded-md shadow-sm'>
                <h3 className='font-semibold text-2xl mb-3'>{isRegister ? 'Đăng kí tài khoản' : 'Đăng nhập'}</h3>
                <form className='w-full flex flex-col gap-5'>
                    {isRegister && (
                        <>
                            <InputForm
                                setInvalidFields={setInvalidFields}
                                invalidFields={invalidFields}
                                label={'HỌ, TÊN ĐỆM'}
                                value={payload.firstName}
                                setValue={setPayload}
                                keyPayload={'firstName'}
                            />
                            <InputForm
                                setInvalidFields={setInvalidFields}
                                invalidFields={invalidFields}
                                label={'TÊN'}
                                value={payload.lastName}
                                setValue={setPayload}
                                keyPayload={'lastName'}
                            />
                            <InputForm
                                setInvalidFields={setInvalidFields}
                                invalidFields={invalidFields}
                                label={'SỐ ĐIỆN THOẠI'}
                                value={payload.numberPhone}
                                setValue={setPayload}
                                keyPayload={'numberPhone'}
                            />
                        </>
                    )}
                    <InputForm
                        setInvalidFields={setInvalidFields}
                        invalidFields={invalidFields}
                        label={'EMAIL'}
                        value={payload.email}
                        setValue={setPayload}
                        keyPayload={'email'}
                    />
                    <InputForm
                        setInvalidFields={setInvalidFields}
                        invalidFields={invalidFields}
                        label={'MẬT KHÂU'}
                        value={payload.password}
                        setValue={setPayload}
                        keyPayload={'password'}
                        type='password'
                    />
                    <Button
                        text={isRegister ? 'Đăng kí' : 'Đăng nhập'}
                        bgColor='bg-secondary1'
                        textColor='text-white'
                        fullWidth
                        onClick={handleSubmit}
                    />
                </form>
                <div className='mt-7 flex items-center justify-between'>
                    {isRegister
                        ? <small>Bạn đã có tài khoản? <span
                            onClick={() => {
                                setIsRegister(false);
                                setPayload({
                                    email: '',
                                    firstName: '',
                                    lastName: '',
                                    numberPhone: '',
                                    password: '',
                                    codeMail: ''
                                });
                            }}
                            className='text-blue-500 hover:underline cursor-pointer'
                        >
                            Đăng nhập ngay
                        </span></small>
                        : <>
                            <small className='text-[blue] hover:text-[red] cursor-pointer'>Bạn quên mật khẩu</small>
                            <small
                                onClick={() => {
                                    setIsRegister(true);
                                    setPayload({
                                        email: '',
                                        firstName: '',
                                        lastName: '',
                                        numberPhone: '',
                                        password: '',
                                        codeMail: ''
                                    });
                                }}
                                className='text-[blue] hover:text-[red] cursor-pointer'
                            >
                                Tạo tài khoản mới
                            </small>
                        </>}
                </div>
            </div>

            {isVerifying && (
                <div className='bg-white w-[600px] p-[30px] pb-[100px] rounded-md shadow-sm'>
                    <h3 className='font-semibold text-2xl mb-3'>Nhập mã xác minh</h3>
                    <form onSubmit={handleVerify} className='w-full flex flex-col gap-5'>
                        <InputForm
                            setInvalidFields={setInvalidFields}
                            invalidFields={invalidFields}
                            label={'Mã xác minh'}
                            value={verificationCode}
                            setValue={setVerificationCode}
                            keyPayload={'verificationCode'}
                        />
                        <Button
                            text={'Xác minh'}
                            bgColor='bg-secondary1'
                            textColor='text-white'
                            fullWidth
                            onClick={handleVerify}
                        />
                    </form>
                </div>
            )}

        </div>
    );
};

export default Login;