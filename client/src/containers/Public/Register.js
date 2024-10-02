import React, { useState, useEffect } from 'react';
import { InputForm, Button } from '../../components';
import { useNavigate } from 'react-router-dom';
import * as actions from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { msg, update } = useSelector(state => state.auth);
    const [payload, setPayload] = useState({
        email: '',
        firstName: '',
        lastName: '',
        numberPhone: '',
        password: '',
    });
    const [invalidFields, setInvalidFields] = useState([]);

    useEffect(() => {
        if (msg) {
            Swal.fire('Oops !', msg, 'error');
        }
    }, [msg, update]);

    const validateForm = () => {
        let invalids = 0;
        const newInvalidFields = [];

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
            const response = await dispatch(actions.register(payload));
            if (response?.err === 0) {
                Swal.fire('Success', 'Mã xác thực đã được gửi đến tài khoản email !', 'success').then(() => {
                    localStorage.setItem('registerData', JSON.stringify(payload));  // Lưu toàn bộ thông tin vào localStorage
                    navigate('/register/verify');
                });
            } else if (response?.err === 1) {
                // Email đã tồn tại
                Swal.fire('Oops!', 'Email đã tồn tại !', 'error');
            } else if (response?.err === 2) {
                // Số điện thoại đã tồn tại
                Swal.fire('Oops!', 'Số điện thoại đã tồn tại !', 'error');
            } else {
                // Xử lý lỗi chung
                Swal.fire('Oops!', response?.msg || 'No response data', 'error');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'An error occurred';
            Swal.fire('Oops !', errorMessage, 'error');
        }
    };

    return (
        <div className='w-full flex items-center justify-center'>
            <div className='bg-white w-[600px] p-[30px] pb-[100px] rounded-md shadow-sm'>
                <h3 className='font-semibold text-2xl mb-3'>Đăng kí tài khoản</h3>
                <form className='w-full flex flex-col gap-5'>
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
                        text={'Đăng kí'}
                        bgColor='bg-secondary1'
                        textColor='text-white'
                        fullWidth
                        onClick={handleSubmit}
                    />
                </form>
                <div className='mt-7 flex items-center justify-between'>
                    <small>Bạn đã có tài khoản? <span
                        onClick={() => navigate('/login')}
                        className='text-blue-500 hover:underline cursor-pointer'
                    >
                        Đăng nhập ngay
                    </span></small>
                </div>
            </div>
        </div>
    );
};

export default Register;