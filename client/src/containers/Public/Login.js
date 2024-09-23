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
        password: ''
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Payload:', payload); // Debugging log

        if (!validateForm()) {
            Swal.fire('Error', 'Please fill in all fields correctly', 'error');
            return;
        }

        try {
            const response = isRegister
                ? await axios.post('http://localhost:5000/api/v1/auth/register', payload)
                : await axios.post('http://localhost:5000/api/v1/auth/login', { email: payload.email, password: payload.password });
            console.log(response)

            if (response && response.data) {
                const data = response.data;
                console.log('Response Data:', data); // Debugging log

                if (data.token) {
                    dispatch(actions.loginSuccess(data));
                    Swal.fire('Success', 'User logged in successfully', 'success').then(() => {
                        navigate('/');
                    });
                }
                // else if (data.message === 'User registered successfully') { // test vài bữa sẽ xóa
                //     dispatch(actions.registerSuccess(data));
                //     Swal.fire('Success', 'User registered successfully', 'success').then(() => {
                //         navigate('/');
                //     });
                // }
                else if (isRegister && data.err === 0) {
                    Swal.fire('Success', 'User registered successfully', 'success').then(() => {
                        navigate('/'); // Redirect to login page after successful registration
                    });
                }
                else {
                    Swal.fire('Oops !', data.message, 'error');
                }
            } else {
                Swal.fire('Oops !', 'No response data', 'error');
            }
        } catch (error) {
            console.error('Error response:', error.response);
            const errorMessage = error.response?.data?.message || 'An error occurred';
            Swal.fire('Oops !', errorMessage, 'error');
        }
    };

    return (
        <div className='w-full flex items-center justify-center'>
            <div className='bg-white w-[600px] p-[30px] pb-[100px] rounded-md shadow-sm'>
                <h3 className='font-semibold text-2xl mb-3'>{isRegister ? 'Đăng kí tài khoản' : 'Đăng nhập'}</h3>
                <form onSubmit={handleSubmit} className='w-full flex flex-col gap-5'>
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
                                    password: ''
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
                                        password: ''
                                    });
                                }}
                                className='text-[blue] hover:text-[red] cursor-pointer'
                            >
                                Tạo tài khoản mới
                            </small>
                        </>}
                </div>
            </div>
        </div>
    );
};

export default Login;