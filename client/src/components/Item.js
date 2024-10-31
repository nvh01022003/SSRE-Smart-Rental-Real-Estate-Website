// import React, { memo, useState, useEffect } from 'react';
// import icons from '../ultils/icons';
// import { useNavigate } from 'react-router-dom';
// import { formatVietnameseToString } from '../ultils/Common/formatVietnameseToString';
// import { FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
// import axios from 'axios';
// import { useSelector, useDispatch } from 'react-redux';
// import Swal from 'sweetalert2';
// import styled from 'styled-components';
// import { getTotalPostSaved } from '../store/actions/post';

// const { RiCrop2Line } = icons;
// const { GrStar, BsBookmarkStarFill } = icons;

// const ItemContainer = styled.div`
//     width: 100%;
//     display: flex;
//     border-top: 1px solid #FF8C00;
//     padding: 1rem;
//     background-color: #fffdf8;
//     border-radius: 8px;
//     box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
//     transition: transform 0.2s ease-in-out;

//     &:hover {
//         transform: translateY(-4px);
//     }

//     @media (max-width: 768px) {
//         flex-direction: column;
//     }
// `;

// const IconContainer = styled.div`
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     color: #FF8C00;

//     @media (max-width: 768px) {
//         flex-direction: column;
//         align-items: flex-start;
//     }
// `;

// const Item = ({ images, user, title, star, description, attributes, address, id, starred, onToggleStar }) => {
//     const [isStarred, setIsStarred] = useState(false);
//     const [isHovered, setIsHovered] = useState(false);
//     const { token } = useSelector(state => state.auth);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     useEffect(() => {
//         // Khôi phục trạng thái từ localStorage
//         const savedStarredState = localStorage.getItem(`starred-${id}`);
//         setIsStarred(savedStarredState === 'true'); // Chuyển đổi chuỗi thành boolean
//     }, [id]);

//     const handleStar = (star) => {
//         let stars = [];
//         for (let i = 1; i <= +star; i++) {
//             stars.push(<GrStar className='star-item' size={20} color='#FFB300' />);
//         }
//         return stars;
//     };

//     const handleClick = async () => {
//         setIsStarred(!isStarred);
//         localStorage.setItem(`starred-${id}`, !isStarred); // Lưu trạng thái vào localStorage

//         if (isStarred) {
//             try {
//                 dispatch(getTotalPostSaved(token));
//                 await axios.delete(`http://localhost:5000/api/v1/user/tenants/deletePostSaved/${id}`, {
//                     headers: { 'token': `${token}` }
//                 });
//             } catch (error) {
//                 console.error('Error deleting post:', error);
//             }
//         } else {
//             try {
//                 await axios.post(`http://localhost:5000/api/v1/user/tenants/savePost/${id}`, {}, {
//                     headers: { 'token': `${token}` }
//                 });
//             } catch (error) {
//                 console.error('Error saving post:', error);
//                 if (error.response?.data?.err === 1) {
//                     Swal.fire({
//                         icon: 'error',
//                         text: 'Đăng nhập để lưu bài viết!',
//                         confirmButtonText: 'Đăng nhập ngay',
//                     }).then((result) => {
//                         if (result.isConfirmed) {
//                             window.location.href = '/login';
//                         }
//                     });
//                 }
//             }
//         }
//     };

//     const formatPrice = (price) => {
//         const priceNumber = parseFloat(price); // Chuyển chuỗi thành số

//         if (priceNumber >= 1_000_000) {
//             const formattedPrice = (priceNumber / 1_000_000).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
//             return formattedPrice + ' triệu đồng'; // Đơn vị triệu, với dấu phẩy
//         } else {
//             return priceNumber.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) + ' đồng'; // Đơn vị đồng, với dấu phẩy
//         }
//     };

//     return (
//         <ItemContainer>
//             <div className='mr-5 w-full md:w-2/5 flex flex-wrap items-center relative'
//                 style={{
//                     boxShadow: '0px 4px 8px rgba(128, 128, 128, 0.3)',
//                     borderRadius: '8px',
//                     overflow: 'hidden',
//                     cursor: 'pointer',
//                 }}
//                 onClick={() => navigate(`/chi-tiet/${formatVietnameseToString(title)}/${id}`)}>
//                 {images.length > 0 && (
//                     <img src={images[0]} alt="preview" className='w-full h-[235px] object-cover cursor-pointer' style={{ transition: 'transform 0.2s ease' }} />
//                 )}
//                 <span className='bg-overlay-70 text-white px-2 rounded-md absolute left-1 bottom-4'>{`${images.length} ảnh`}</span>
//             </div>

