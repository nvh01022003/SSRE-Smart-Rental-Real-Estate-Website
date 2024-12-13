import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'react-image-lightbox/style.css'; // Import CSS cho lightbox
import icons from '../../ultils/icons';
import { BsBookmarkStarFill } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { getTotalPostSaved, fetchSavedPosts } from '../../store/actions/post';
import axios from 'axios';
import { formatVietnameseToString } from '../../ultils/Common/formatVietnameseToString';
import { useNavigate } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FaFlag, FaMapMarkerAlt, FaDollarSign, FaClock } from 'react-icons/fa'; // Importing relevant icons

import Loading from '../../components/Loading';

const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <button
            className={`${className} absolute top-1/2 left-2 transform -translate-y-1/2 z-50 bg-white text-black rounded-full p-8 shadow-lg`}
            style={{ ...style, display: "block", fontSize: "32px" }}
            onClick={onClick}
        >
            &#9664;
        </button>
    );
};

const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <button
            className={`${className} absolute top-1/2 right-2 transform -translate-y-1/2 z-50 bg-white text-black rounded-full p-8 shadow-lg`}
            style={{ ...style, display: "block", fontSize: "32px" }}
            onClick={onClick}
        >
            &#9654;
        </button>
    );
};

const { RiCrop2Line } = icons;


