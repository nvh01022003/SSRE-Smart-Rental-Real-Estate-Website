import React from 'react';
import anonAvatar from '../assets/anon-avatar.png';
import { useSelector } from 'react-redux';

const User = () => {
    const { user } = useSelector((state) => state.user);

    if (!user) {
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
        <div className='flex items-center gap-2 cursor-pointer' onClick={() => window.location.href = '/he-thong/thong-tin-ca-nhan'}>
            <img src={user.img_avt || anonAvatar} alt="avatar" className='w-12 object-cover rounded-full h-12 border-2 shadow-md border-white' />
            <div>
                Xin chào,
                {/* <div className='font-semibold'>{`${user.firstName} ${user.lastName}`}</div> */}
                <div className='font-semibold'>{`${user.lastName}`}</div>
            </div>
        </div>
    );
};

export default User;