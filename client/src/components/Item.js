import React, { memo, useState, useEffect } from 'react';
import icons from '../ultils/icons';
import { useNavigate } from 'react-router-dom';
import { formatVietnameseToString } from '../ultils/Common/formatVietnameseToString';
import { FaMapMarkerAlt, FaDollarSign, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import { getTotalPostSaved, fetchSavedPosts } from '../store/actions/post';

const { RiCrop2Line } = icons;
const { BsBookmarkStarFill } = icons;

const ItemContainer = styled.div`
    width: 100%;
    display: flex;
    border-top: 1px solid #FF8C00;
    padding: 1rem;
    background-color: #fffdf8;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: translateY(-4px);
    }

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 30px;
    color: #FF8C00;

    @media (max-width: 768px) {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10px;
        font-size: 0.875rem; /* Smaller text size */
    }
`;

const Item = ({ images, user, title, isSaved, description, attributes, address, id, updatedAt }) => {
    const [isStarred, setIsStarred] = useState(isSaved); // Sử dụng statusSave từ props
    const [isHovered, setIsHovered] = useState(false);
    const { token } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSavedPosts(token, 1));
    }, [dispatch, token]);

    const handleClick = async () => {
        const newStarredState = isStarred === 1 ? 0 : 1;

        if (newStarredState === 1) {
            try {
                const res = await axios.post(`http://localhost:5000/api/v1/user/tenants/savePost/${id}`, {}, {
                    headers: { 'token': `${token}` }
                });
                if (res.data.err === 0) {
                    setIsStarred(1); // Update state only after successful API call
                    dispatch(getTotalPostSaved(token)); // Update total posts saved
                    dispatch(fetchSavedPosts(token, 1)); // Fetch the updated list of saved posts with page 1
                }
            } catch (error) {
                console.error('Error saving post:', error);
                if (error.response?.data?.err === 1) {
                    Swal.fire({
                        icon: 'error',
                        text: 'Đăng nhập để lưu bài viết!',
                        confirmButtonText: 'Đăng nhập ngay',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/login';
                        }
                    });
                } else if (error.response?.data?.err === -1) {
                    Swal.fire({
                        icon: 'error',
                        text: 'Bạn chỉ được lưu tối đa 3 tin đăng trong vòng 30 giây. Vui lòng thử lại sau 30 giây nữa !',
                        confirmButtonText: 'OK',
                    });
                }
            }
        } else {
            try {
                await axios.delete(`http://localhost:5000/api/v1/user/tenants/deletePostSaved/${id}`, {
                    headers: { 'token': `${token}` }
                });
                setIsStarred(0); // Update state only after successful API call
                dispatch(getTotalPostSaved(token)); // Update total posts saved
                dispatch(fetchSavedPosts(token, 1)); // Fetch the updated list of saved posts with page 1
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    const formatPrice = (price) => {
        const priceNumber = parseFloat(price); // Chuyển chuỗi thành số

        if (priceNumber >= 1_000_000) {
            const formattedPrice = (priceNumber / 1_000_000).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
            return formattedPrice + ' triệu đồng'; // Đơn vị triệu, với dấu phẩy
        } else {
            return priceNumber.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) + ' đồng'; // Đơn vị đồng, với dấu phẩy
        }
    };

    // Hàm tính khoảng thời gian cập nhật
    const calculateTimeDifference = (updatedAt) => {
        const updatedDate = new Date(updatedAt);
        const now = new Date();
        const diffInMs = now - updatedDate;

        const diffInMinutes = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) {
            return `${diffInDays} ngày trước`;
        } else if (diffInHours > 0) {
            return `${diffInHours} giờ trước`;
        } else if (diffInMinutes > 0) {
            return `${diffInMinutes} phút trước`;
        } else {
            return 'Vừa cập nhật';
        }
    };

    // Kiểm tra nếu có dữ liệu updatedAt thì tính toán khoảng thời gian
    const timeDiff = updatedAt ? calculateTimeDifference(updatedAt) : '';

    return (
        <ItemContainer>
            <div className='mr-5 w-full md:w-2/5 flex flex-wrap items-center relative'
                style={{
                    boxShadow: '0px 4px 8px rgba(128, 128, 128, 0.3)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                }}
                onClick={() => navigate(`/chi-tiet/${formatVietnameseToString(title)}/${id}`)}>
                {images.length > 0 && (
                    <img src={images[0]} alt="preview" className='w-full h-[235px] object-cover cursor-pointer' style={{ transition: 'transform 0.2s ease' }} />
                )}
                <span className='bg-overlay-70 text-white px-2 rounded-md absolute left-1 bottom-4'>{`${images.length} ảnh`}</span>
            </div>

            <div className='w-full md:w-3/5'>
                <div className='flex justify-between w-full mb-2'>
                    <div className='flex-wrap '>
                        <span style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2, // Số dòng tối đa trước khi cắt bớt
                            WebkitBoxOrient: 'vertical',
                            textOverflow: 'ellipsis'
                        }} className='text-red-600 font-medium cursor-pointer hover:underline text-xs md:text-2xl uppercase overflow-hidden  text-ellipsis' onClick={() => navigate(`/chi-tiet/${formatVietnameseToString(title)}/${id}`)}>
                            {title}
                        </span>
                    </div>
                    <div className='justify-end '>
                        <button className='hover:bg-red-50 p-1 rounded-full' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={handleClick}>
                            <BsBookmarkStarFill size={30} color={isStarred === 1 || isHovered ? 'red' : 'orange'} />
                        </button>
                    </div>
                </div>
                <div className='my-2 flex items-center gap-6 text-xl'>
                    <IconContainer>
                        <span className='font-bold text-green-600 flex items-center'>
                            <FaDollarSign className="inline-block" />
                            <p className="ml-1">{formatPrice(attributes?.price)}/tháng</p>
                        </span>
                        <span className='flex items-center gap-1'>
                            <RiCrop2Line className="inline-block" /> {parseInt(attributes?.acreage)} m²
                        </span>
                        <span className='flex text-gray-500 items-center gap-1'>
                            <FaClock className="inline-block" /> {timeDiff}
                        </span>
                    </IconContainer>
                </div>
                <div className='text-gray-500 mb-3 mt-1 md:text-xl'>
                    <FaMapMarkerAlt className="inline-block mb-1" />
                    {address}
                </div>
                <p className='text-gray-500 h-[82px] w-full overflow-hidden text-lg'
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3, // Số dòng tối đa trước khi cắt bớt
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {description}
                </p>

                <div className='flex items-center mt-5 justify-between'>
                    <div className='flex items-center'>
                        <img src={user?.img_avt} alt="avatar" className='w-[30px] h-[30px] object-cover rounded-full mr-2' />
                        <p className='text-gray-500 text-xs md:text-xl'>{user?.name}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <p className='text-blue-500 text-xs md:text-xl'>Liên hệ :</p>
                        <button type='button' className='px-2 py-1 rounded-md font-medium border border-blue-500 text-blue-500 bg-white hover:bg-blue-500 hover:text-white transition-all duration-300'>
                            {user?.phone}
                        </button>
                    </div>
                </div>
            </div>
        </ItemContainer>
    );
};

export default memo(Item);