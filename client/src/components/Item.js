import React, { memo, useState } from 'react';
import icons from '../ultils/icons';
import { useNavigate } from 'react-router-dom';
import { formatVietnameseToString } from '../ultils/Common/formatVietnameseToString';
import img5 from '../assets/anon-avatar.png';
import { FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';

const { RiCrop2Line } = icons

const indexs = [0, 1, 2, 3];

const { GrStar, BsBookmarkStarFill } = icons;

const Item = ({ images, user, title, star, description, attributes, address, id }) => {
    const [isHoverHeart, setIsHoverHeart] = useState(false);

    const handleStar = (star) => {
        let stars = [];
        for (let i = 1; i <= +star; i++) {
            stars.push(<GrStar className='star-item' size={20} color='#FFB300' />);
        }
        return stars;
    };

    const [isStarred, setIsStarred] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Trong component Item
    const navigate = useNavigate();

    const handleClick = () => {
        setIsStarred(!isStarred); // Toggle trạng thái màu đỏ khi click
    };

    // Hàm định dạng số tiền với đơn vị "đồng", "nghìn", "trăm nghìn", "triệu"
    const formatPrice = (price) => {
        const priceNumber = parseFloat(price); // Chuyển chuỗi thành số

        if (priceNumber >= 1_000_000) {
            return (priceNumber / 1_000_000).toFixed(2).toLocaleString('vi-VN', { minimumFractionDigits: 2 }) + ' triệu đồng'; // Đơn vị triệu, với dấu phẩy
        }
        else {
            return priceNumber.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) + ' đồng'; // Đơn vị đồng, với dấu phẩy
        }
    };

    return (
        <div className='w-full flex border-t border-orange-600 py-4 bg-[#fff9f3] px-4'>
            <div
                className='w-2/5 flex flex-wrap  items-center relative '
                onClick={() => navigate(`/chi-tiet/${formatVietnameseToString(title)}/${id}`)}

            >
                {/* {images.length > 0 && images.filter((i, index) => indexs.some(i => i === index))?.map((i, index) => {
                    return (
                        <img key={index} src={i} alt="preview" className='w-[47%] h-[120px] object-cover' />
                    );
                })} */}
                {images.length > 0 && (
                    <img src={images[0]} alt="preview" className='w-[90%] h-[235px] object-cover cursor-pointer' />
                )}
                <span className='bg-overlay-70 text-white px-2 rounded-md absolute left-1 bottom-4'>{`${images.length} ảnh`}</span>
                {/* <span
                    className='text-white absolute right-5 bottom-1'
                    onMouseEnter={() => setIsHoverHeart(true)}
                    onMouseLeave={() => setIsHoverHeart(false)}
                >
                    {isHoverHeart ? <RiHeartFill size={26} color='red' /> : <RiHeartLine size={26} />}
                </span> */}
            </div>

            <div className='w-3/5'>
                <div className='flex justify-between gap-4 w-full'>
                    <div className=' flex-wrap'>
                        {handleStar(+star).length > 0 && handleStar(+star).map((star, number) => {
                            return (
                                <span key={number} className='h-5'>{star}</span>
                            );
                        })}
                        <span className='text-red-600 font-medium cursor-pointer hover:underline text-lg' onClick={() => navigate(`/chi-tiet/${formatVietnameseToString(title)}/${id}`)}>
                            {title}
                        </span>
                    </div>
                    <div className='w-[10%]  justify-end pl-8'>
                        <button
                            className='hover:bg-red-50'
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={handleClick}
                        >
                            <BsBookmarkStarFill
                                size={30}
                                color={isStarred || isHovered ? 'red' : 'orange'} // Đổi màu khi hover và click
                            />
                            {/* Chèn thêm onclick navigate đến trang các bài đã lưu */}
                        </button>
                    </div>
                </div>
                <div className='my-2 flex items-center gap-10 '>
                    {/* Giá tiền với icon FaDollarSign */}
                    <span className='font-bold mr-5 text-green-600 whitespace-nowrap overflow-hidden text-ellipsis flex '>
                        <FaDollarSign className="inline-block pt-1 h-6" />
                        <p className='text-lg'>{formatPrice(attributes?.price)}/tháng</p>
                    </span>

                    {/* Diện tích với icon RiCrop2Line */}
                    <span className=''>
                        <RiCrop2Line className="inline-block  mb-1" /> {attributes?.acreage} m²
                    </span>
                </div>
                {/* Địa chỉ với icon FaMapMarkerAlt */}
                <span className='whitespace-nowrap overflow-hidden text-ellipsis text-gray-500'>
                    <FaMapMarkerAlt className="inline-block mb-1" />
                    {/* {`${address.split(',')[address.split(',').length - 2]}${address.split(',')[address.split(',').length - 1]}`} */}
                    {address}
                </span>
                <p className='text-gray-500 w-full h-[82px] text-ellipsis overflow-hidden pt-3'>
                    {description}
                </p>
                <div className='flex items-center mt-5 justify-between'>
                    <div className=' flex items-center'>
                        <img src={img5} alt="avatar" className='w-[30px] h-[30px] object-cover rounded-full mr-2' />
                        <p className='text-gray-500'>{user?.name}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <p className='text-gray-500'>Liên hệ :</p>
                        <button
                            type='button'
                            className='px-1 py--1 rounded-md font-medium border border-blue-500 text-blue-500 bg-red-50 hover:bg-blue-500 hover:text-white h-7'
                        >
                            {user?.phone}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default memo(Item);
