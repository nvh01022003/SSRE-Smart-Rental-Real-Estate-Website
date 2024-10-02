// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import Swal from 'sweetalert2';
// import InputForm from '../../components/InputForm';
// import Button from '../../components/Button';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Verify = () => {
//     const [verificationCode, setVerificationCode] = useState('');
//     const [invalidFields, setInvalidFields] = useState([]);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const handleVerify = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axios.post(`http://localhost:5000/api/v1/auth/register/${verificationCode}`);

//             if (response && response.data.err === 0) {
//                 Swal.fire('Success', 'Verification successful', 'success').then(() => {
//                     navigate('/');
//                 });
//             } else {
//                 Swal.fire('Error', response.data.msg, 'error');
//             }
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || 'An error occurred';
//             Swal.fire('Oops !', errorMessage, 'error');
//         }
//     };

//     return (
//         <div className='w-full flex items-center justify-center'>
//             <div className='bg-white w-[500px] p-[10px] pb-[100px] rounded-md shadow-sm'>
//                 <h3 className='font-semibold text-2xl mb-3'>Nhập mã xác thực email</h3>
//                 <form onSubmit={handleVerify} className='w-full flex flex-col gap-5'>
//                     <InputForm
//                         setInvalidFields={setInvalidFields}
//                         invalidFields={invalidFields}
//                         label={'Mã xác thực'}
//                         value={verificationCode}
//                         setValue={setVerificationCode}
//                         keyPayload={'verificationCode'}
//                     />
//                     <Button
//                         text={'Xác minh'}
//                         bgColor='bg-secondary1'
//                         textColor='text-white'
//                         fullWidth
//                         onClick={handleVerify}
//                     />
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Verify;

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
        const { email, firstName, lastName, numberPhone, password } = registerData; // Destructure thông tin


        try {
            const response = await axios.post(`http://localhost:5000/api/v1/auth/register/${verificationCode}`, {
                email, firstName, lastName, numberPhone, password, verificationCode  // Gửi toàn bộ dữ liệu cùng mã xác thực
            });
            console.log('API Register Response:', response); // Log the response

            if (response && response.status === 200) {
                // Dispatch action VERIFY_SUCCESS sau khi xác thực thành công
                dispatch({
                    type: 'VERIFY_SUCCESS',  // Dispatch action VERIFY_SUCCESS
                });

                // Xóa email khỏi localStorage sau khi xác thực thành công
                //localStorage.removeItem('email');

                localStorage.removeItem('registerData');  // Xóa dữ liệu tạm khi hoàn thành

                Swal.fire('Success', 'Xác thực thành công', 'success').then(() => {
                    navigate('/');
                });
            } else {
                Swal.fire('Error', response.msg, 'error');
            }
        } catch (error) {
            const errorMessage = error.response?.message || 'An error ';
            Swal.fire('Oops !', errorMessage, 'error');
        }
    };

    return (
        <div className='w-full flex items-center justify-center'>
            <div className='bg-white w-[500px] p-[10px] pb-[100px] rounded-md shadow-sm'>
                <h3 className='font-semibold text-2xl mb-3'>Nhập mã xác thực email</h3>
                <form onSubmit={handleVerify} className='w-full flex flex-col gap-5'>
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
