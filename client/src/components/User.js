// import React, { useEffect, useState } from 'react';
// import anonAvatar from '../assets/anon-avatar.png';
// import { useSelector } from 'react-redux';

// const User = () => {
//     const [currentData, setCurrentData] = useState(null);
//     const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Lấy isLoggedIn từ redux store

//     useEffect(() => {
//         // Chỉ thực hiện khi isLoggedIn = true
//         if (isLoggedIn) {
//             // Trì hoãn 1 giây để đảm bảo dữ liệu đã được lưu vào localStorage
//             const timer = setTimeout(() => {
//                 const storedUser = localStorage.getItem('user');
//                 if (storedUser) {
//                     setCurrentData(JSON.parse(storedUser)); // Chuyển đổi JSON thành object
//                 }
//             }, 1); // Trì hoãn 0.001 giây

//             return () => clearTimeout(timer); // Dọn dẹp timeout khi component unmount hoặc trước khi thực hiện lại
//         }
//     }, [isLoggedIn]); // useEffect phụ thuộc vào isLoggedIn

//     if (!currentData) {
//         return (
//             <div className='flex items-center gap-2'>
//                 <img src={anonAvatar} alt="avatar" className='w-10 object-cover rounded-full h-10 border-2 shadow-md border-white' />
//                 <div className='flex flex-col'>
//                     <span>Đang tải...</span>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className='flex items-center gap-2'>
//             <img src={currentData.img_avt || anonAvatar} alt="avatar" className='w-12 object-cover rounded-full h-12 border-2 shadow-md border-white' />
//             <div >
//                 Xin chào,
//                 <div className='font-semibold'>{`${currentData.firstName} ${currentData.lastName}`}</div>
//             </div>
//         </div>
//     );
// };

// export default User;

import React, { useEffect, useState, useContext } from 'react';
import anonAvatar from '../assets/anon-avatar.png';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { AuthContext } from '../../src/Context/AuthContext';

const User = () => {
    //const dispatch = useDispatch();
    const [currentData, setCurrentData] = useState(null);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Lấy isLoggedIn từ redux store

    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                //const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/v1/user/showInfo', {
                    headers: {
                        'token': `${token}`
                    }
                });
                if (response.data.err === 0) {
                    setCurrentData(response.data.info_user);
                } else {
                    console.error('Error fetching personal information:', response.data.msg);
                }
            } catch (error) {
                console.error('Error fetching personal information:', error);
            }
        };

        if (isLoggedIn) {
            fetchPersonalInfo();
        }
    }, [isLoggedIn]);

    if (!currentData) {
        return (
            <div className='flex items-center gap-2'>
                <img src={anonAvatar} alt="avatar" className='w-10 object-cover rounded-full h-10 border-2 shadow-md border-white' />
                <div className='flex flex-col'>
                    <span>Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <div className='flex items-center gap-2'>
            <img src={currentData.img_avt || anonAvatar} alt="avatar" className='w-12 object-cover rounded-full h-12 border-2 shadow-md border-white' />
            <div>
                Xin chào,
                <div className='font-semibold'>{`${currentData.firstName} ${currentData.lastName}`}</div>
            </div>
        </div>
    );
};

export default User;