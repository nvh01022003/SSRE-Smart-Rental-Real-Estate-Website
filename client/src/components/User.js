// import React from 'react'
// import { useSelector } from 'react-redux'
// import anonAvatar from '../assets/anon-avatar.png'

// const User = () => {
//     const { currentData } = useSelector(state => state.user)
//     console.log(currentData)

//     return (
//         <div className='flex items-center gap-2'>
//             <img src={currentData?.img_avt || anonAvatar} alt="avatar" className='w-10 object-cover rounded-full h-10 border-2 shadow-md border-white' />
//             <div className='flex flex-col'>
//                 <span>Xin chào, <span className='font-semibold'>{`${currentData?.firstName} ${currentData?.lastName}`}</span></span>
//                 {/* <span>Mã tài khoản: <span className='font-medium'>{`${currentData?.id?.slice(0, 10)}...`}</span></span> */}
//             </div>
//         </div>
//     )
// }

// export default User



import React, { useEffect, useState } from 'react';
import anonAvatar from '../assets/anon-avatar.png';
import { useSelector } from 'react-redux';

const User = () => {
    const [currentData, setCurrentData] = useState(null);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Lấy isLoggedIn từ redux store

    console.log(isLoggedIn);

    useEffect(() => {
        // Chỉ thực hiện khi isLoggedIn = true
        if (isLoggedIn) {
            // Trì hoãn 1 giây để đảm bảo dữ liệu đã được lưu vào localStorage
            const timer = setTimeout(() => {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setCurrentData(JSON.parse(storedUser)); // Chuyển đổi JSON thành object
                }
            }, 1); // Trì hoãn 0.001 giây

            return () => clearTimeout(timer); // Dọn dẹp timeout khi component unmount hoặc trước khi thực hiện lại
        }
    }, [isLoggedIn]); // useEffect phụ thuộc vào isLoggedIn

    if (!currentData) {
        return (
            <div className='flex items-center gap-2'>
                <img src={anonAvatar} alt="avatar" className='w-10 object-cover rounded-full h-10 border-2 shadow-md border-white' />
                <div className='flex flex-col'>
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className='flex items-center gap-2'>
            <img src={currentData.img_avt || anonAvatar} alt="avatar" className='w-12 object-cover rounded-full h-12 border-2 shadow-md border-white' />
            <div >
                Xin chào,
                <div className='font-semibold'>{`${currentData.firstName} ${currentData.lastName}`}</div>
            </div>
        </div>
    );
};

export default User;

