// import React, { useEffect, useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import menuSidebar from '../../ultils/menuSidebar'
// import { NavLink } from 'react-router-dom'
// import * as actions from '../../store/actions'
// import { AiOutlineLogout } from 'react-icons/ai'
// import { logout } from '../../store/actions/auth'
// import { getPersonalInfo } from '../../services/userService'

// const activeStyle = 'hover:bg-gray-200 flex  rounded-md items-center gap-2 py-2 font-bold bg-gray-200'
// const notActiceStyle = 'hover:bg-gray-200 flex  rounded-md items-center gap-2 py-2 cursor-pointer'

// const Sidebar = () => {

//     const dispatch = useDispatch()
//     const [personalInfo, setPersonalInfo] = useState(null);

//     const { token, role } = useSelector(state => state.auth);

//     useEffect(() => {
//         const fetchPersonalInfo = async () => {
//             try {
//                 const data = await getPersonalInfo(token);
//                 setPersonalInfo(data.info_user);
//             } catch (error) {
//                 console.error('Error fetching personal information:', error);
//             }
//         };

//         fetchPersonalInfo();
//     }, []);

//     // Filter menu items based on role
//     const filteredMenu = menuSidebar.filter(item => {
//         if (role === 'ladnlord') {
//             return [1, 2, 3, 4, 5].includes(item.id);  // For landlord
//         } else {
//             return [3, 4, 5, 6].includes(item.id);  // For tenants
//         }
//     });

//     const handleLogout = () => {
//         dispatch(logout());
//     };

//     return (
//         <div className='p-4 flex flex-col gap-6'>
//             <div>
//                 {filteredMenu.map(item => {
//                     return (
//                         <NavLink
//                             className={({ isActive }) => isActive ? activeStyle : notActiceStyle}
//                             key={item.id}
//                             to={item?.path}
//                         >
//                             {item?.icon}
//                             {item.text}
//                         </NavLink>
//                     )
//                 })}

//                 <span onClick={() => {
//                     dispatch(actions.logout())
//                     onclick = { handleLogout }
//                 }} className={notActiceStyle}><AiOutlineLogout />Đăng xuất</span>

//             </div>

//         </div>
//     )
// }

// export default Sidebar
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import menuSidebar from '../../ultils/menuSidebar';
import { NavLink } from 'react-router-dom';
import * as actions from '../../store/actions';
import { AiOutlineLogout } from 'react-icons/ai';
import { logout } from '../../store/actions/auth';
import { getPersonalInfo } from '../../services/userService';

const Sidebar = ({ isSidebarOpen }) => {
    const dispatch = useDispatch();
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
    }, [token]);

    const filteredMenu = menuSidebar.filter(item =>
        role === 'ladnlord' ? [1, 2, 3, 4, 5].includes(item.id) : [3, 4, 6].includes(item.id)
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
            <span onClick={handleLogout} className="hover:bg-gray-200 flex rounded-md items-center gap-2 py-2 cursor-pointer">
                <AiOutlineLogout />
                {isSidebarOpen && 'Đăng xuất'}
            </span>
        </div>
    );
};

export default Sidebar;
