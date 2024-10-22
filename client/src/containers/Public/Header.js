import React, { useCallback, useEffect, useRef, useState } from 'react'
import logo from '../../assets/logo.png'
import { Button, User } from '../../components'
import icons from '../../ultils/icons'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../store/actions'
import menuManage from '../../ultils/menuManage'
import { logout } from '../../store/actions/auth'
import { AiOutlineHeart, AiOutlineAppstore } from 'react-icons/ai';
import { path } from '../../ultils/constant';

const { AiOutlinePlusCircle, AiOutlineLogout, BsBookmarkStarFill } = icons

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const headerRef = useRef()
    const { isLoggedIn } = useSelector(state => state.auth)
    const [isShowMenu, setIsShowMenu] = useState(false)
    const navigateTo = useCallback((path) => {
        navigate(path);
    }, [navigate]);
    useEffect(() => {
        headerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, [searchParams.get('page')])

    useEffect(() => {
        console.log('Header re-rendered. isLoggedIn:', isLoggedIn); // Add this line
    }, [isLoggedIn]);

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleCreatePostClick = () => {
        navigate('/he-thong/tao-moi-bai-dang');
    };

    const handleSavePost = () => {
        navigate('tin-da-luu');
    };

    return (
        <div ref={headerRef} className='w-4/5 mx-auto container'>
            <div className='w-full flex items-center justify-between'>
                <Link to={'/'} className='flex items-center'>
                    <img
                        src={logo}
                        alt="logo"
                        className='w-[90px] h-[70px] object-contain mt-4'
                    />
                    <div className='ml-2'>
                        <span className='text-2xl font-semibold block'>
                            Smart Rental Real Estate Website
                        </span>
                        <span className='text-sm text-gray-600 block'>
                            Nền tảng kết nối chủ nhà và người thuê, tối ưu hóa tìm kiếm nhà thuê bằng AI
                        </span>
                    </div>
                </Link>
                <div className='flex items-center gap-1'>
                    {!isLoggedIn && <div className='flex items-center gap-1'>

                        <Button
                            text={'Đăng nhập'}
                            textColor='text-white'
                            bgColor='bg-[#3961fb]'
                            onClick={() => navigateTo('/login')}
                        />
                        <Button
                            text={'Đăng ký'}
                            textColor='text-white'
                            bgColor='bg-[#3961fb]'
                            onClick={() => navigateTo('/register')}
                        />
                    </div>}
                    {isLoggedIn && <div className='flex items-center gap-3 relative'>
                        <User />
                        <div className="flex items-center cursor-pointer rounded-md hover:underline" onClick={handleSavePost}>
                            {/* Thêm sự kiện onclick để thực hiện navigate đến route trang đã lưu bài đăng */}
                            <BsBookmarkStarFill className="text-red-500 relative mt-1">
                                {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">1</span> */}
                            </BsBookmarkStarFill>
                            <span className="ml-1 text-black text-normal ">Đã lưu</span>
                        </div>
                        <div className="flex items-center mr-4 cursor-pointer rounded-md p-2 hover:underline"
                            onClick={() => setIsShowMenu(prev => !prev)}>
                            <AiOutlineAppstore className="text-black mt-1" size={20} />
                            <span className="ml-1 text-black text-normal">Quản lý tài khoản</span>
                        </div>
                        {isShowMenu && <div className='absolute min-w-180 top-full bg-white shadow-md rounded-md p-4 right-0 flex flex-col'>
                            {menuManage.map(item => {
                                return (
                                    <Link
                                        className='hover:text-orange-500 flex items-center gap-2 text-blue-600 border-b border-gray-200 py-2'
                                        key={item.id}
                                        to={item?.path}
                                    >
                                        {item?.icon}
                                        {item.text}
                                    </Link>
                                )
                            })}
                            <span
                                className='cursor-pointer hover:text-orange-500 text-blue-500 py-2 flex items-center gap-2'
                                onClick={() => {
                                    setIsShowMenu(false)
                                    dispatch(actions.logout())
                                    onclick = { handleLogout }
                                }}
                            >
                                <AiOutlineLogout />
                                Đăng xuất
                            </span>
                        </div>}
                    </div>}
                    <Button
                        text={'Đăng tin mới'}
                        textColor='text-white'
                        bgColor='bg-secondary2'
                        IcAfter={AiOutlinePlusCircle}
                        onClick={handleCreatePostClick}
                    />
                </div>
            </div>
        </div>
    )
}

export default Header