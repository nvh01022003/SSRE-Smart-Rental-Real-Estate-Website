import React, { useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';
import { Breadcrumb } from '../../components';

const ChangePass = () => {
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [errors, setErrors] = useState({});
    const breadcrumbItems = [];
    const { token } = useContext(AuthContext);

    const validate = () => {
        const newErrors = {};
        if (!oldPass) {
            newErrors.oldPass = 'Mật khẩu hiện tại không được để trống';
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
        <div className="px-4 md:px-6 lg:px-8 max-w-lg mx-auto">
            <Breadcrumb items={breadcrumbItems} />
            <div className="bg-white shadow-md rounded-lg p-6 shadow mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center py-4 border-b border-gray-200">
                    Đổi mật khẩu 🔒
                </h1>

                <div className="flex justify-center py-10 md:py-12">
                    <form
                        className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md"
                        onSubmit={handleSubmit}
                    >
                        <div className="mb-12 md:mb-6 relative">
                            <label
                                className="text-sm md:text-xl text-gray-700 font-medium"
                                htmlFor="oldPass"
                            >
                                Mật khẩu hiện tại
                            </label>
                            <input
                                type="password"
                                id="oldPass"
                                className="border border-gray-300 rounded-lg w-full py-3 px-4 mt-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                                value={oldPass}
                                onChange={(e) => setOldPass(e.target.value)}
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                            {errors.oldPass && (
                                <p className="text-red-500 text-sm absolute top-full left-0 mt-1">{errors.oldPass}</p>
                            )}
                        </div>

                        <div className="mb-12 md:mb-6 relative">
                            <label
                                className="text-sm md:text-xl text-gray-700 font-medium"
                                htmlFor="newPass"
                            >
                                Nhập mật khẩu mới
                            </label>
                            <input
                                type="password"
                                id="newPass"
                                className="border border-gray-300 rounded-lg w-full py-3 px-4 mt-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                            />
                            {errors.newPass && (
                                <p className="text-red-500 text-sm absolute top-full left-0 mt-1">{errors.newPass}</p>
                            )}
                        </div>

                        <div className="mb-12 md:mb-6 relative">
                            <label
                                className="text-sm md:text-xl text-gray-700 font-medium"
                                htmlFor="confirmPass"
                            >
                                Nhập lại mật khẩu mới
                            </label>
                            <input
                                type="password"
                                id="confirmPass"
                                className="border border-gray-300 rounded-lg w-full py-3 px-4 mt-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            {errors.confirmPass && (
                                <p className="text-red-500 text-sm absolute top-full left-0 mt-1">{errors.confirmPass}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-center mt-14 md:mt-10">
                            <button
                                type="submit"
                                className="text-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 w-full md:w-auto"
                            >
                                Đổi mật khẩu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePass;


