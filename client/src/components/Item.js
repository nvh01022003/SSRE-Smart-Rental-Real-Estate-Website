// // Thẻ component xem thông tin bài đăng bất động sản cho thuê

// import React, { memo, useState } from 'react'
// import icons from '../ultils/icons'
// import { useNavigate, Link } from 'react-router-dom'
// import { formatVietnameseToString } from '../ultils/Common/formatVietnameseToString'

// const indexs = [0, 1, 2, 3]

// const { GrStar, RiHeartFill, RiHeartLine, BsBookmarkStarFill } = icons

// const Item = ({ images, user, title, star, description, attributes, address, id }) => {
//     const [isHoverHeart, setIsHoverHeart] = useState(false)

//     const handleStar = (star) => {
//         let stars = []
//         for (let i = 1; i <= +star; i++) stars.push(<GrStar className='star-item' size={18} color='yellow' />)
//         return stars

//     }
//     return (
//         <div className='w-full flex border-t border-orange-600 py-4'>
//             <Link
//                 to={`chi-tiet/${formatVietnameseToString(title)}/${id}`}
//                 className='w-2/5 flex flex-wrap gap-[2px] items-center relative cursor-pointer'
//             >
//                 {images.length > 0 && images.filter((i, index) => indexs.some(i => i === index))?.map((i, index) => {
//                     return (
//                         <img key={index} src={i} alt="preview" className='w-[47%] h-[120px] object-cover' />
//                     )
//                 })}
//                 <span className='bg-overlay-70 text-white px-2 rounded-md absolute left-1 bottom-4'>{`${images.length} ảnh`}</span>
//                 <span
//                     className='text-white absolute right-5 bottom-1'
//                     onMouseEnter={() => setIsHoverHeart(true)}
//                     onMouseLeave={() => setIsHoverHeart(false)}
//                 >
//                     {isHoverHeart ? <RiHeartFill size={26} color='red' /> : <RiHeartLine size={26} />}
//                 </span>
//             </Link>
//             <div className='w-3/5'>
//                 <div className='flex justify-between gap-4 w-full'>
//                     <div className='text-red-600 font-medium'>
//                         {handleStar(+star).length > 0 && handleStar(+star).map((star, number) => {
//                             return (
//                                 <span key={number}>{star}</span>
//                             )
//                         })}
//                         {title}
//                     </div>
//                     <div className='w-[10%] flex justify-end'>
//                         <BsBookmarkStarFill size={24} color='orange' />
//                     </div>
//                 </div>
//                 <div className='my-2 flex items-center justify-between gap-2'>
//                     <span className='font-bold flex-3 text-green-600  whitespace-nowrap overflow-hidden text-ellipsis'>{attributes?.price}</span>
//                     <span className='flex-1'>{attributes?.acreage}</span>
//                     <span className='flex-3 whitespace-nowrap overflow-hidden text-ellipsis'>
//                         {`${address.split(',')[address.split(',').length - 2]}${address.split(',')[address.split(',').length - 1]}`}
//                     </span>
//                 </div>
//                 <p className='text-gray-500 w-full h-[50px] text-ellipsis overflow-hidden'>
//                     {description}
//                 </p>
//                 <div className='flex items-center my-5 justify-between'>
//                     <div className=' flex items-center'>
//                         <img src="https://lnsel.com/wp-content/uploads/2018/12/anon-avatar-300x300.png" alt="avatar" className='w-[30px] h-[30px] object-cover rounded-full' />
//                         <p>{user?.name}</p>
//                     </div>
//                     <div className='flex items-center gap-1'>
//                         <button
//                             type='button'
//                             className='bg-blue-700 text-white p-1 rounded-md'
//                         >
//                             {`Gọi ${user?.phone}`}
//                         </button>
//                         <button
//                             type='button'
//                             className='text-blue-700 px-1 rounded-md border border-blue-700'
//                         >
//                             Nhắn zalo
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default memo(Item)


import React, { memo, useState } from 'react';
import icons from '../ultils/icons';
import { useNavigate, Link } from 'react-router-dom';
import { formatVietnameseToString } from '../ultils/Common/formatVietnameseToString';
import img1 from '../assets/dn.jpg';
import img2 from '../assets/hcm.jpg';
import img3 from '../assets/hn.jpg';
import img4 from '../assets/logo.png';
import img5 from '../assets/anon-avatar.png';

const indexs = [0, 1, 2, 3];



const { GrStar, RiHeartFill, RiHeartLine, BsBookmarkStarFill } = icons;