//             <div className='w-full md:w-3/5'>
//                 <div className='flex justify-between gap-4 w-full mb-2'>
//                     <div className='flex-wrap'>
//                         {handleStar(+star).length > 0 && handleStar(+star).map((star, number) => (
//                             <span key={number} className='h-5'>{star}</span>
//                         ))}
//                         <span className='text-red-600 font-medium cursor-pointer hover:underline text-lg' onClick={() => navigate(`/chi-tiet/${formatVietnameseToString(title)}/${id}`)}>
//                             {title}
//                         </span>
//                     </div>
//                     <div className='w-[10%] justify-end '>
//                         <button className='hover:bg-red-50 p-1 rounded-full' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={handleClick}>
//                             <BsBookmarkStarFill size={30} color={isStarred || isHovered ? 'red' : 'orange'} />
//                         </button>
//                     </div>
//                 </div>
//                 <div className='my-2 flex items-center gap-6'>
//                     <IconContainer>
//                         <span className='font-bold text-green-600 flex items-center gap-1'>
//                             <FaDollarSign className="inline-block " />
//                             <p className='text-lg'>{formatPrice(attributes?.price)}/tháng</p>
//                         </span>
//                         <span className='flex items-center gap-1'>
//                             <RiCrop2Line className="inline-block" /> {attributes?.acreage} m²
//                         </span>
//                     </IconContainer>
//                 </div>
//                 <div className='text-gray-500 mb-3'>
//                     <FaMapMarkerAlt className="inline-block" />
//                     {address}
//                 </div>
//                 <p className='text-gray-500 h-[82px] overflow-hidden' style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
//                     {description}
//                 </p>
//                 <div className='flex items-center mt-5 justify-between'>
//                     <div className='flex items-center'>
//                         <img src={user?.img_avt} alt="avatar" className='w-[30px] h-[30px] object-cover rounded-full mr-2' />
//                         <p className='text-gray-500'>{user?.name}</p>
//                     </div>
//                     <div className='flex items-center gap-1'>
//                         <p className='text-gray-500'>Liên hệ :</p>
//                         <button type='button' className='px-2 py-1 rounded-md font-medium border border-blue-500 text-blue-500 bg-white hover:bg-blue-500 hover:text-white transition-all duration-300'>
//                             {user?.phone}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </ItemContainer>
//     );
// };

// export default memo(Item);
import React, { memo, useState, useEffect } from 'react';
import icons from '../ultils/icons';
import { useNavigate } from 'react-router-dom';
import { formatVietnameseToString } from '../ultils/Common/formatVietnameseToString';
import { FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import { getTotalPostSaved } from '../store/actions/post';

const { RiCrop2Line } = icons;
const { GrStar, BsBookmarkStarFill } = icons;

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
    gap: 10px;
    color: #FF8C00;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const Item = ({ images, user, title, star, description, attributes, address, id, starred, onToggleStar }) => {
    const [isStarred, setIsStarred] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { token } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Khôi phục trạng thái từ localStorage
        const savedStarredState = localStorage.getItem(`starred-${id}`);
        setIsStarred(savedStarredState === 'true'); // Chuyển đổi chuỗi thành boolean
    }, [id]);

    const handleStar = (star) => {
        let stars = [];
        for (let i = 1; i <= +star; i++) {
            stars.push(<GrStar className='star-item' size={20} color='#FFB300' />);
        }
        return stars;
    };

    const handleClick = async () => {
        setIsStarred(!isStarred);
        localStorage.setItem(`starred-${id}`, !isStarred); // Lưu trạng thái vào localStorage

        if (isStarred) {
            try {
                await axios.delete(`http://localhost:5000/api/v1/user/tenants/deletePostSaved/${id}`, {
                    headers: { 'token': `${token}` }
                });
                dispatch(getTotalPostSaved(token)); // Update total posts saved
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        } else {
            try {
                await axios.post(`http://localhost:5000/api/v1/user/tenants/savePost/${id}`, {}, {
                    headers: { 'token': `${token}` }
                });
                dispatch(getTotalPostSaved(token)); // Update total posts saved
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
                }
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
                <div className='flex justify-between gap-4 w-full mb-2'>
                    <div className='flex-wrap'>
                        {handleStar(+star).length > 0 && handleStar(+star).map((star, number) => (
                            <span key={number} className='h-5'>{star}</span>
                        ))}
                        <span className='text-red-600 font-medium cursor-pointer hover:underline text-lg' onClick={() => navigate(`/chi-tiet/${formatVietnameseToString(title)}/${id}`)}>
                            {title}
                        </span>
                    </div>
                    <div className='w-[10%] justify-end '>
                        <button className='hover:bg-red-50 p-1 rounded-full' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={handleClick}>
                            <BsBookmarkStarFill size={30} color={isStarred || isHovered ? 'red' : 'orange'} />
                        </button>
                    </div>
                </div>
                <div className='my-2 flex items-center gap-6'>
                    <IconContainer>
                        <span className='font-bold text-green-600 flex items-center gap-1'>
                            <FaDollarSign className="inline-block " />
                            <p className='text-lg'>{formatPrice(attributes?.price)}/tháng</p>
                        </span>
                        <span className='flex items-center gap-1'>
                            <RiCrop2Line className="inline-block" /> {attributes?.acreage} m²
                        </span>
                    </IconContainer>
                </div>
                <div className='text-gray-500 mb-3'>
                    <FaMapMarkerAlt className="inline-block" />
                    {address}
                </div>
                <p className='text-gray-500 h-[82px] overflow-hidden' style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {description}
                </p>
                <div className='flex items-center mt-5 justify-between'>
                    <div className='flex items-center'>
                        <img src={user?.img_avt} alt="avatar" className='w-[30px] h-[30px] object-cover rounded-full mr-2' />
                        <p className='text-gray-500'>{user?.name}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <p className='text-gray-500'>Liên hệ :</p>
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