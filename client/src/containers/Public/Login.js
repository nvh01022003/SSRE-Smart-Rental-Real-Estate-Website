import React, { useState, useEffect, useContext } from 'react';
import { InputForm, Button } from '../../components';
import { useNavigate, Route, Routes } from 'react-router-dom';
import * as actions from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { path } from '../../ultils/constant';
import ForgotPassword from './ForgotPass/ForgotPass';
import { AuthContext } from '../../../src/Context/AuthContext';


const Login = () => {

    const { login } = useContext(AuthContext);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn, msg, update } = useSelector(state => state.auth);
    const [payload, setPayload] = useState({
        email: '',
        password: '',
    });
    const [invalidFields, setInvalidFields] = useState([]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await dispatch(actions.login(payload)); // Gọi hàm login từ redux action
            console.log(response); // Log response để kiểm tra
            if (response?.access_token) {
                login(response?.access_token); // Update token in context
                navigate('/');
            } else {
                Swal.fire('Oops !', response?.payload?.msg || 'No response data', 'error');
            }
        } catch (error) {
            Swal.fire('Oops !', 'Tài khoản hoặc mật khẩu không đúng !', 'error');
        }
    };

    return (
        <Routes>
            <Route path={path.FORGOT_PASS} element={<ForgotPassword />} />
            <Route path="*" element={
                <div className='w-full flex items-center justify-center'>
                    <div className='bg-white w-[600px] p-[30px] pb-[100px] rounded-md shadow-sm'>
                        <h3 className='font-semibold text-2xl mb-3'>Đăng nhập</h3>
                        <form className='w-full flex flex-col gap-5' >
                            {/* onSubmit={handleSubmit} */}
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
                                label={'MẬT KHẨU'}
                                value={payload.password}
                                setValue={setPayload}
                                keyPayload={'password'}
                                type='password'
                            />
                            <Button
                                //type='submit'
                                text={'Đăng nhập'}
                                bgColor='bg-secondary1'
                                textColor='text-white'
                                fullWidth
                                onClick={handleSubmit}
                            />
                        </form>
                        <div className='mt-7 flex items-center justify-between'>
                            <small
                                onClick={() => navigate(path.FORGOT_PASS)}
                                className='text-[blue] hover:text-[red] cursor-pointer'
                            >
                                Bạn quên mật khẩu ?
                            </small>

                            <small
                                onClick={() => navigate('/register')}
                                className='text-[blue] hover:text-[red] cursor-pointer'
                            >
                                Tạo tài khoản mới
                            </small>
                        </div>
                    </div>
                </div>
            } />
        </Routes>
    );
};

export default Login;