// Dữ liệu giả
const fakeData = {
    images: [
        img1,
        img2,
        img3,
        img4,
    ],
    user: {
        name: 'Nguyễn Văn A',
        phone: '0123456789',
    },
    title: 'Căn hộ cho thuê quận 1 giá rẻ',
    star: 4,
    description: 'Căn hộ rộng rãi, thoáng mát, nằm ngay trung tâm quận 1, gần chợ, siêu thị và trường học.',
    attributes: {
        price: '10 triệu/tháng',
        acreage: '50m²'
    },
    address: '123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh',
    id: '1'
};

const Item = ({ images, user, title, star, description, attributes, address, id }) => {
    const [isHoverHeart, setIsHoverHeart] = useState(false);

    const handleStar = (star) => {
        let stars = [];
        for (let i = 1; i <= +star; i++) {
            stars.push(<GrStar className='star-item' size={18} color='yellow' />);
        }
        return stars;
    };

    // Trong component Item
    const navigate = useNavigate();

    return (
        <div className='w-full flex border-t border-orange-600 py-4'>
            {/* <Link
                to={`chi-tiet/${formatVietnameseToString(title)}/${id}`}
                className='w-2/5 flex flex-wrap gap-[2px] items-center relative cursor-pointer'
            >
                {images.length > 0 && images.filter((i, index) => indexs.some(i => i === index))?.map((i, index) => {
                    return (
                        <img key={index} src={i} alt="preview" className='w-[47%] h-[120px] object-cover' />
                    );
                })}
                <span className='bg-overlay-70 text-white px-2 rounded-md absolute left-1 bottom-4'>{`${images.length} ảnh`}</span>
                <span
                    className='text-white absolute right-5 bottom-1'
                    onMouseEnter={() => setIsHoverHeart(true)}
                    onMouseLeave={() => setIsHoverHeart(false)}
                >
                    {isHoverHeart ? <RiHeartFill size={26} color='red' /> : <RiHeartLine size={26} />}
                </span>
            </Link> */}

            <div
                className='w-2/5 flex flex-wrap gap-[2px] items-center relative cursor-pointer'
                onClick={() => navigate(`/chi-tiet/${formatVietnameseToString(title)}/${id}`, { state: { fakeData } })}
            >
                {images.length > 0 && images.filter((i, index) => indexs.some(i => i === index))?.map((i, index) => {
                    return (
                        <img key={index} src={i} alt="preview" className='w-[47%] h-[120px] object-cover' />
                    );
                })}
                <span className='bg-overlay-70 text-white px-2 rounded-md absolute left-1 bottom-4'>{`${images.length} ảnh`}</span>
                <span
                    className='text-white absolute right-5 bottom-1'
                    onMouseEnter={() => setIsHoverHeart(true)}
                    onMouseLeave={() => setIsHoverHeart(false)}
                >
                    {isHoverHeart ? <RiHeartFill size={26} color='red' /> : <RiHeartLine size={26} />}
                </span>
            </div>

            <div className='w-3/5'>
                <div className='flex justify-between gap-4 w-full'>
                    <div className='text-red-600 font-medium'>
                        {handleStar(+star).length > 0 && handleStar(+star).map((star, number) => {
                            return (
                                <span key={number}>{star}</span>
                            );
                        })}
                        {title}
                    </div>
                    <div className='w-[10%] flex justify-end'>
                        <BsBookmarkStarFill size={24} color='orange' />
                    </div>
                </div>
                <div className='my-2 flex items-center justify-between gap-2'>
                    <span className='font-bold flex-3 text-green-600  whitespace-nowrap overflow-hidden text-ellipsis'>{attributes?.price}</span>
                    <span className='flex-1'>{attributes?.acreage}</span>
                    <span className='flex-3 whitespace-nowrap overflow-hidden text-ellipsis'>
                        {`${address.split(',')[address.split(',').length - 2]}${address.split(',')[address.split(',').length - 1]}`}
                    </span>
                </div>
                <p className='text-gray-500 w-full h-[50px] text-ellipsis overflow-hidden'>
                    {description}
                </p>
                <div className='flex items-center my-5 justify-between'>
                    <div className=' flex items-center'>
                        <img src={img5} alt="avatar" className='w-[30px] h-[30px] object-cover rounded-full' />
                        <p>{user?.name}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <button
                            type='button'
                            className='bg-blue-700 text-white p-1 rounded-md'
                        >
                            {`Gọi ${user?.phone}`}
                        </button>
                        <button
                            type='button'
                            className='text-blue-700 px-1 rounded-md border border-blue-700'
                        >
                            Nhắn zalo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Gọi component Item với dữ liệu giả
const FakeDataComponent = () => {
    return <Item {...fakeData} />;
};

export default memo(FakeDataComponent);
