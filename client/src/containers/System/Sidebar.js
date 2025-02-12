import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import menuSidebar from '../../ultils/menuSidebar';
import { NavLink } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai';
import { logout } from '../../store/actions/auth';
import { getPersonalInfo } from '../../services/userService';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const Sidebar = ({ isSidebarOpen, role }) => {
    const dispatch = useDispatch();
    const [personalInfo, setPersonalInfo] = useState(null);
    const { token } = useSelector(state => state.auth);
    const email = process.env.REACT_APP_SYSTEM_EMAIL || 'ssresystem@gmail.com';
    const subject = encodeURIComponent("Báo cáo hệ thống Smart Rental Real Estate");
    const body = encodeURIComponent("Hãy mô tả báo cáo của bạn cho hệ thống Smart Rental Real Estate ở đây.");

    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

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
    }, [token]);

    const filteredMenu = menuSidebar.filter(item =>
        role === 'ladnlord' ? [1, 2, 3, 4, 5, 7].includes(item.id) : [3, 4, 6, 7].includes(item.id)
    );

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="p-4 flex flex-col gap-6">
            {filteredMenu.map(item => (
                <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) =>
                        `hover:bg-gray-200 flex rounded-md items-center gap-2 py-2 ${isActive ? 'font-bold bg-gray-200' : 'cursor-pointer'}`
                    }
                >
                    {item.icon}
                    {isSidebarOpen && item.text}
                </NavLink>
            ))}
            <span className="hover:bg-gray-200 flex rounded-md items-center gap-2 py-2 cursor-pointer">

                <HiOutlineExclamationCircle />
                {isSidebarOpen && <a href={mailtoLink} className="flex items-center gap-2">Báo cáo hệ thống</a>}
            </span>
            <span onClick={handleLogout} className="hover:bg-gray-200 flex rounded-md items-center gap-2 py-2 cursor-pointer">
                <AiOutlineLogout />
                {isSidebarOpen && 'Đăng xuất'}
            </span>
        </div>
    );
};

export default Sidebar;
