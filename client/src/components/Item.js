import React, { memo, useState, useEffect, useContext } from 'react';
import icons from '../ultils/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatVietnameseToString } from '../ultils/Common/formatVietnameseToString';
import img1 from '../assets/dn.jpg';
import img2 from '../assets/hcm.jpg';
import img3 from '../assets/hn.jpg';
import img4 from '../assets/logo.png';
import img5 from '../assets/anon-avatar.png';
import { FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { AuthContext } from '../Context/AuthContext';

const { RiCrop2Line, GrStar, BsBookmarkStarFill } = icons;

const indexs = [0, 1, 2, 3];

// Dữ liệu giả
const fakeData = {
    postId: '1',
    userId: '1',  // ID của người dùng
    images: [img1, img2, img3, img4],
    user: {
        name: 'Nguyễn Văn A',
        phone: '0123456789',
    },
    title: 'Cho Thuê Căn Hộ Dịch Vụ Mới Xây Full Nội Thất, Ngay Ngã Tư Bốn Xã',
    star: 4,
    description: 'Căn hộ rộng rãi, thoáng mát, nằm ngay trung tâm quận 1, gần chợ, siêu thị và trường học.',
    attributes: {
        price: '10 triệu/tháng',
        acreage: '50m²'
    },
    address: '123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh',
};

const Item = ({ images, user, title, star, description, attributes, address, postId, userId }) => {
    const [isStarred, setIsStarred] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const { token } = useSelector(state => state.auth);

    const handleClick = async () => {
        setIsStarred(!isStarred);

        const postData = {
            userId: userId,
            postId: postId,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/v1/user/tenants/savePost/${postData.postId}`, {
                method: 'POST',
                headers: {
                    'token': `${token}`
                }
            });

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };

    const renderStars = (starCount) => (
        Array.from({ length: starCount }, (_, index) => (
            <GrStar key={index} className='star-item' size={20} color='#FFB300' />
        ))
    );

    return (
        <div className='w-full flex border-t border-orange-600 py-4 bg-red-50 p-4'>
            <div
                className='w-2/5 flex flex-wrap gap-[2px] items-center relative cursor-pointer'
                onClick={() => navigate(`/chi-tiet/${formatVietnameseToString(title)}/${postId}`, { state: { fakeData } })}
            >
                {images.length > 0 && images.filter((_, index) => indexs.includes(index)).map((img, index) => (
                    <img key={index} src={img} alt="preview" className='w-[47%] h-[120px] object-cover' />
                ))}
                <span className='bg-overlay-70 text-white px-2 rounded-md absolute left-1 bottom-4'>{`${images.length} ảnh`}</span>
            </div>

            <div className='w-3/5'>
                <div className='flex justify-between gap-4 w-full'>
                    <div className='flex-wrap'>
                        {renderStars(star)}
                        <span className='text-red-600 font-medium cursor-pointer hover:underline text-lg' onClick={() => navigate(`/chi-tiet/${formatVietnameseToString(title)}/${postId}`, { state: { fakeData } })}>
                            {title}
                        </span>
                    </div>
                    <div className='w-[10%] justify-end'>
                        <button
                            className='hover:bg-red-50'
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={handleClick}
                        >
                            <BsBookmarkStarFill size={30} color={isStarred || isHovered ? 'red' : 'orange'} />
                        </button>
                    </div>
                </div>
                <div className='my-2 flex items-center justify-between gap-2'>
                    <span className='font-bold mr-5 text-green-600 whitespace-nowrap overflow-hidden text-ellipsis'>
                        <FaDollarSign className="inline-block mb-1" />{attributes?.price}
                    </span>
                    <span className='mr-5'>
                        <RiCrop2Line className="inline-block mb-1" /> {attributes?.acreage}
                    </span>
                    <span className='whitespace-nowrap overflow-hidden text-ellipsis'>
                        <FaMapMarkerAlt className="inline-block mb-1" />
                        {`${address.split(',')[address.split(',').length - 2]}${address.split(',')[address.split(',').length - 1]}`}
                    </span>
                </div>
                <p className='text-gray-500 w-full h-[50px] text-ellipsis overflow-hidden'>
                    {description}
                </p>
                <div className='flex items-center my-10 justify-between'>
                    <div className='flex items-center'>
                        <img src={img5} alt="avatar" className='w-[30px] h-[30px] object-cover rounded-full mr-2' />
                        <p className='text-gray-500'>{user?.name}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <p className='text-gray-500'>Liên hệ :</p>
                        <button
                            type='button'
                            className='px-1 py-1 rounded-md font-medium border border-blue-500 text-blue-500 bg-red-50 hover:bg-blue-500 hover:text-white h-7'
                        >
                            {user?.phone}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FakeDataComponent = () => <Item {...fakeData} />;

export default memo(FakeDataComponent);
