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
import * as apis from '../services';

const User = () => {
    const [currentData, setCurrentData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const persistAuth = localStorage.getItem('persist:auth');
            const authData = JSON.parse(persistAuth);
            const token = authData.token.replace(/"/g, ''); // Remove quotes from token

            try {
                const response = await apis.apiGetCurrent(token);
                console.log(response);
                if (response?.err === 0) {
                    setCurrentData(response.info_user);
                } else {
                    console.error('Error fetching user data:', response.msg);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    if (loading) {
        return (
            <div className='flex items-center gap-2'>
                <img src={anonAvatar} alt="avatar" className='w-10 object-cover rounded-full h-10 border-2 shadow-md border-white' />
                <div className='flex flex-col'>
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    if (!currentData) {
        return (
            <div className='flex items-center gap-2'>
                <img src={anonAvatar} alt="avatar" className='w-10 object-cover rounded-full h-10 border-2 shadow-md border-white' />
                <div className='flex flex-col'>
                    <span>Error loading user data</span>
                </div>
            </div>
        );
    }

    return (
        <div className='flex items-center gap-2'>
            <img src={currentData.img_avt || anonAvatar} alt="avatar" className='w-10 object-cover rounded-full h-10 border-2 shadow-md border-white' />
            <div className='flex flex-col'>
                <span>Xin chào, <span className='font-semibold'>{`${currentData.firstName} ${currentData.lastName}`}</span></span>
                {/* <span>Mã tài khoản: <span className='font-medium'>{`${currentData.id.slice(0, 10)}...`}</span></span> */}
            </div>
        </div>
    );
};

export default User;