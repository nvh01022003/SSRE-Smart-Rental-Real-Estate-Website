import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import Button from '../../components/Button'; // Giữ lại Button component
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as actions from '../../store/actions';
import { Loading } from '../../components';

const Verify = () => {
    const [verificationCode, setVerificationCode] = useState(''); // State để lưu mã xác thực
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

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

                Swal.fire('Xác thực thành công !', '', 'success').then(() => {
                    navigate('/login'); // Chuyển hướng đến trang đăng nhập
                });
            } else {
                Swal.fire('Error', response.data.msg, 'error');
            }
        } catch (error) {
            if (error.response?.status === 400) {
                Swal.fire('Mã xác thực không đúng !', '', 'error');
            }
        }
    };

    const handleResendCode = async () => {
        setIsLoading(true);
        const registerData = JSON.parse(localStorage.getItem('registerData'));
        try {
            const response = await dispatch(actions.register(registerData));
            if (response && response.err === 0) {
                Swal.fire('Success', 'Mã xác thực mới đã được gửi đến email của bạn', 'success');
                setCountdown(60);
                setCanResend(false);
            } else {
                Swal.fire('', "Lỗi khi gửi lại mã xác thực mới !", 'error');
            }
        } catch (error) {
            const errorMessage = error.response?.message || 'An error occurred';
            Swal.fire('Oops !', errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="w-full flex  justify-center bg-gray-100 py-5 ">
            <div className="bg-white w-[90%] max-w-md p-8 rounded-lg shadow-lg">
                <h3 className="font-semibold text-2xl mb-6 text-center text-gray-700">Nhập mã xác thực email</h3>

                <form className="w-full flex flex-col gap-6">
                    {/* Thẻ input trực tiếp */}
                    <input
                        type="text"
                        id="verificationCode"
                        value={verificationCode}  // Giá trị từ state
                        onChange={(e) => setVerificationCode(e.target.value)} // Cập nhật giá trị khi người dùng nhập
                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-secondary1 text-gray-700"
                        placeholder="Nhập mã xác thực"
                    />

                    {/* Button để xác minh */}
                    <Button
                        text="Xác minh"
                        bgColor="bg-secondary1"
                        textColor="text-white"
                        fullWidth
                        onClick={handleVerify} // Xử lý sự kiện khi nhấn nút xác minh
                        className="py-3 rounded-md text-lg font-medium shadow-md hover:bg-secondary2 transition ease-in-out duration-200"
                    />
                </form>

                <div className="mt-6 flex items-center justify-between text-gray-600 text-sm">
                    <p className="flex-1">
                        Mã xác thực có hiệu lực trong {countdown} giây
                    </p>
                    <Button
                        text="Gửi lại mã"
                        bgColor="bg-secondary1"
                        textColor="text-white"
                        fullWidth={false} // Đặt false để nút vừa đủ kích thước nội dung
                        onClick={handleResendCode}
                        disabled={!canResend}
                        className={`py-2 px-4 rounded-md font-medium shadow-md transition ease-in-out duration-200 ${canResend ? 'hover:bg-secondary2 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    />
                </div>
            </div>
        </div>

    );
};

export default Verify;
