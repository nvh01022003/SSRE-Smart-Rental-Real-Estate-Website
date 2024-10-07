import React, { useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';

const ChangePass = () => {
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [errors, setErrors] = useState({});

    const { token } = useContext(AuthContext);

    const validate = () => {
        const newErrors = {};
        if (!oldPass) {
            newErrors.oldPass = 'Mật khâu hiện tại không được để trống';
        }
        if (!newPass) {
            newErrors.newPass = 'Mật khẩu mới không được để trống';
        } else if (newPass.length < 6) {
            newErrors.newPass = 'Mật khẩu phải từ 6 ký tự trở lên';
        }
        if (newPass === oldPass) {
            newErrors.newPass = 'Mật khẩu mới không được giống mật khẩu hiện tại';
        }
        if (newPass !== confirmPass) {
            newErrors.confirmPass = 'Nhập lại mật khẩu mới không khớp';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        try {
            //const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/v1/auth/changePass', {
                oldPass,
                newPass
            }, {
                headers: {
                    'token': token
                }
            });
            if (response.data.err === 0) {
                Swal.fire('Success', 'Đổi mật khẩu thành công !', 'success');
                setOldPass('');
                setNewPass('');
                setConfirmPass('');
            } else if (response.data.err === 1) {
                Swal.fire('Error', 'Mật khẩu phải từ 6 ký tự trở lên !', 'error');
            } else if (response.data.err === 2) {
                Swal.fire('Error', 'Mật khẩu hiện tại không đúng !', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Đổi mật khẩu không thành công !', 'error');
        }
    };

    return (
        <div className="px-6">
            <h1 className='text-3xl font-medium py-4 border-b border-gray-200'>Đổi mật khẩu</h1>

            <div className="flex justify-center py-8 pr-6">
                <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleSubmit}>
                    {/* <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2> */}
                    <div className="mb-4">
                        <label className="text-sm text-gray-700 font-medium" htmlFor="oldPass">
                            Mật khẩu hiện tại
                        </label>
                        <input
                            type="password"
                            id="oldPass"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={oldPass}
                            onChange={(e) => setOldPass(e.target.value)}
                        />
                        {errors.oldPass && <p className="text-red-500 text-xs italic">{errors.oldPass}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="text-sm text-gray-700 font-medium" htmlFor="newPass">
                            Nhập mật khẩu mới
                        </label>
                        <input
                            type="password"
                            id="newPass"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                        />
                        {errors.newPass && <p className="text-red-500 text-xs italic">{errors.newPass}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="text-sm text-gray-700 font-medium" htmlFor="confirmPass">
                            Nhập lại mật khẩu mới
                        </label>
                        <input
                            type="password"
                            id="confirmPass"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                        />
                        {errors.confirmPass && <p className="text-red-500 text-xs italic">{errors.confirmPass}</p>}
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Đổi mật khẩu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePass;