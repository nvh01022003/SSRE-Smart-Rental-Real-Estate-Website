// import React, { useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';
// import { path } from '../../../ultils/constant';

// const ResetPass = () => {
//     const [newPass, setNewPass] = useState('');
//     const [confirmPass, setConfirmPass] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         const email = localStorage.getItem('email');

//         if (!newPass || !confirmPass) {
//             Swal.fire('Error', 'Mật khẩu không được để trống!', 'error');
//             setLoading(false);
//             return;
//         }

//         if (newPass.length < 6) {
//             Swal.fire('Error', 'Mật khẩu phải có ít nhất 6 ký tự!', 'error');
//             setLoading(false);
//             return;
//         }

//         if (newPass !== confirmPass) {
//             Swal.fire('Error', 'Mật khẩu xác nhận không khớp!', 'error');
//             setLoading(false);
//             return;
//         }

//         try {
//             const response = await axios.post('http://localhost:5000/api/v1/auth/resetPass', {
//                 email,
//                 newPass
//             });
//             if (response.data.err === 0) {
//                 Swal.fire('Success', 'Đặt lại mật khẩu thành công !', 'success').then(() => {
//                     navigate(path.LOGIN);
//                 });
//             } else {
//                 Swal.fire('Error', response.data.msg, 'error');
//             }
//         } catch (error) {
//             Swal.fire('Error', error.response?.err || 'Something went wrong', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="w-full flex items-center justify-center py-10">
//             <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm font-bold">
//                 <h2 className="text-2xl mb-4">Đặt lại mật khẩu</h2>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm mb-2 font-normal" htmlFor="newPass">
//                         Mật khẩu mới
//                     </label>
//                     <input
//                         type="password"
//                         id="newPass"
//                         value={newPass}
//                         onChange={(e) => setNewPass(e.target.value)}
//                         required
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-normal"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm mb-2 font-normal" htmlFor="confirmPass">
//                         Xác nhận mật khẩu
//                     </label>
//                     <input
//                         type="password"
//                         id="confirmPass"
//                         value={confirmPass}
//                         onChange={(e) => setConfirmPass(e.target.value)}
//                         required
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-normal"
//                     />
//                 </div>
//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                 >
//                     {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default ResetPass;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ResetPass = () => {
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [invalidFields, setInvalidFields] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        const email = localStorage.getItem('email');

        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/resetPass', {
                email,
                newPass
            });
            if (response.data.err === 0) {
                localStorage.removeItem('email');
                Swal.fire('Success', 'Đặt lại mật khẩu thành công !', 'success').then(() => {
                    navigate('/login');
                });
            } else {
                Swal.fire('Error', response.data.msg, 'error');
            }
        } catch (error) {
            Swal.fire('Error', error.response?.err || 'Something went wrong', 'error');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        let invalids = 0;
        const newInvalidFields = [];

        if (!newPass) {
            newInvalidFields.push({
                name: 'newPass',
                message: 'Mật khẩu không được để trống!'
            });
            invalids++;
        } else if (newPass.length < 6) {
            newInvalidFields.push({
                name: 'newPass',
                message: 'Mật khẩu phải có ít nhất 6 ký tự!'
            });
            invalids++;
        }

        if (!confirmPass) {
            newInvalidFields.push({
                name: 'confirmPass',
                message: 'Xác nhận mật khẩu không được để trống!'
            });
            invalids++;
        } else if (newPass !== confirmPass) {
            newInvalidFields.push({
                name: 'confirmPass',
                message: 'Mật khẩu xác nhận không khớp!'
            });
            invalids++;
        }

        setInvalidFields(newInvalidFields);
        return invalids === 0;
    };

    return (
        <div className="w-full flex items-center justify-center py-10">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm font-bold">
                <h2 className="text-2xl mb-4">Đặt lại mật khẩu</h2>
                {invalidFields.some(field => field.name === 'form') && (
                    <div className="text-red-500 mb-4">
                        {invalidFields.find(field => field.name === 'form').message}
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-2 font-normal" htmlFor="newPass">
                        Mật khẩu mới
                    </label>
                    <input
                        type="password"
                        id="newPass"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        required
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-normal ${invalidFields.some(field => field.name === 'newPass') ? 'border-red-500' : ''}`}
                    />
                    {invalidFields.some(field => field.name === 'newPass') && (
                        <div className="text-red-500 text-sm mt-1">
                            {invalidFields.find(field => field.name === 'newPass').message}
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-2 font-normal" htmlFor="confirmPass">
                        Xác nhận mật khẩu
                    </label>
                    <input
                        type="password"
                        id="confirmPass"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        required
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-normal ${invalidFields.some(field => field.name === 'confirmPass') ? 'border-red-500' : ''}`}
                    />
                    {invalidFields.some(field => field.name === 'confirmPass') && (
                        <div className="text-red-500 text-sm mt-1">
                            {invalidFields.find(field => field.name === 'confirmPass').message}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                </button>
            </form>
        </div>
    );
};

export default ResetPass;