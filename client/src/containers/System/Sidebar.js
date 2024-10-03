import React, { useEffect, useState } from 'react'
import anonAvatar from '../../assets/anon-avatar.png'
import { useSelector, useDispatch } from 'react-redux'
import menuSidebar from '../../ultils/menuSidebar'
import { NavLink } from 'react-router-dom'
import * as actions from '../../store/actions'
import { AiOutlineLogout } from 'react-icons/ai'
import { logout } from '../../store/actions/auth'
import { getPersonalInfo } from '../../services/userService'

const activeStyle = 'hover:bg-gray-200 flex  rounded-md items-center gap-2 py-2 font-bold bg-gray-200'
const notActiceStyle = 'hover:bg-gray-200 flex  rounded-md items-center gap-2 py-2 cursor-pointer'

const Sidebar = () => {

    const dispatch = useDispatch()
    const [personalInfo, setPersonalInfo] = useState(null);

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const data = await getPersonalInfo();
                setPersonalInfo(data.info_user);
            } catch (error) {
                console.error('Error fetching personal information:', error);
            }
        };

        fetchPersonalInfo();
    }, []);

    const fullName = personalInfo ? `${personalInfo.firstName} ${personalInfo.lastName}`.trim() : '';

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className='w-[256px] flex-none p-4 flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-4'>
                    <img src={personalInfo?.img_avt || anonAvatar} alt="avatar" className='w-12 h-12 object-cover rounded-full border-2 border-white' />
                    <div className='flex flex-col justify-center'>
                        <span className='font-semibold'>{fullName}</span>
                    </div>
                </div>
            </div>
            <div>
                {menuSidebar.map(item => {
                    return (
                        <NavLink
                            className={({ isActive }) => isActive ? activeStyle : notActiceStyle}
                            key={item.id}
                            to={item?.path}
                        >
                            {item?.icon}
                            {item.text}
                        </NavLink>
                    )
                })}
                <span onClick={() => {
                    dispatch(actions.logout())
                    onclick = { handleLogout }
                }} className={notActiceStyle}><AiOutlineLogout />Đăng xuất</span>
            </div>
        </div>
    )
}

export default Sidebar