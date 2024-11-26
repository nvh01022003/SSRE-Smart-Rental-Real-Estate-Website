import React, { useCallback, useEffect, useRef, useState } from 'react';
import logo from '../../assets/logo.png';
import { User } from '../../components';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import menuManage from '../../ultils/menuManage';
import { logout } from '../../store/actions/auth';
import { AiOutlineAppstore, AiOutlinePlusCircle, AiOutlineLogout } from 'react-icons/ai';
import { BsBookmarkStarFill } from 'react-icons/bs';
import { getTotalPostSaved } from '../../store/actions/post';
import { HiOutlineExclamationCircle } from 'react-icons/hi';



const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const headerRef = useRef();
    const { isLoggedIn } = useSelector(state => state.auth);
    const [isShowMenu, setIsShowMenu] = useState(false);
    const { role, token } = useSelector(state => state.auth);
    const { totalPostSaved } = useSelector(state => state.post);
    const [totalPostsSaved, setTotalPostsSaved] = useState(0);

    const email = process.env.REACT_APP_SYSTEM_EMAIL || 'ssresystem@gmail.com';
    const subject = encodeURIComponent("Báo cáo hệ thống Smart Rental Real Estate");
    const body = encodeURIComponent("Hãy mô tả báo cáo của bạn cho hệ thống Smart Rental Real Estate ở đây.");

    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    const navigateTo = useCallback((path) => {
        navigate(path);
    }, [navigate]);

    useEffect(() => {
        if (token) {
            dispatch(getTotalPostSaved(token));
        }
    }, [token, dispatch]);

    useEffect(() => {
        setTotalPostsSaved(totalPostSaved);
    }, [totalPostSaved]);

    useEffect(() => {
        headerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [searchParams.get('page')]);

    const filteredMenu = menuManage.filter(item => {
        if (role === 'ladnlord') {
            return [1, 2, 3, 4, 5].includes(item.id);
        } else {
            return [3, 4, 6].includes(item.id);
        }
    });

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
        <div ref={headerRef} className='w-5/6 mx-auto container'>
            <div className='flex flex-col md:flex-row items-center justify-between p-4'>
                <Link to={'/'} className='flex items-center mb-2 md:mb-0'>
                    <img
                        src={logo}
                        alt="logo"
                        className='w-[90px] h-[70px] object-contain'
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
                <div className='flex items-center gap-3'>
                    {!isLoggedIn && (
                        <div className='flex items-center gap-2'>
                            <button
                                className='px-4 py-2 rounded-lg shadow-lg bg-[#3961fb] text-white 
               hover:bg-[#2f4fc2] hover:shadow-xl active:scale-95 
               transition-all duration-300 ease-in-out transform'
                                onClick={() => navigateTo('/login')}
                            >
                                Đăng nhập
                            </button>

                            <button
                                className='px-4 py-2 rounded-lg shadow-lg bg-[#3961fb] text-white 
               hover:bg-[#2f4fc2] hover:shadow-xl active:scale-95 
               transition-all duration-300 ease-in-out transform'
                                onClick={() => navigateTo('/register')}
                            >
                                Đăng ký
                            </button>

                        </div>
                    )}
                    {isLoggedIn && (
                        <div className='flex items-center gap-3 relative'>
                            <User />
                            <div className="flex items-center relative cursor-pointer rounded-md hover:underline" onClick={handleSavePost}>
                                <BsBookmarkStarFill className="text-red-500 text-xl" />
                                {totalPostsSaved > 0 && (
                                    <span className="absolute top-[-10px] right-[45px] bg-red-500 text-white rounded-full text-xs px-1">
                                        {totalPostsSaved}
                                    </span>
                                )}
                                <span className="ml-1 text-black">Đã lưu</span>
                            </div>
                            <div className="flex items-center cursor-pointer rounded-md p-2 hover:underline" onClick={() => setIsShowMenu(prev => !prev)}>
                                <AiOutlineAppstore className="text-black" size={20} />
                                <span className="ml-1 text-black">Quản lý tài khoản</span>
                            </div>
                            {isShowMenu && (
                                <div className='absolute min-w-180 top-full bg-white shadow-md rounded-md p-4 right-0 flex flex-col z-50'>
                                    {filteredMenu.map(item => (
                                        <Link
                                            className='hover:text-orange-500 flex items-center gap-2 text-blue-600 border-b border-gray-200 py-2'
                                            key={item.id}
                                            to={item?.path}
                                        >
                                            {item?.icon}
                                            {item.text}
                                        </Link>
                                    ))}
                                    <span className='cursor-pointer hover:text-orange-500 text-blue-500 py-2 flex items-center gap-2'>
                                        <HiOutlineExclamationCircle />
                                        <a href={mailtoLink} className="flex items-center gap-2">
                                            Báo cáo hệ thống
                                        </a>
                                    </span>
                                    <span
                                        className='cursor-pointer hover:text-orange-500 text-blue-500 py-2 flex items-center gap-2'
                                        onClick={() => {
                                            setIsShowMenu(false);
                                            handleLogout();
                                        }}
                                    >
                                        <AiOutlineLogout />
                                        Đăng xuất
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    <button
                        type='button'
                        onClick={handleCreatePostClick}
                        className='outline-none py-2 px-3 bg-secondary1 flex items-center justify-center gap-2 text-white text-normal font-normal rounded-lg shadow-md hover:bg-secondary2 transition duration-300'
                    >
                        Đăng tin mới <AiOutlinePlusCircle />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;