// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUpgradeRequests } from '../../store/actions/admin';
// import Loading from '../../components/Loading';

// const ManageRequest = () => {
//     const dispatch = useDispatch();
//     const { token } = useSelector(state => state.auth);
//     const { upgradeRequests, pagination } = useSelector(state => state.admin);
//     console.log(upgradeRequests);
//     console.log(pagination);
//     const [page, setPage] = useState(1);

//     useEffect(() => {
//         dispatch(fetchUpgradeRequests(token, page));
//     }, [dispatch, token, page]);

//     const formatBirthday = (dateString) => {
//         const options = { year: 'numeric', month: 'long', day: 'numeric' };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     if (!upgradeRequests.length) {
//         return <Loading />;
//     }

//     return (
//         <div >
//             {/* <h1 className="text-3xl font-semibold mb-6">Quản lý yêu cầu nâng cấp tài khoản</h1> */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {upgradeRequests.map((request) => (
//                     <div
//                         key={request.user_id}
//                         className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105"
//                     >

//                         {/* <img
//                             src={JSON.parse(request.id_card_image_url)}
//                             alt={request.full_name}
//                             className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
//                         /> */}
//                         <div className='relative'>
//                             {JSON.parse(request.id_card_image_url).length > 0 && (
//                                 <img src={JSON.parse(request.id_card_image_url)[0]} alt="preview" className='w-32 h-32 rounded-full mx-auto mb-4  object-cover cursor-pointer' style={{ transition: 'transform 0.2s ease' }} />
//                             )}
//                             <span className='bg-overlay-70 text-white px-2 rounded-md absolute left-1 bottom-4'>{`${JSON.parse(request.id_card_image_url).length} ảnh`}</span>
//                         </div>

//                         <div className="space-y-2">
//                             <p><span className="font-medium ml-1">Họ và tên : </span>{request.full_name}</p>
//                             <p><span className="font-medium">Ngày sinh : </span>{formatBirthday(request.date_of_birth)}</p>
//                             <p><span className="font-medium ml-2.5"> Số CCCD :</span> {request.citizen_id}</p>
//                             <p><span className="font-medium ml-6">Địa chỉ :</span> {request.address}</p>

//                         </div>
//                         <div className="mt-4 flex justify-center space-x-4">
//                             <button
//                                 className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-1/2"
//                                 aria-label="Approve request"
//                             >
//                                 Phê duyệt
//                             </button>
//                             <button
//                                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-1/2"
//                                 aria-label="Reject request"
//                             >
//                                 Từ chối
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//         </div>
//         //     <div className="mt-6 flex justify-center">
//         //     <button
//         //         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//         //         onClick={() => setPage(page - 1)}
//         //         disabled={page === 1}
//         //     >
//         //         Previous
//         //     </button>
//         //     <button
//         //         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ml-4"
//         //         onClick={() => setPage(page + 1)}
//         //         disabled={page === pagination.totalPages}
//         //     >
//         //         Next
//         //     </button>
//         // </div>
//     );
// };

// export default ManageRequest;



import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpgradeRequests } from '../../store/actions/admin';
import Loading from '../../components/Loading';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css'; // Corrected import path
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const ManageRequest = () => {
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);
    const { upgradeRequests } = useSelector(state => state.admin); // Removed pagination
    const [isOpen, setIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [lightboxImages, setLightboxImages] = useState([]);

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

    if (!upgradeRequests.length) {
        return <Loading />;
    }

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
                        >
                            Phê duyệt
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-1/2"
                            aria-label="Reject request"
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