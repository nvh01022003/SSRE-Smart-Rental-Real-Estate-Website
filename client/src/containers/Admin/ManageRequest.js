import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpgradeRequests } from '../../store/actions/admin';
import Loading from '../../components/Loading';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css'; // Corrected import path
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageRequest = () => {
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);
    const { upgradeRequests } = useSelector(state => state.admin); // Removed pagination
    const [isOpen, setIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [lightboxImages, setLightboxImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // State để quản lý trạng thái loading

    useEffect(() => {
        dispatch(fetchUpgradeRequests(token, 1)); // Fetch the first page of upgrade requests
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
        setIsLoading(true); // Hiển thị thẻ Loading khi bắt đầu xử lý
        try {
            const response = await axios.put(`http://localhost:5000/api/v1/admin/changeRoleUser/${userId}`, { email }, {
                headers: { 'token': token }
            });
            if (response.data.err === 0) {
                Swal.fire({
                    title: 'Thành công',
                    text: 'Đơn phê duyệt đã được gửi thông báo cho người dùng !',
                    icon: 'success',
                    timer: 3000, // Tự động tắt sau 3 giây
                    showConfirmButton: false
                });
                dispatch(fetchUpgradeRequests(token, 1)); // Refresh the list
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: response.data.msg,
                    icon: 'error',
                    timer: 3000, // Tự động tắt sau 3 giây
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error approving request:', error);
            Swal.fire({
                title: 'Lỗi',
                text: 'Đã xảy ra lỗi khi phê duyệt yêu cầu',
                icon: 'error',
                timer: 3000, // Tự động tắt sau 3 giây
                showConfirmButton: false
            });
        }
        finally {
            setIsLoading(false); // Ẩn thẻ Loading sau khi xử lý xong
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

                // Áp dụng CSS trực tiếp cho nút Xác nhận
                confirmButton.style.backgroundColor = 'red';
                confirmButton.style.color = 'white';
                confirmButton.style.padding = '8px 16px';
                confirmButton.style.marginRight = '20px'; // Tạo khoảng cách giữa hai nút
                confirmButton.style.borderRadius = '4px';
                confirmButton.style.border = 'none';
                confirmButton.style.cursor = 'pointer';

                // Áp dụng CSS trực tiếp cho nút Hủy
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
                    width: 500px; /* Kích thước rộng hơn */
                }
                .swal2-validation-message {
                    color: red; /* Màu đỏ cho thông báo lỗi */
                }
            </style>
            `,
            preConfirm: () => {
                const reason = Swal.getInput().value;
                if (!reason) {
                    Swal.showValidationMessage('Vui lòng nhập lý do xóa yêu cầu nâng cấp tài khoản !');
                }
                return reason; // Trả về giá trị lý do nếu người dùng nhập
            }
        });

        if (reasonRejectUpgradeRequest) {
            setIsLoading(true); // Hiển thị thẻ Loading ngay khi bắt đầu xử lý
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
                        timer: 3000, // Tự động tắt sau 3 giây
                        showConfirmButton: false, // Không hiển thị nút "OK"
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
                        dispatch(fetchUpgradeRequests(token, 1)); // Refresh user list after deletion
                    }, 1);
                }
            } catch (error) {
                console.log('error when reject upgrade request: ', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Xóa yêu cầu nâng cấp tài khoản thất bại !',
                    icon: 'error',
                    timer: 3000, // Tự động tắt sau 3 giây
                    showConfirmButton: false, // Không hiển thị nút "OK"
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
                setIsLoading(false); // Ẩn thẻ Loading sau khi xử lý xong
            }
        }



    }

    // if (isLoading || !upgradeRequests.length) {
    //     return <Loading />;
    // }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Thay đổi số cột thành 2 để rộng hơn */}
            {upgradeRequests.map((request) => (
                <div
                    key={request.user_id}
                    className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105"
                >
                    <div className="relative w-full h-[200px] bg-gray-200"> {/* Giảm chiều cao xuống để ảnh ngang */}
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
                                            className="w-full h-full object-cover" // Đảm bảo ảnh nằm vừa container
                                        />
                                    </SwiperSlide>
                                ))
                            ) : (
                                <span>No Images Available</span>
                            )}
                        </Swiper>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-center mt-2">{request.full_name}</h3>
                    <div className="space-y-2">
                        <p><span className="font-medium">Ngày sinh :</span> {formatBirthday(request.date_of_birth)}</p>
                        <p><span className="font-medium ml-2.5">Số CCCD :</span> {request.citizen_id}</p>
                        <p><span className="font-medium ml-6">Địa chỉ :</span> {request.address}</p>
                    </div>
                    <div className="mt-4 flex justify-center space-x-4">
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-1/2"
                            aria-label="Approve request"
                            onClick={() => handleApprove(request.user_id, request.User.email)}
                        >
                            Phê duyệt
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-1/2"
                            aria-label="Reject request"
                            onClick={() => handleReject(request.user_id, request.User.email)}
                        >
                            Từ chối
                        </button>
                    </div>
                </div>
            ))}
            {isOpen && (
                <Lightbox
                    mainSrc={lightboxImages[currentImage]}
                    nextSrc={lightboxImages[(currentImage + 1) % lightboxImages.length]}
                    prevSrc={lightboxImages[(currentImage + lightboxImages.length - 1) % lightboxImages.length]}
                    onCloseRequest={closeLightbox}
                    onMovePrevRequest={() =>
                        setCurrentImage((currentImage + lightboxImages.length - 1) % lightboxImages.length)
                    }
                    onMoveNextRequest={() =>
                        setCurrentImage((currentImage + 1) % lightboxImages.length)
                    }
                    imageCaption={`Image ${currentImage + 1} of ${lightboxImages.length}`}
                />
            )}
        </div>


    );
};

export default ManageRequest;