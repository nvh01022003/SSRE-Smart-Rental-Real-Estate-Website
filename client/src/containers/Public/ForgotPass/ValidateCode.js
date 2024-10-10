import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { path } from '../../../ultils/constant';
import ResetPass from './ResetPass';

const ValidateCode = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCodeValid, setIsCodeValid] = useState(true); // State to track input validation

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const email = localStorage.getItem('email');

        if (!verificationCode) {
            setIsCodeValid(false);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/v1/auth/verifiedMail/${verificationCode}`, {
                email
            });
            console.log('API Validate Code Response:', response); // Debug log
            if (response.status === 200) {
                navigate(path.RESET_PASS);
            }
        } catch (error) {
            //console.log(error);
            if (error.response.status === 400) {
                Swal.fire('Error', 'Mã xác thực không hợp lệ !', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Routes>
            <Route path={path.RESET_PASS} element={<ResetPass />} />
            <Route path="*" element={
                <div className="w-full flex items-center justify-center py-10">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm font-bold">
                        <h2 className="text-2xl mb-4">Nhập mã xác thực</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm mb-2 font-normal" htmlFor="verificationCode">
                                Vui lòng nhập mã xác thực đã được gửi đến email của bạn
                            </label>
                            <input
                                type="text"
                                id="verificationCode"
                                value={verificationCode}
                                onChange={(e) => {
                                    setVerificationCode(e.target.value);
                                    setIsCodeValid(true); // Reset validation state on input change
                                }}
                                required
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-normal ${!isCodeValid ? 'border-red-500' : ''}`}
                            />
                            {!isCodeValid && (
                                <p className="text-red-500 text-xs italic">Mã xác thực không được để trống.</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {loading ? 'Đang xác thực...' : 'Xác thực'}
                        </button>
                    </form>
                </div>
            } />
        </Routes>
    );
};

export default ValidateCode;