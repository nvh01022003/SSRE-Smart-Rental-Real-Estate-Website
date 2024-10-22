import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'react-image-lightbox/style.css'; // Import CSS cho lightbox
import Lightbox from 'react-image-lightbox';
import icons from '../../ultils/icons'
import { useSelector } from 'react-redux';
import axios from 'axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { FaFlag, FaMapMarkerAlt, FaDollarSign, FaClock, FaStar } from 'react-icons/fa'; // Importing relevant icons

//import { useMemo } from 'react';

const { RiCrop2Line, GrStar } = icons

const DetailPost = () => {
    const location = useLocation();
    const { id } = useParams();
    const token = useSelector(state => state.auth);

    const [data, setData] = useState(null);
    //const data = location.state.fakeData; // Extracting the passed fakeData

    // // Generate the Google Maps iframe URL using the address from data
    // const googleMapsUrl = useMemo(() => {
    //     const baseUrl = "https://www.google.com/maps/embed/v1/place";
    //     const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Make sure you have your Google Maps API key
    //     const encodedAddress = encodeURIComponent(data.address); // URL encode the address
    //     return `${baseUrl}?key=${apiKey}&q=${encodedAddress}`;
    // }, [data.address]);

    const [isOpen, setIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/user/tenants/showDetailPost/${id}`
                    //     , {
                    //     headers: {
                    //         'token': `${token}`,
                    //     }
                    // }
                );
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

    // if (!data) {
    //     return <div>Loading...</div>;
    // }

    // Hàm chuyển đổi chuỗi iframe không hợp lệ thành JSX hợp lệ
    const fixIframeHtml = (iframeString) => {
        // Loại bỏ dấu \ và thay thế các thuộc tính không hợp lệ của JSX
        return iframeString
            .replace(/\\/g, '') // Loại bỏ tất cả dấu \
            .replace('allowfullscreen=""', 'allowFullScreen') // Chuyển allowfullscreen="" thành allowFullScreen
            .replace('style="border:0;"', 'style={{border: 0}}') // Chuyển style từ chuỗi sang object
            .replace(/referrerpolicy="[^"]+"/g, ''); // Loại bỏ referrerpolicy nếu không cần thiết trong JSX
    };

    // Component để hiển thị iframe từ API
    const MapComponent = ({ mapString }) => {
        const fixedIframe = fixIframeHtml(mapString);

        // Render iframe từ chuỗi HTML đã chỉnh sửa
        return (
            <div
                dangerouslySetInnerHTML={{ __html: fixedIframe }}
            />
        );
    };

    // Dữ liệu giả từ BE
    //const mapResponse = "<iframe src=\"https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d7668.902703874087!2dundefined!3dundefined!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1729530897356!5m2!1svi!2s\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>";

    return (
        // <div className="container mx-auto py-4 px-6">
        //     {/* Slideshow phần hình ảnh */}
        //     <div className="mb-4">
        //         <div className="relative w-full h-[400px] bg-gray-200">
        //             <Swiper
        //                 modules={[Navigation, Pagination]}
        //                 navigation
        //                 pagination={{ clickable: true }}
        //                 spaceBetween={10}
        //                 slidesPerView={1}
        //                 loop={true}  // Bật tính năng loop
        //                 style={{ height: '100%' }} // Ensure swiper takes the full height
        //             >
        //                 {data.images.length > 0 ? (
        //                     data.images.map((img, index) => (
        //                         <SwiperSlide key={index} onClick={() => openLightbox(index)}>
        //                             <img
        //                                 src={img}
        //                                 alt={`preview-${index}`}
        //                                 className="w-full h-full object-contain"
        //                             />
        //                         </SwiperSlide>
        //                     ))
        //                 ) : (
        //                     <span>No Images Available</span>
        //                 )}
        //             </Swiper>
        //         </div>
        //     </div>
        //     {isOpen && (
        //         <Lightbox
        //             mainSrc={data.images[currentImage]}
        //             nextSrc={data.images[(currentImage + 1) % data.images.length]}
        //             prevSrc={data.images[(currentImage + data.images.length - 1) % data.images.length]}
        //             onCloseRequest={closeLightbox}
        //             onMovePrevRequest={() =>
        //                 setCurrentImage((currentImage + data.images.length - 1) % data.images.length)
        //             }
        //             onMoveNextRequest={() =>
        //                 setCurrentImage((currentImage + 1) % data.images.length)
        //             }
        //             imageCaption={`Image ${currentImage + 1} of ${data.images.length}`} // Tùy chỉnh chú thích ảnh nếu cần
        //         />
        //     )}


        //     {/* Thông tin bài đăng */}
        //     <div className="mb-5">
        //         {/* Title with stars */}
        //         <h1 className="text-2xl font-bold text-red-600 mb-5 flex-wrap">
        //             {Array(data.star).fill().map((_, i) => (
        //                 <GrStar key={i} className="inline-block mb-2 text-yellow-500" size={24} /> // Kích thước và màu của sao
        //             ))}
        //             {data.title}
        //         </h1>

        //         {/* Address with icon */}
        //         <div className="flex items-center text-gray-500 mb-5">
        //             <FaMapMarkerAlt className="mr-2" /> {/* Address icon */}
        //             <span className="font-semibold">Địa chỉ : </span> {/* Label */}
        //             <span className='ml-1'>{data.address}</span> {/* Address data */}
        //         </div>

        //         {/* Price, Acreage, and Update Info with Icons */}
        //         <div className="flex items-center space-x-4 mt-2">
        //             {/* Price with icon */}
        //             <div className="flex items-center">
        //                 <FaDollarSign className=" text-green-600 mt-0.5" /> {/* Price icon */}
        //                 <span className="text-xl font-semibold text-green-600">{data.attributes.price}</span>
        //             </div>

        //             {/* Acreage with icon */}
        //             <div className="flex items-center pl-20">
        //                 <RiCrop2Line className="mr-2 text-gray-500" /> {/* Acreage icon */}
        //                 <span>{data.attributes.acreage}</span>
        //             </div>

        //             {/* Update time with icon */}
        //             <div className="flex items-center pl-20">
        //                 <FaClock className="mr-1.5 text-gray-500" /> {/* Time icon */}
        //                 <span>Cập nhật: 10/2024</span>
        //             </div>
        //         </div>
        //     </div>


        //     {/* Thông tin mô tả */}
        //     <div className="mb-4 ">
        //         <h2 className="text-lg font-semibold mb-2">Thông tin mô tả</h2>
        //         <p>{data.description}</p>
        //         <ul className="list-disc list-inside">
        //             <li>Diện tích: {data.attributes.acreage}</li>
        //             <li>Giá: {data.attributes.price}</li>
        //             <li>Không phát sinh thêm phí phụ thu khác</li>
        //         </ul>
        //         <p>Zalo: {data.user.phone} - liên hệ để biết thêm thông tin</p>
        //     </div>

        //     <h2 className="text-lg font-semibold">Đặc điểm tin đăng</h2>

        //     {/* Đặc điểm tin đăng */}
        //     <div className="mb-5 border  rounded-md bg-gray-50">

        //         <table className="w-full text-normal">
        //             <tbody>
        //                 <tr className='h-8'>
        //                     <td className="font-normal pl-2">Mã tin : </td>
        //                     <td>{data.id}</td>
        //                 </tr>
        //                 <tr className="bg-gray-200 h-8">
        //                     <td className="font-normal pl-2">Chuyên mục : </td>
        //                     <td className="text-blue-600">	Cho thuê căn hộ dịch vụ Quận Bình Tân</td>
        //                 </tr>
        //                 <tr className='h-8'>
        //                     <td className="font-normal pl-2">Khu vực : </td>
        //                     <td>Cho thuê căn hộ dịch vụ Hồ Chí Minh</td>
        //                 </tr>
        //                 <tr className="bg-gray-200 h-8">
        //                     <td className="font-normal pl-2">Loại tin : </td>
        //                     <td>Cho thuê căn hộ dịch vụ</td>
        //                 </tr>
        //                 <tr className='h-8'>
        //                     <td className="font-normal pl-2">Đối tượng cho thuê : </td>
        //                     <td>Tất cả</td>
        //                 </tr>
        //                 <tr className="bg-gray-200 h-8">
        //                     <td className="font-normal pl-2">Gói tin : </td>
        //                     <td className="text-red-600">Tin VIP nổi bật</td>
        //                 </tr>
        //                 <tr className='h-8'>
        //                     <td className="font-normal pl-2">Ngày đăng : </td>
        //                     <td>Chủ Nhật, 14:00 13/10/2024</td>
        //                 </tr>
        //                 <tr className="bg-gray-200 h-8">
        //                     <td className="font-normal pl-2">Ngày hết hạn : </td>
        //                     <td>Thứ 4, 14:00 16/10/2024</td>
        //                 </tr>
        //             </tbody>
        //         </table>
        //     </div>

        //     {/* Thông tin liên hệ */}
        //     <div className="mb-5">
        //         <h2 className="text-lg font-semibold mb-1">Thông tin liên hệ</h2>
        //         <p>Họ và tên : <span className="font-semibold">{data.user.name}</span></p>
        //         <p>Số điện thoại : <span className="font-semibold">{data.user.phone}</span></p>
        //     </div>

        //     {/* Bản đồ */}
        //     <div className="mb-10">
        //         <h2 className="text-lg font-semibold mb-1">Bản đồ</h2>
        //         <div className="w-full h-96 bg-gray-200">
        //             {/* Chèn iframe Google Maps */}
        //             <iframe
        //                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.489502299265!2d106.69284081462147!3d10.762622992331242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175292920f54d1f%3A0x944cb2738c30969b!2zTmfDtCBUw6F0IFThuqE!5e0!3m2!1svi!2s!4v1634878894860!5m2!1svi!2s"
        //                 width="100%"
        //                 height="100%"
        //                 style={{ border: 0 }}
        //                 allowFullScreen=""
        //                 loading="lazy"
        //                 title="Bản đồ vị trí"
        //             />
        //         </div>

        //         {/* phần sẽ thay đổi thành địa chỉ của bạn khi có api maps
        //         <div className="w-full h-96 bg-gray-200">
        //             <iframe
        //                 src={googleMapsUrl}
        //                 width="100%"
        //                 height="100%"
        //                 style={{ border: 0 }}
        //                 allowFullScreen=""
        //                 loading="lazy"
        //                 title="Bản đồ vị trí"
        //             />
        //         </div> */}

        //     </div>

        //     {/* Nút đánh giá */}
        //     <button className="flex items-center text-blue-600 border border-blue-600 rounded-md px-3 py-2 hover:bg-blue-100">
        //         <FaFlag className="mr-2" /> {/* Flag icon */}
        //         Gửi báo cáo
        //     </button>
        // </div>

        <div>
            {/* //     <h1>Google Maps Iframe</h1>
        //     <MapComponent mapString={mapResponse} /> */}
        </div>
    );
};

export default DetailPost;