const DetailPost = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useSelector(state => state.auth);
    const [typePosts, setTypePosts] = useState([]);
    const [data, setData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    // Thêm state để quản lý trạng thái lưu:
    const [isStarred, setIsStarred] = useState(0);
    const dispatch = useDispatch();

    //call api đến BE
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/user/tenants/showDetailPost/${id}`, {
                    headers: {
                        'token': `${token}`,
                    }
                });
                //console.log(response)
                setData(response.data.msg);
                setIsStarred(parseInt(response.data.msg.statusSave));
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
        const fetchTypePost = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/admin/showAllTypePost', {
                    headers: {
                        'token': `${token}`,
                    }
                });
                if (res.data.err === 0) {
                    setTypePosts(res.data.postType);
                }
            } catch (error) {
                console.error('Error fetching typePosts:', error);
            }
        };
        fetchTypePost();
        fetchData();
    }, [id, token]);

    // Thêm hàm xử lý khi nhấn nút Lưu:
    const handleSaveClick = async () => {
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
                        text: 'Bạn chỉ được lưu tối đa 3 tin đăng trong vòng 30 giây. Vui lòng thử lại sau 30 giây nữa!',
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
            const formattedPrice = (priceNumber / 1_000_000).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
            return formattedPrice + ' triệu đồng'; // Đơn vị triệu, với dấu phẩy
        } else {
            return priceNumber.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) + ' đồng'; // Đơn vị đồng, với dấu phẩy
        }
    };


    //check nếu chưa có data
    if (!data) {
        return <div><Loading /></div>;
    }

    const settings = {
        dots: true,
        infinite: data.images.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: currentImage,
        afterChange: (current) => setCurrentImage(current),
        arrows: data.images.length > 1,
    };

    return (
        <div className="container mx-auto py-4 px-6">
            {/* Slideshow phần hình ảnh */}
            <div className="mb-4">
                <div className="relative w-full h-[400px] bg-gray-200 cursor-pointer hover:bg-gray-300 transition duration-300 rounded-lg border-2 border-gray-300 hover:border-gray-500">
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
                                        className="w-full h-full object-contain rounded-lg shadow-lg hover:shadow-xl transition duration-300"
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
                <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative w-full max-w-4xl rounded-lg shadow-xl p-4">
                        <button
                            className="absolute top-2 right-2 z-50 bg-white text-black rounded-full p-2 shadow-lg hover:text-white hover:bg-red-500 transition-colors duration-300"
                            onClick={closeLightbox}
                            style={{
                                fontSize: "20px",
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                transition: "all 0.3s ease",
                            }}
                        >
                            &times;
                        </button>

                        <Slider
                            {...settings}
                            prevArrow={<CustomPrevArrow />}
                            nextArrow={<CustomNextArrow />}
                        >
                            {data.images.map((img, index) => (
                                <div key={index}>
                                    <img
                                        src={img}
                                        alt={`preview-${index}`}
                                        className="w-full h-[500px] object-cover rounded-lg shadow-md"
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            )}

            {/* Thông tin bài đăng */}
            <div className="mb-5">
                <div className="flex items-start gap-3">
                    {/* Container cho tiêu đề */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-medium text-red-600 mb-5 flex-wrap uppercase w-[92%]">
                            {data.title}
                        </h1>
                    </div>

                    {/* Nút Lưu */}
                    <button
                        className="flex gap-1 text-red-500 hover:text-red-600 transition duration-300"
                        onClick={handleSaveClick}
                    >
                        <BsBookmarkStarFill size={24} color={isStarred === 1 ? 'red' : 'orange'} />
                        <span className="text-lg font-semibold">{isStarred === 1 ? 'Đã lưu' : 'Lưu'}</span>
                    </button>
                </div>


                {/* Address with icon */}
                <div className="text-xl flex items-center text-gray-600 mb-5">
                    <FaMapMarkerAlt className="mr-2" /> {/* Address icon */}
                    <span className="font-semibold">Địa chỉ : </span> {/* Label */}
                    <span className='ml-1'>{`${data.address.detail_address}, ${data.address.district}, ${data.address.city}`}</span> {/* Address data */}
                </div>

                {/* Price, Acreage, and Update Info with Icons */}
                <div className="text-xl flex items-center w-full mt-2">
                    {/* Price with icon */}
                    <div className="flex items-center w-[25%]">
                        <FaDollarSign className=" text-green-600 mt-0.5" /> {/* Price icon */}
                        <span className="font-semibold text-green-600">{formatPrice(data.price)}/tháng</span>
                    </div>

                    {/* Acreage with icon */}
                    <div className="flex items-center pl-10 w-[25%]">
                        <RiCrop2Line className="mr-2 text-gray-500" /> {/* Acreage icon */}
                        <span>{parseInt(data.acreage)} m²</span>
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
            <div className="mb-4 mt-10">
                <h2 className="text-xl font-semibold mb-2">Thông tin mô tả</h2>
                {data.description.split('.').filter(sentence => sentence.trim() !== '').map((sentence, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <span className="text-gray-700">{sentence.trim()}.</span>
                    </div>
                ))}
            </div>

            <div className='flex gap-5 mt-10'>
                {/* Đặc điểm tin đăng */}
                <div className='w-[50%]'>
                    <h2 className="text-xl font-semibold mb-2">Đặc điểm tin đăng</h2>

                    <div className="mb-5 border  rounded-md bg-gray-50 ">
                        <table className="w-full text-normal">
                            <tbody>
                                <tr className='bg-gray-200 h-8'>
                                    <td className="font-normal pl-2">Mã tin : </td>
                                    <td>#{data.id}</td>
                                </tr>
                                <tr className="h-8">
                                    <td className="font-normal pl-2">Chuyên mục : </td>
                                    <td className='underline text-blue-700 font-medium hover:cursor-pointer hover:text-orange-700'
                                        onClick={() => navigate(`/${formatVietnameseToString(data.category.category_name)}`)}
                                    >
                                        {data.category.category_name}
                                    </td>
                                </tr>
                                <tr className='bg-gray-200 h-8'>
                                    <td className="font-normal pl-2">Loại tin : </td>
                                    <td className='text-red-500'>{typePosts.find(postType => postType.id === parseInt(data.postType_id))?.name || data.postType_id}</td>
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
                <div className='w-[50%] '>
                    <div>
                        <h2 className="text-xl font-semibold mb-3">Thông tin liên hệ</h2>
                        {data.user.img_avt && (
                            <img
                                src={data.user.img_avt}
                                alt="Avatar"
                                className="w-[113px] h-[113px] rounded-full mb-3"
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
            <div className="mb-10 mt-10">
                <h2 className="text-xl font-semibold mb-3">Bản đồ</h2>
                {/* Address */}
                <div className="text-normal flex items-center text-gray-600 mb-5">
                    <span className="font-semibold">Địa chỉ : </span> {/* Label */}
                    <span className='ml-1'>{`${data.address.detail_address}, ${data.address.district}, ${data.address.city}`}</span> {/* Address data */}
                </div>
                <div className="w-full h-96 bg-gray-200">
                    <MapComponent mapString={data.map} />
                </div>
            </div>

            {/* Nút đánh giá */}
            {/* <button className="flex items-center text-blue-600 border border-blue-600 rounded-md px-3 py-2 hover:bg-blue-100">
                <FaFlag className="mr-2" /> 
                Gửi báo cáo
            </button> */}
        </div>
    );
};

export default DetailPost;