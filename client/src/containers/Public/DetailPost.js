import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'react-image-lightbox/style.css'; // Import CSS cho lightbox
import Lightbox from 'react-image-lightbox';
import icons from '../../ultils/icons';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { FaFlag, FaMapMarkerAlt, FaDollarSign, FaClock } from 'react-icons/fa'; // Importing relevant icons

const { RiCrop2Line } = icons;

const DetailPost = () => {
    const { id } = useParams();
    const token = useSelector(state => state.auth);

    const [data, setData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    //call api đến BE
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/user/tenants/showDetailPost/${id}`);
                console.log(response)
                setData(response.data.msg);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
        fetchData();
    }, [id, token]);

    const openLightbox = (index) => {
        setCurrentImage(index);
        setIsOpen(true);
    };

    const closeLightbox = () => {
        setIsOpen(false);
    };

    // Hàm lấy giá trị src từ chuỗi iframe
    const getIframeSrc = (iframeString) => {
        const srcMatch = iframeString.match(/src="([^"]+)"/);
        return srcMatch ? srcMatch[1] : ''; // Trả về giá trị src nếu tìm thấy, ngược lại trả về chuỗi rỗng
    };

    // Component để hiển thị iframe với src từ API
    const MapComponent = ({ mapString }) => {
        const iframeSrc = getIframeSrc(mapString); // Lấy giá trị src từ chuỗi iframe

        return (
            <div className="w-full h-96 bg-gray-200">
                <iframe
                    src={iframeSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Bản đồ vị trí"
                />
            </div>
        );
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
    const timeDiff = data?.updatedAt ? calculateTimeDifference(data.updatedAt) : '';

    // Hàm định dạng loại Target từ BE res về
    const getTargetLabel = (target) => {
        switch (target) {
            case '0':
                return 'Tất cả';
            case '1':
                return 'Nam';
            case '2':
                return 'Nữ';
            default:
                return 'Không xác định';
        }
    };

    // Hàm định dạng mục Ngày đăng, Ngày hết hạn
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

        const dayName = daysOfWeek[date.getDay()]; // Lấy tên ngày trong tuần
        const formattedDate = date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return `${dayName}, ${formattedTime} ngày ${formattedDate}`;
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


    //check nếu chưa có data
    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-4 px-6">
            {/* Slideshow phần hình ảnh */}
            <div className="mb-4">
                <div className="relative w-full h-[400px] bg-gray-200">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        spaceBetween={10}
                        slidesPerView={1}
                        loop={true}  // Bật tính năng loop
                        style={{ height: '100%' }} // Ensure swiper takes the full height
                    >
                        {data.images.length > 0 ? (
                            data.images.map((img, index) => (
                                <SwiperSlide key={index} onClick={() => openLightbox(index)}>
                                    <img
                                        src={img}
                                        alt={`preview-${index}`}
                                        className="w-full h-full object-contain"
                                    />
                                </SwiperSlide>
                            ))
                        ) : (
                            <span>No Images Available</span>
                        )}
                    </Swiper>
                </div>
            </div>
            {isOpen && (
                <Lightbox
                    mainSrc={data.images[currentImage]}
                    nextSrc={data.images[(currentImage + 1) % data.images.length]}
                    prevSrc={data.images[(currentImage + data.images.length - 1) % data.images.length]}
                    onCloseRequest={closeLightbox}
                    onMovePrevRequest={() =>
                        setCurrentImage((currentImage + data.images.length - 1) % data.images.length)
                    }
                    onMoveNextRequest={() =>
                        setCurrentImage((currentImage + 1) % data.images.length)
                    }
                    imageCaption={`Image ${currentImage + 1} of ${data.images.length}`} // Tùy chỉnh chú thích ảnh nếu cần
                />
            )}

            {/* Thông tin bài đăng */}
            <div className="mb-5">
                {/* Title with stars */}
                <h1 className="text-2xl font-bold text-red-600 mb-5 flex-wrap">
                    {data.title}
                </h1>

                {/* Address with icon */}
                <div className="flex items-center text-gray-500 mb-5">
                    <FaMapMarkerAlt className="mr-2" /> {/* Address icon */}
                    <span className="font-semibold">Địa chỉ : </span> {/* Label */}
                    <span className='ml-1'>{`${data.address.detail_address}, ${data.address.district}, ${data.address.city}`}</span> {/* Address data */}
                </div>

                {/* Price, Acreage, and Update Info with Icons */}
                <div className="flex items-center w-full mt-2">
                    {/* Price with icon */}
                    <div className="flex items-center w-[25%]">
                        <FaDollarSign className=" text-green-600 mt-0.5" /> {/* Price icon */}
                        <span className="text-xl font-semibold text-green-600">{formatPrice(data.price)}/tháng</span>
                    </div>

                    {/* Acreage with icon */}
                    <div className="flex items-center pl-10 w-[25%]">
                        <RiCrop2Line className="mr-2 text-gray-500" /> {/* Acreage icon */}
                        <span>{data.acreage} m²</span>
                    </div>

                    {/* Update time with icon */}
                    <div className="flex items-center  w-[25%]">
                        <FaClock className="mr-1.5 text-gray-500" /> {/* Time icon */}
                        <span>Cập nhật: {timeDiff}</span>
                    </div>

                    {/* Mã tin */}
                    <div className="flex items-center pl-14 w-[25%]">
                        <span>Mã tin: #{data.id}</span>
                    </div>
                </div>
            </div>

            {/* Thông tin mô tả */}
            <div className="mb-4 ">
                <h2 className="text-lg font-semibold mb-1">Thông tin mô tả</h2>
                <p>{data.description}</p>
            </div>

            <div className='flex gap-5'>
                {/* Đặc điểm tin đăng */}
                <div className='w-[50%]'>
                    <h2 className="text-lg font-semibold mb-1">Đặc điểm tin đăng</h2>

                    <div className="mb-5 border  rounded-md bg-gray-50 ">
                        <table className="w-full text-normal">
                            <tbody>
                                <tr className='h-8'>
                                    <td className="font-normal pl-2">Mã tin : </td>
                                    <td>#{data.id}</td>
                                </tr>
                                <tr className="bg-gray-200 h-8">
                                    <td className="font-normal pl-2">Chuyên mục : </td>
                                    <td className='underline text-blue-700 font-medium hover:cursor-pointer hover:text-orange-700'>
                                        {data.category.category_name}
                                    </td>
                                </tr>
                                <tr className='h-8'>
                                    <td className="font-normal pl-2">Khu vực : </td>
                                    <td>{data.overviews.area}</td>
                                </tr>
                                <tr className='bg-gray-200 h-8'>
                                    <td className="font-normal pl-2">Đối tượng cho thuê : </td>
                                    <td>{getTargetLabel(data.overviews.target)}</td>
                                </tr>
                                <tr className='h-8'>
                                    <td className="font-normal pl-2">Ngày đăng : </td>
                                    <td>{formatDate(data.createdAt)}</td>
                                </tr>
                                <tr className="bg-gray-200 h-8">
                                    <td className="font-normal pl-2">Ngày hết hạn : </td>
                                    <td>{formatDate(data.overviews.expire)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Thông tin liên hệ */}
                {/* Thông tin liên hệ */}
                <div className='w-[50%] '>
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Thông tin liên hệ</h2>
                        {data.user.img_avt && (
                            <img
                                src={data.user.img_avt}
                                alt="Avatar"
                                className="w-20 h-20 rounded-full mb-3"
                            />
                        )}
                    </div>

                    <div className="mb-5 border rounded-md bg-gray-50 overflow-x-auto">
                        <table className="w-full max-w-full text-normal rounded-md">
                            <tbody>
                                <tr className='bg-gray-200 h-8'>
                                    <td className="font-normal pl-2">Họ và tên :</td>
                                    <td className="font-semibold">{`${data.user.firstName} ${data.user.lastName}`}</td>
                                </tr>
                                <tr className="h-8">
                                    <td className="font-normal pl-2">Email :</td>
                                    <td className="font-semibold">{data.user.email}</td>
                                </tr>
                                <tr className='bg-gray-200 h-8'>
                                    <td className="font-normal pl-2">Số điện thoại :</td>
                                    <td className="font-semibold">{data.user.phone}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Bản đồ */}
            <div className="mb-10">
                <h2 className="text-lg font-semibold mb-1">Bản đồ</h2>
                {/* Address */}
                <div className="flex items-center text-gray-500 mb-5">
                    <span className="font-semibold">Địa chỉ : </span> {/* Label */}
                    <span className='ml-1'>{`${data.address.detail_address}, ${data.address.district}, ${data.address.city}`}</span> {/* Address data */}
                </div>
                <div className="w-full h-96 bg-gray-200">
                    <MapComponent mapString={data.map} />
                </div>
            </div>

            {/* Nút đánh giá */}
            <button className="flex items-center text-blue-600 border border-blue-600 rounded-md px-3 py-2 hover:bg-blue-100">
                <FaFlag className="mr-2" /> {/* Flag icon */}
                Gửi báo cáo
            </button>
        </div>
    );
};

export default DetailPost;