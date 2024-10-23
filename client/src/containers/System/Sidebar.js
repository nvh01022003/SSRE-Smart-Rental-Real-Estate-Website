import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import menuSidebar from '../../ultils/menuSidebar'
import { NavLink } from 'react-router-dom'
import * as actions from '../../store/actions'
import { AiOutlineLogout } from 'react-icons/ai'
import { logout } from '../../store/actions/auth'
import { getPersonalInfo } from '../../services/userService'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'

const activeStyle = 'hover:bg-gray-200 flex  rounded-md items-center gap-2 py-2 font-bold bg-gray-200'
const notActiceStyle = 'hover:bg-gray-200 flex  rounded-md items-center gap-2 py-2 cursor-pointer'

const Sidebar = () => {

    const dispatch = useDispatch()
    const [personalInfo, setPersonalInfo] = useState(null);

    const { token, role } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const data = await getPersonalInfo(token);
                setPersonalInfo(data.info_user);
            } catch (error) {
                console.error('Error fetching personal information:', error);
            }
        };

        fetchPersonalInfo();
    }, []);

    // Filter menu items based on role
    const filteredMenu = menuSidebar.filter(item => {
        if (role === 'ladnlord') {
            return [1, 2, 3, 4, 5].includes(item.id);  // For landlord
        } else {
            return [3, 4, 5, 6].includes(item.id);  // For tenants
        }
    });

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className='w-[256px] flex-none p-4 flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
                {/* <div className='flex items-center gap-4'>
                    <img src={personalInfo?.img_avt || anonAvatar} alt="avatar" className='w-12 h-12 object-cover rounded-full border-2 border-white' />
                    <div className='flex flex-col justify-center'>
                        <span classNam e='font-semibold'>{fullName}</span>
                    </div>
                </div> */}

                <Link to={'/'} className='flex items-center'>
                    <img
                        src={logo}
                        alt="logo"
                        className='w-[90px] h-[70px] object-contain mt-4'
                    />
                    <div className='ml-2'>
                        <span className='text-normal font-semibold block'>
                            Smart Rental Real Estate
                        </span>
                    </div>
                </Link>
            </div>
            <div>
                {filteredMenu.map(item => {
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