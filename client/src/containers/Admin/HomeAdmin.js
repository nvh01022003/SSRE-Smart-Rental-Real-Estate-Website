import React from 'react'
import * as actions from '../../store/actions'
import { logout } from '../../store/actions/auth'
import { useDispatch } from 'react-redux'
import { AiOutlineLogout } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { path } from '../../ultils/constant'

const notActiceStyle = 'hover:bg-gray-200 flex  rounded-md items-center gap-2 py-2 cursor-pointer'

const HomeAdmin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div >
            Home Admin

            <button onClick={() => {
                dispatch(actions.logout())
                onclick = { handleLogout }
                // navigate('/')
            }} className={notActiceStyle}><AiOutlineLogout />
                Đăng xuất
            </button>
        </div>
    )
}
export default HomeAdmin;
