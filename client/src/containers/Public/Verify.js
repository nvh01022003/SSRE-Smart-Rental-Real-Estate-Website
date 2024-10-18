import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import Button from '../../components/Button'; // Giữ lại Button component
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Verify = () => {
    const [verificationCode, setVerificationCode] = useState(''); // State để lưu mã xác thực
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Xử lý sự kiện xác thực
    const handleVerify = async (e) => {
        e.preventDefault();

        const registerData = JSON.parse(localStorage.getItem('registerData'));  // Lấy lại thông tin đăng ký từ localStorage
        const { email, firstName, lastName, phone, password } = registerData; // Destructure thông tin
        //console.log('Register Data:', registerData); // Log thông tin đăng ký


        try {
            const response = await axios.post(`http://localhost:5000/api/v1/auth/register/${verificationCode}`, {
                email, firstName, lastName, phone, password, verificationCode // Gửi toàn bộ dữ liệu cùng mã xác thực
            });
            console.log('API Register Response:', response); // Log the response

            if (response && response.data.err === 0) {
                // Dispatch action VERIFY_SUCCESS sau khi xác thực thành công
                dispatch({
                    type: 'VERIFY_SUCCESS',
                    data: response.data.msg  // Dispatch action VERIFY_SUCCESS
                });

                // Xóa email khỏi localStorage sau khi xác thực thành công
                //localStorage.removeItem('email');

                localStorage.removeItem('registerData');  // Xóa dữ liệu tạm khi hoàn thành

                Swal.fire('Success', 'Xác thực thành công', 'success').then(() => {
                    navigate('/login'); // Chuyển hướng đến trang đăng nhập
                });
            } else {
                Swal.fire('Error', response.data.msg, 'error');
            }
        } catch (error) {
            const errorMessage = error.response?.message || 'An error occurded';
            Swal.fire('Oops !', errorMessage, 'error');
        }
    };

    return (
        <div className='w-full flex items-center justify-center'>
            <div className='bg-white w-[500px] p-[10px] pb-[100px] rounded-md shadow-sm'>
                <h3 className='font-semibold text-2xl mb-3'>Nhập mã xác thực email</h3>
                <form className='w-full flex flex-col gap-5'>
                    {/* Thẻ input trực tiếp */}
                    <label htmlFor="verificationCode" className='text-lg font-medium'>Mã xác thực</label>
                    <input
                        type="text"
                        id="verificationCode"
                        value={verificationCode}  // Giá trị từ state
                        onChange={(e) => setVerificationCode(e.target.value)} // Cập nhật giá trị khi người dùng nhập
                        className='border border-gray-300 rounded p-2'
                        placeholder="Nhập mã xác thực"
                    />

                    {/* Button để xác minh */}
                    <Button
                        text={'Xác minh'}
                        bgColor='bg-secondary1'
                        textColor='text-white'
                        fullWidth
                        onClick={handleVerify} // Xử lý sự kiện khi nhấn nút xác minh
                    />
                </form>
            </div>
        </div>
    );
};

export default Verify;
