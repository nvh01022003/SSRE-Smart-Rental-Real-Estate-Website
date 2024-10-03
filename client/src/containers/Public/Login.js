import React, { useState, useEffect } from 'react';
import { InputForm, Button } from '../../components';
import { useNavigate } from 'react-router-dom';
import * as actions from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const Login = () => {
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

        // if (payload.password && payload.password.length < 6) {
        //     newInvalidFields.push({
        //         name: 'password',
        //         message: 'Mật khẩu phải có tối thiểu 6 kí tự.'
        //     });
        //     invalids++;
        // }

        setInvalidFields(newInvalidFields);
        return invalids === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            Swal.fire('Error', 'Please fill in all fields correctly', 'error');
            return;
        }

        try {
            const response = await dispatch(actions.login(payload)); // Gọi hàm login từ redux action
            console.log(response); // Log response để kiểm tra
            if (response?.access_token) {
                localStorage.setItem('token', response.access_token);

                Swal.fire('Success', 'Đăng nhập thành công !', 'success').then(() => {
                    navigate('/');
                });
            } else {
                Swal.fire('Oops !', response?.payload?.msg || 'No response data', 'error');
            }
        } catch (error) {
            // Bắt và xử lý lỗi từ backend, ví dụ lỗi "Email does not exist"
            Swal.fire('Oops!', error.msg || 'Something went wrong', 'error');  // Hiển thị lỗi từ server
        }
    };

    return (
        <div className='w-full flex items-center justify-center'>
            <div className='bg-white w-[600px] p-[30px] pb-[100px] rounded-md shadow-sm'>
                <h3 className='font-semibold text-2xl mb-3'>Đăng nhập</h3>
                <form className='w-full flex flex-col gap-5'>
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
                        text={'Đăng nhập'}
                        bgColor='bg-secondary1'
                        textColor='text-white'
                        fullWidth
                        onClick={handleSubmit}
                    />
                </form>
                <div className='mt-7 flex items-center justify-between'>
                    <small className='text-[blue] hover:text-[red] cursor-pointer'>Bạn quên mật khẩu</small>
                    <small
                        onClick={() => navigate('/register')}
                        className='text-[blue] hover:text-[red] cursor-pointer'
                    >
                        Tạo tài khoản mới
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Login;