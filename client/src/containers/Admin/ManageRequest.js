import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpgradeRequests } from '../../store/actions/admin';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'swiper/swiper-bundle.css';
import 'react-image-lightbox/style.css';
import axios from 'axios';
import Swal from 'sweetalert2';
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

const ManageRequest = () => {
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);
    const { upgradeRequests } = useSelector(state => state.admin);
    const [isOpen, setIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [lightboxImages, setLightboxImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    useEffect(() => {
        dispatch(fetchUpgradeRequests(token, 1));
    }, [dispatch, token]);

    const formatBirthday = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const openLightbox = (images, index) => {
        setLightboxImages(images);
        setCurrentImage(index);
        setIsOpen(true);
    };

    const closeLightbox = () => {
        setIsOpen(false);
    };

    const handleApprove = async (userId, email) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`http://localhost:5000/api/v1/admin/changeRoleUser/${userId}`, { email }, {
                headers: { 'token': token }
            });
            if (response.data.err === 0) {
                Swal.fire({
                    title: 'Thành công',
                    text: 'Đơn phê duyệt đã được gửi thông báo cho người dùng !',
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false
                });
                dispatch(fetchUpgradeRequests(token, 1));
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: response.data.msg,
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error approving request:', error);
            Swal.fire({
                title: 'Lỗi',
                text: 'Đã xảy ra lỗi khi phê duyệt yêu cầu',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async (userId, email) => {
        const { value: reasonRejectUpgradeRequest } = await Swal.fire({
            title: 'Lí do xóa yêu cầu nâng cấp tài khoản',
            input: 'textarea',
            inputPlaceholder: 'Nhập lí do xóa yêu cầu nâng cấp tài khoản...',
            showCancelButton: true,
            confirmButtonText: 'Gửi',
            cancelButtonText: 'Hủy',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'custom-confirm',
                cancelButton: 'custom-cancel',
            },
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();

                confirmButton.style.backgroundColor = 'red';
                confirmButton.style.color = 'white';
                confirmButton.style.padding = '8px 16px';
                confirmButton.style.marginRight = '20px';
                confirmButton.style.borderRadius = '4px';
                confirmButton.style.border = 'none';
                confirmButton.style.cursor = 'pointer';

                cancelButton.style.backgroundColor = 'gray';
                cancelButton.style.color = 'white';
                cancelButton.style.padding = '8px 16px';
                cancelButton.style.borderRadius = '4px';
                cancelButton.style.border = 'none';
                cancelButton.style.cursor = 'pointer';
            },
            html: `
                <style>
                .custom-title {
                    font-size: 20px;
                    font-weight: bold;
                }
                .swal2-popup {
                    width: 500px;
                }
                .swal2-validation-message {
                    color: red;
                }
            </style>
            `,
            preConfirm: () => {
                const reason = Swal.getInput().value;
                if (!reason) {
                    Swal.showValidationMessage('Vui lòng nhập lý do xóa yêu cầu nâng cấp tài khoản !');
                }
                return reason;
            }
        });

        if (reasonRejectUpgradeRequest) {
            setIsLoading(true);
            try {
                const response = await axios.put(`http://localhost:5000/api/v1/admin/rejectUpgradeRequest/${userId}`,
                    { email, reasonRejectUpgradeRequest },
                    {
                        headers: { 'token': token },
                    });
                if (response.data.err === 0) {
                    Swal.fire({
                        title: 'Xóa yêu cầu nâng cấp thành công !',
                        text: 'Yêu cầu nâng cấp đã được xóa',
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false,
                        buttonsStyling: false,
                        didOpen: () => {
                            const confirmButton = Swal.getConfirmButton();
                            confirmButton.style.backgroundColor = 'green';
                            confirmButton.style.color = 'white';
                            confirmButton.style.padding = '8px 16px';
                            confirmButton.style.borderRadius = '4px';
                            confirmButton.style.border = 'none';
                            confirmButton.style.cursor = 'pointer';
                        },
                        html: `
                        <style>
                            .swal2-popup {
                                width: 300px;
                            }
                        </style>
                    `,
                    });
                    setTimeout(() => {
                        dispatch(fetchUpgradeRequests(token, 1));
                    }, 1);
                }
            } catch (error) {
                console.log('error when reject upgrade request: ', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Xóa yêu cầu nâng cấp tài khoản thất bại !',
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false,
                    buttonsStyling: false,
                    didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
                        confirmButton.style.backgroundColor = 'darkred';
                        confirmButton.style.color = 'white';
                        confirmButton.style.padding = '8px 16px';
                        confirmButton.style.borderRadius = '4px';
                        confirmButton.style.border = 'none';
                        confirmButton.style.cursor = 'pointer';
                    },
                    html: `
                        <style>
                            .swal2-popup {
                                width: 300px;
                            }
                        </style>
                    `,
                });
            } finally {
                setIsLoading(false);
            }
        }
    }

    const totalPages = Math.ceil(upgradeRequests.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = upgradeRequests.slice(indexOfFirstItem, indexOfLastItem);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: currentImage,
        afterChange: (current) => setCurrentImage(current),
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg h-full flex flex-col">
            <h2 className="text-3xl font-medium mb-10">Quản lý yêu cầu nâng cấp tài khoản</h2>
            {isLoading || !upgradeRequests.length ? (
                <div className="text-center items-center py-4">
                    {isLoading ? <Loading /> : 'Không có yêu cầu nâng cấp tài khoản từ người dùng hệ thống !'}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
                        {currentItems.map((request) => (
                            <div
                                key={request.user_id}
                                className="relative bg-white rounded-lg shadow-xl p-6 transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-300"
                                style={{ minHeight: '380px' }}
                            >
                                <div className="relative w-full h-[200px] bg-gray-200 cursor-pointer">
                                    <Swiper
                                        modules={[Navigation, Pagination]}
                                        navigation
                                        pagination={{ clickable: true }}
                                        spaceBetween={10}
                                        slidesPerView={1}
                                        loop={true}
                                        style={{ height: '100%' }}
                                    >
                                        {JSON.parse(request.id_card_image_url).length > 0 ? (
                                            JSON.parse(request.id_card_image_url).map((img, index) => (
                                                <SwiperSlide key={index} onClick={() => openLightbox(JSON.parse(request.id_card_image_url), index)}>
                                                    <img
                                                        src={img}
                                                        alt={`preview-${index}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </SwiperSlide>
                                            ))
                                        ) : (
                                            <span>No Images Available</span>
                                        )}
                                    </Swiper>
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-center mt-2">{request.full_name}</h3>
                                <div className="space-y-2 mb-10">
                                    <p><span className="font-medium">Ngày sinh :</span> {formatBirthday(request.date_of_birth)}</p>
                                    <p><span className="font-medium">Số CCCD   <span className='ml-2.5'>:</span></span> {request.id_card_number}</p>
                                    <p><span className="font-medium">Địa chỉ   <span className='ml-6'>:</span></span> {request.address}</p>
                                </div>
                                <div className="absolute bottom-4 left-5 right-5 flex justify-between space-x-5">
                                    <button
                                        onClick={() => handleApprove(request.user_id, request.User.email)}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition duration-300"
                                    >
                                        Phê duyệt
                                    </button>
                                    <button
                                        onClick={() => handleReject(request.user_id, request.User.email)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-300"
                                    >
                                        Từ chối
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center">
                            <label className="mr-2 text-gray-500">Hiển thị</label>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="border border-gray-300 rounded px-2 py-1"
                            >
                                <option value={3}>3</option>
                                <option value={6}>6</option>
                                <option value={9}>9</option>
                            </select>
                            <span className="ml-2 text-gray-500">yêu cầu mỗi trang</span>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handlePreviousPage}
                                className="px-4 py-2 bg-gray-200 rounded-full mr-2"
                                disabled={currentPage === 1}
                            >
                                Trước
                            </button>
                            <span className="text-gray-500">{currentPage} trên {totalPages} trang</span>
                            <button
                                onClick={handleNextPage}
                                className="px-4 py-2 bg-gray-200 rounded-full ml-2"
                                disabled={currentPage === totalPages}
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </>
            )}
            {isOpen && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative w-full max-w-4xl rounded-lg shadow-xl p-4">
                        <button
                            className="absolute top-2 right-2 z-50 bg-white text-black rounded-full p-2 shadow-lg hover:text-white hover:bg-red-500 transition-colors duration-300"
                            onClick={closeLightbox}
                            style={{
                                fontSize: "20px",  // Giảm kích thước của icon
                                width: "40px",     // Giới hạn kích thước nút
                                height: "40px",    // Giới hạn kích thước nút
                                borderRadius: "50%",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                display: "flex",   // Đảm bảo nội dung được canh giữa
                                justifyContent: "center", // Canh giữa icon
                                alignItems: "center", // Canh giữa icon
                                transition: "all 0.3s ease", // Thêm chuyển tiếp mượt mà
                            }}
                        >
                            &times;
                        </button>

                        <Slider
                            {...settings}
                            prevArrow={<CustomPrevArrow />}
                            nextArrow={<CustomNextArrow />}
                        >
                            {lightboxImages.map((img, index) => (
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
        </div>

    );
};

export default ManageRequest;