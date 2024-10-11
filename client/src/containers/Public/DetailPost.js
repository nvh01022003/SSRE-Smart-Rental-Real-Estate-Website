// import React from 'react';

// const DetailPost = () => {
//     return (
//         <div className="container mx-auto py-4 px-6">
//             {/* Slideshow phần hình ảnh */}
//             <div className="mb-4">
//                 <div className="relative w-full h-96 bg-gray-200">
//                     {/* Thay bằng carousel hình ảnh */}
//                     <div className="absolute inset-0 flex justify-center items-center">
//                         <span>Carousel images here</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Thông tin bài đăng */}
//             <div className="mb-4">
//                 <h1 className="text-2xl font-bold text-red-600">
//                     ⭐⭐⭐⭐ Phòng cho thuê 2.800.000 đường Ngô Tất Tố, Q. Bình Thạnh...
//                 </h1>
//                 <p className="text-gray-500">Ngô Tất Tố, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh</p>
//                 <p className="text-xl font-semibold text-green-600">2.8 triệu/tháng</p>
//                 <div className="flex items-center space-x-2">
//                     <span>12m²</span>
//                     <span>|</span>
//                     <span>Cập nhật: 10/2024</span>
//                 </div>
//             </div>

//             {/* Thông tin mô tả */}
//             <div className="mb-4">
//                 <h2 className="text-lg font-semibold">Thông tin mô tả</h2>
//                 <p>Phòng đẹp sạch sẽ, có đầy đủ nội thất...</p>
//                 <ul className="list-disc list-inside">
//                     <li>Diện tích: 12m²</li>
//                     <li>Giá: 2.8 triệu/tháng</li>
//                     <li>Không phát sinh thêm phí phụ thu khác</li>
//                 </ul>
//                 <p>Zalo: 0123456789 - liên hệ để biết thêm thông tin</p>
//             </div>

//             {/* Đặc điểm tin đăng */}
//             <div className="mb-4 border p-4 rounded-md bg-gray-50">
//                 <h2 className="text-lg font-semibold">Đặc điểm tin đăng</h2>
//                 <table className="w-full text-sm">
//                     <tbody>
//                         <tr>
//                             <td className="font-semibold">Mã tin</td>
//                             <td>#12345</td>
//                         </tr>
//                         <tr>
//                             <td className="font-semibold">Loại tin</td>
//                             <td>Cho thuê phòng trọ</td>
//                         </tr>
//                         <tr>
//                             <td className="font-semibold">Giá</td>
//                             <td>2.8 triệu/tháng</td>
//                         </tr>
//                         <tr>
//                             <td className="font-semibold">Ngày đăng</td>
//                             <td>10/10/2024</td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>

//             {/* Thông tin liên hệ */}
//             <div className="mb-4">
//                 <h2 className="text-lg font-semibold">Thông tin liên hệ</h2>
//                 <p>Liên hệ: <span className="font-semibold">Kim Khánh</span></p>
//                 <p>Số điện thoại: <span className="font-semibold">0123456789</span></p>
//             </div>

//             {/* Bản đồ */}
//             <div className="mb-4">
//                 <h2 className="text-lg font-semibold">Bản đồ</h2>
//                 <div className="w-full h-96 bg-gray-200">
//                     {/* Chèn iframe Google Maps */}
//                     <iframe
//                         src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.489502299265!2d106.69284081462147!3d10.762622992331242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175292920f54d1f%3A0x944cb2738c30969b!2zTmfDtCBUw6F0IFThuqE!5e0!3m2!1svi!2s!4v1634878894860!5m2!1svi!2s"
//                         width="100%"
//                         height="100%"
//                         style={{ border: 0 }}
//                         allowFullScreen=""
//                         loading="lazy"
//                         title="Bản đồ vị trí"
//                     />
//                 </div>
//             </div>

//             {/* Nút chia sẻ */}
//             <div className="text-center">
//                 <button className="bg-blue-600 text-white py-2 px-4 rounded-md">Chia sẻ bài đăng</button>
//             </div>
//         </div>
//     );
// };

// export default DetailPost;


import React from 'react';
import { useLocation } from 'react-router-dom';
import Carousel from 'react-multi-carousel'; // Dùng thư viện Carousel để hiển thị ảnh
import 'react-multi-carousel/lib/styles.css';

const DetailPost = () => {
    const location = useLocation();
    const { images, user, title, star, description, attributes, address } = location.state.fakeData; // Nhận dữ liệu từ state

    return (
        <div className="container mx-auto py-4 px-6">
            {/* Phần Carousel hình ảnh */}
            <div className="mb-4">
                <Carousel
                    additionalTransfrom={0}
                    arrows
                    autoPlaySpeed={3000}
                    centerMode={false}
                    className=""
                    containerClass="container-with-dots"
                    dotListClass=""
                    draggable
                    infinite
                    itemClass=""
                    keyBoardControl
                    minimumTouchDrag={80}
                    renderButtonGroupOutside={false}
                    renderDotsOutside={false}
                    responsive={{
                        desktop: {
                            breakpoint: { max: 3000, min: 1024 },
                            items: 1,
                            slidesToSlide: 1, // Thiết lập số lượng slide khi chuyển
                        },
                        tablet: {
                            breakpoint: { max: 1024, min: 464 },
                            items: 1,
                            slidesToSlide: 1,
                        },
                        mobile: {
                            breakpoint: { max: 464, min: 0 },
                            items: 1,
                            slidesToSlide: 1,
                        },
                    }}
                    showDots={true}
                    sliderClass=""
                    swipeable
                >
                    {images.map((image, index) => (
                        <img key={index} src={image} alt={`Image ${index}`} className="w-full h-[400px] object-cover" />
                    ))}
                </Carousel>
            </div>

            {/* Thông tin chi tiết bài đăng */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-red-600">{title}</h1>
                <p className="text-gray-500">{address}</p>
                <p className="text-xl font-semibold text-green-600">{attributes.price}</p>
                <div className="flex items-center space-x-2">
                    <span>{attributes.acreage}</span>
                    <span>|</span>
                    <span>{`Cập nhật: ${new Date().toLocaleDateString()}`}</span>
                </div>
            </div>

            {/* Thông tin mô tả */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Thông tin mô tả</h2>
                <p>{description}</p>
            </div>

            {/* Thông tin liên hệ */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Thông tin liên hệ</h2>
                <p>Liên hệ: <span className="font-semibold">{user.name}</span></p>
                <p>Số điện thoại: <span className="font-semibold">{user.phone}</span></p>
            </div>
        </div>
    );
};

export default DetailPost;
