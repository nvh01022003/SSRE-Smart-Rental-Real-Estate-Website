import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const [invalidFields, setInvalidFields] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/codeChangePass', { email });
            if (response.data.err === 0) {
                Swal.fire('Success', 'Mã xác thực đã được gửi đến email của bạn !', 'success');
            }
            else if (response.data.err === 1) {
                Swal.fire('Error', 'Không tìm thấy tài khoản', 'error');
            }
            else {
                Swal.fire('Error', response.data.msg, 'error');
            }
        } catch (error) {
            Swal.fire('Error', error.response.msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        let invalids = 0;
        const newInvalidFields = [];


        if (!email) {
            newInvalidFields.push({
                name: 'email',
                message: 'Bạn không được bỏ trống email.'
            });
            invalids++;
        }


        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newInvalidFields.push({
                name: 'email',
                message: 'Email không hợp lệ.'
            });
            invalids++;
        }


        setInvalidFields(newInvalidFields);
        return invalids === 0;
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm font-bold">
                <h2 className="text-2xl mb-4">Quên mật khẩu</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm  mb-2 font-normal" htmlFor="email">
                        Vui lòng nhập vào email để gửi mã xác thực
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-normal"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;  