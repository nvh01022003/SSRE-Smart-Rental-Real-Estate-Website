
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchPostsAdmin, deletePost } from "../../store/actions/admin";
// import { FaTrashAlt, FaEdit, FaEye } from "react-icons/fa";
// import Swal from "sweetalert2";
// import Loading from '../../components/Loading';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/swiper-bundle.css';
// import Lightbox from 'react-image-lightbox';
// import 'react-image-lightbox/style.css';

// const ManagePost = () => {
//     const dispatch = useDispatch();
//     const [search, setSearch] = useState("");
//     const [category, setCategory] = useState("all");
//     const [selectedPosts, setSelectedPosts] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isModalOpenView, setIsModalOpenView] = useState(false);
//     const [currentPost, setCurrentPost] = useState(null);
//     const { token } = useSelector((state) => state.auth);
//     const { postsAdmin } = useSelector(state => state.post);
//     console.log(postsAdmin);
//     const [errors, setErrors] = useState({});

//     const [isOpen, setIsOpen] = useState(false);
//     const [currentImage, setCurrentImage] = useState(0);
//     const [lightboxImages, setLightboxImages] = useState([]);

//     useEffect(() => {
//         dispatch(fetchPostsAdmin(token, 1));
//     }, [dispatch, token]);

//     const handleSearch = (e) => {
//         setSearch(e.target.value);
//     };

//     const handleCategoryChange = (e) => {
//         setCategory(e.target.value);
//     };

//     const toggleSelectPost = (id) => {
//         if (selectedPosts.includes(id)) {
//             setSelectedPosts(selectedPosts.filter(postId => postId !== id));
//         } else {
//             setSelectedPosts([...selectedPosts, id]);
//         }
//     };

//     const toggleSelectAllPosts = () => {
//         if (selectedPosts.length === postsAdmin.length) {
//             setSelectedPosts([]);
//         } else {
//             setSelectedPosts(postsAdmin.map(post => post.id));
//         }
//     };

//     const handleDeleteSelected = () => {
//         selectedPosts.forEach(postId => dispatch(deletePost(postId, token)));
//         Swal.fire('Thành công', 'Xóa toàn bộ bài viết thành công!', 'success');
//         setSelectedPosts([]);
//     };

//     const openLightbox = (images, index) => {
//         setLightboxImages(images);
//         setCurrentImage(index);
//         setIsOpen(true);
//     };

//     const closeLightbox = () => {
//         setIsOpen(false);
//     };

//     const openModal = (post) => {
//         setCurrentPost(post);
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setCurrentPost(null);
//         setErrors({});
//     };

//     // const handleUpdatePost = async () => {
//     //     if (currentPost) {
//     //         if (!validate()) return;

//     //         try {
//     //             await dispatch(updatePost(currentPost.id, currentPost, token));
//     //             Swal.fire('Thành công', 'Cập nhật bài viết thành công!', 'success');
//     //             setTimeout(() => closeModal(), 1000);
//     //             await dispatch(fetchPostsAdmin(token, 1));
//     //         } catch (error) {
//     //             console.error(error);
//     //             Swal.fire('Error', 'Lỗi khi cập nhật bài viết!', 'error');
//     //         }
//     //     }
//     // };

//     const openModalView = (post) => {
//         setCurrentPost(post);
//         setIsModalOpenView(true);
//     };

//     const closeModalView = () => {
//         setIsModalOpenView(false);
//         setCurrentPost(null);
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setCurrentPost({ ...currentPost, [name]: value });
//     };

//     const filteredPosts = postsAdmin.filter(post =>
//         (category === "all" || post.category === category) &&
//         (post.title.toLowerCase().includes(search.toLowerCase()))
//     );

//     const validate = () => {
//         const newErrors = {};
//         if (!currentPost.title.trim()) newErrors.title = 'Không để trống';
//         if (!currentPost.price.trim()) newErrors.price = 'Không để trống';
//         if (!currentPost.acreage.trim()) newErrors.acreage = 'Không để trống';
//         if (!currentPost.address.trim()) newErrors.address = 'Không để trống';
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleDeletePost = async (postId) => {
//         const result = await Swal.fire({
//             title: 'Bạn có chắc muốn xóa bài viết này?',
//             showCancelButton: true,
//             confirmButtonText: 'Có',
//             cancelButtonText: 'Không',
//             buttonsStyling: false,
//             customClass: {
//                 confirmButton: 'custom-confirm',
//                 cancelButton: 'custom-cancel',
//             },
//             didOpen: () => {
//                 const confirmButton = Swal.getConfirmButton();
//                 const cancelButton = Swal.getCancelButton();
//                 confirmButton.style.backgroundColor = 'red';
//                 confirmButton.style.color = 'white';
//                 confirmButton.style.padding = '8px 16px';
//                 confirmButton.style.marginRight = '20px';
//                 confirmButton.style.borderRadius = '4px';
//                 confirmButton.style.border = 'none';
//                 confirmButton.style.cursor = 'pointer';
//                 cancelButton.style.backgroundColor = 'gray';
//                 cancelButton.style.color = 'white';
//                 cancelButton.style.padding = '8px 16px';
//                 cancelButton.style.borderRadius = '4px';
//                 cancelButton.style.border = 'none';
//                 cancelButton.style.cursor = 'pointer';
//             },
//             customClass: {
//                 title: 'custom-title',
//             },
//             html: `
//                     <style>
//                         .custom-title {
//                             font-size: 20px;
//                             font-weight: bold;
//                         }
//                         .swal2-popup {
//                             width: 300px;
//                         }
//                     </style>
//                 `,
//         });

//         if (result.isConfirmed) {
//             try {
//                 await dispatch(deletePost(postId, token));
//                 Swal.fire({
//                     title: 'Xóa bài viết thành công!',
//                     text: 'Bài viết đã được xóa',
//                     icon: 'success',
//                     buttonsStyling: false,
//                     didOpen: () => {
//                         const confirmButton = Swal.getConfirmButton();
//                         confirmButton.style.backgroundColor = 'green';
//                         confirmButton.style.color = 'white';
//                         confirmButton.style.padding = '8px 16px';
//                         confirmButton.style.borderRadius = '4px';
//                         confirmButton.style.border = 'none';
//                         confirmButton.style.cursor = 'pointer';
//                     },
//                     html: `
//                             <style>
//                                 .swal2-popup {
//                                     width: 300px;
//                                 }
//                             </style>
//                         `,
//                 });
//                 setTimeout(() => {
//                     dispatch(fetchPostsAdmin(token, 1));
//                 }, 1);
//             } catch (error) {
//                 Swal.fire({
//                     title: 'Error',
//                     text: 'Xóa bài viết thất bại',
//                     icon: 'error',
//                     buttonsStyling: false,
//                     didOpen: () => {
//                         const confirmButton = Swal.getConfirmButton();
//                         confirmButton.style.backgroundColor = 'darkred';
//                         confirmButton.style.color = 'white';
//                         confirmButton.style.padding = '8px 16px';
//                         confirmButton.style.borderRadius = '4px';
//                         confirmButton.style.border = 'none';
//                         confirmButton.style.cursor = 'pointer';
//                     },
//                     html: `
//                             <style>
//                                 .swal2-popup {
//                                     width: 300px;
//                                 }
//                             </style>
//                         `,
//                 });
//             }
//         }
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('vi-VN', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric'
//         });
//     };


//     const formatDateDetail = (dateString) => {
//         const date = new Date(dateString);
//         const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

//         const dayName = daysOfWeek[date.getDay()];
//         const formattedDate = date.toLocaleDateString('vi-VN', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric'
//         });
//         const formattedTime = date.toLocaleTimeString('vi-VN', {
//             hour: '2-digit',
//             minute: '2-digit'
//         });

//         return `${dayName}, ${formattedTime} ngày ${formattedDate}`;
//     };

//     const formatNumberWithDots = (number) => {
//         // Convert the input to a string and remove any non-digit characters (except for the decimal point)
//         const numStr = number.toString().replace(/[^0-9.]/g, '');

//         // Split the number into integer and decimal parts
//         const [integerPart, decimalPart] = numStr.split('.');

//         // Add dots as thousand separators to the integer part
//         const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

//         // Combine the formatted integer part with the decimal part (if any)
//         let formattedNumber = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

//         // Remove trailing .00 if present
//         if (formattedNumber.endsWith('.00')) {
//             formattedNumber = formattedNumber.slice(0, -3);
//         }

//         return formattedNumber;
//     };

//     if (!postsAdmin.length) {
//         return <Loading />;
//     }

//     return (
//         <div className="p-6 bg-white rounded-lg shadow-lg">
//             <h2 className="text-2xl font-bold mb-4">Quản lý bài viết</h2>

//             {/* Search and Category Filter */}
//             <div className="flex mb-4">
//                 <input
//                     type="text"
//                     placeholder="Tìm kiếm bài viết theo tiêu đề..."
//                     value={search}
//                     onChange={handleSearch}
//                     className="border p-2 rounded-md flex-grow mr-4"
//                 />
//                 <select value={category} onChange={handleCategoryChange} className="border p-2 rounded-md">
//                     <option value="all">Tất cả danh mục</option>
//                     <option value="category1">Danh mục 1</option>
//                     <option value="category2">Danh mục 2</option>
//                 </select>
//             </div>

//             {/* Bulk Delete */}
//             <div className="flex justify-between items-center mb-4">
//                 <button
//                     className={`bg-red-500 text-white px-4 py-2 rounded-md ${selectedPosts.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
//                     onClick={handleDeleteSelected}
//                     disabled={selectedPosts.length === 0}
//                 >
//                     Xóa bài viết đã chọn
//                 </button>
//                 <div className="flex items-center">
//                     <input
//                         type="checkbox"
//                         checked={selectedPosts.length === postsAdmin.length}
//                         onChange={toggleSelectAllPosts}
//                     />
//                     <span className="ml-2">Chọn tất cả</span>
//                 </div>
//             </div>

//             {/* Post Table */}
//             <table className="table-auto w-full text-left">
//                 <thead>
//                     <tr className="bg-gray-100">
//                         <th className="p-2">
//                             <input
//                                 type="checkbox"
//                                 checked={selectedPosts.length === postsAdmin.length}
//                                 onChange={toggleSelectAllPosts}
//                             />
//                         </th>
//                         <th className="p-2">ID</th>
//                         <th className="p-2">Tiêu đề</th>
//                         <th className="p-2">
//                             <span>Giá cho thuê</span>
//                             <span className="block text-xs">( đồng / tháng )</span>
//                         </th>
//                         <th className="p-2">
//                             <span>Diện tích</span>
//                             <span className="block text-xs">(mét vuông)</span>
//                         </th>
//                         <th className="p-2">Địa chỉ</th>
//                         <th className="p-2">Danh mục</th>
//                         <th className="p-2">Ngày đăng</th>
//                         <th className="p-2">Chức năng</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filteredPosts.map((post) => (
//                         <tr key={post.id} className="border-b">
//                             <td className="p-2">
//                                 <input
//                                     type="checkbox"
//                                     checked={selectedPosts.includes(post.id)}
//                                     onChange={() => toggleSelectPost(post.id)}
//                                 />
//                             </td>
//                             <td className="p-2">{post.id}</td>
//                             <td className="p-2">{post.title}</td>
//                             <td className="p-2">{formatNumberWithDots(post.price)}</td>
//                             <td className="p-2">{formatNumberWithDots(post.acreage)}</td>
//                             <td className="p-2">{post.Address.city.replace("Thành phố ", "")}</td>
//                             <td className="p-2">{post.Category.category_name}</td>
//                             <td className="p-2">{formatDate(post.createdAt)}</td>
//                             <td className="p-2">
//                                 <button
//                                     className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
//                                     onClick={() => openModalView(post)}
//                                 >
//                                     <FaEye />
//                                 </button>
//                                 {/* <button
//                                     className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2"
//                                     onClick={() => openModal(post)}
//                                 >
//                                     <FaEdit />
//                                 </button> */}
//                                 <button
//                                     className="bg-red-500 text-white px-2 py-1 rounded-md"
//                                     onClick={() => handleDeletePost(post.id)}
//                                 >
//                                     <FaTrashAlt />
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {/* View Post Modal */}
//             {isModalOpenView && currentPost && (
//                 <div
//                     className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center "

//                 >
//                     <div
//                         className="bg-white p-3.5 rounded-lg w-1/3 max-h-screen overflow-y-auto relative"
//                         style={{
//                             maxHeight: 'calc(100vh - 20px)',
//                             overflowY: 'auto'
//                         }}
//                     >
//                         <h3
//                             className="text-xl font-bold mb-4 py-4"
//                             style={{
//                                 position: 'sticky',
//                                 top: '0',
//                                 backgroundColor: 'white',
//                                 zIndex: 10
//                             }}
//                         >
//                             Thông tin chi tiết bài viết
//                         </h3>
//                         <div
//                             className="grid mb-4 overflow-y-auto"
//                             style={{
//                                 display: 'grid',
//                                 gridTemplateColumns: 'repeat(2, 1fr)',
//                                 gap: '1rem',
//                                 overflowY: 'auto'
//                             }}
//                         >
//                             <div>
//                                 <label>ID:</label>
//                                 <input
//                                     type="text"
//                                     value={currentPost.id}
//                                     disabled
//                                     className="border p-2 rounded-md w-full"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Danh mục:</label>
//                                 <input
//                                     type="text"
//                                     value={currentPost.Category.category_name}
//                                     disabled
//                                     className="border p-2 rounded-md w-full"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Giá cho thuê (đồng/tháng):</label>
//                                 <input
//                                     type="text"
//                                     value={formatNumberWithDots(currentPost.price)}
//                                     disabled
//                                     className="border p-2 rounded-md w-full"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Diện tích (mét vuông):</label>
//                                 <input
//                                     type="text"
//                                     value={formatNumberWithDots(currentPost.acreage)}
//                                     disabled
//                                     className="border p-2 rounded-md w-full"
//                                 />
//                             </div>

//                             <div>
//                                 <label>Ngày đăng tin:</label>
//                                 <input
//                                     type="text"
//                                     value={formatDateDetail(currentPost.createdAt)}
//                                     disabled
//                                     className="border p-2 rounded-md w-full"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Ngày cập nhật tin đăng:</label>
//                                 <input
//                                     type="text"
//                                     value={formatDateDetail(currentPost.updatedAt)}
//                                     disabled
//                                     className="border p-2 rounded-md w-full"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Ngày hết hạn tin đăng:</label>
//                                 <input
//                                     type="text"
//                                     value={formatDateDetail(currentPost.Overview.expire)}
//                                     disabled
//                                     className="border p-2 rounded-md w-full "
//                                 />
//                             </div>
//                             <div>
//                                 <label>Đối tượng cho thuê:</label>
//                                 <input
//                                     type="text"
//                                     value={
//                                         parseInt(currentPost.Overview.target) === 0
//                                             ? 'Tất cả'
//                                             : parseInt(currentPost.Overview.target) === 1
//                                                 ? 'Nam'
//                                                 : 'Nữ'
//                                     }
//                                     disabled
//                                     className="border p-2 rounded-md w-full"
//                                 />
//                             </div>
//                             <div className="col-span-2">
//                                 <label>Địa chỉ chi tiết:</label>
//                                 <input
//                                     type="text"
//                                     value={`${currentPost.Address.detail_address}, ${currentPost.Address.district}, ${currentPost.Address.city}`}
//                                     disabled
//                                     className="border p-2 rounded-md w-full"
//                                 />
//                             </div>
//                             <div className="col-span-2">
//                                 <label>Tiêu đề:</label>
//                                 <input
//                                     type="text"
//                                     value={currentPost.title}
//                                     disabled
//                                     className="border p-2 rounded-md w-full "
//                                 />
//                             </div>
//                             <div className="col-span-2">
//                                 <label>Mô tả:</label>
//                                 <textarea
//                                     value={currentPost.description}
//                                     disabled
//                                     className="border p-2 rounded-md w-full h-32"
//                                     style={{ resize: 'none' }}
//                                     rows={3}
//                                 />
//                             </div>
//                         </div>

//                         {/* Image Section */}
//                         <div
//                             className="w-full mb-4 p-4 rounded-lg shadow-lg border border-gray-300 bg-white"
//                             style={{
//                                 backgroundColor: '#f9f9f9', // Màu nền nhẹ để phân biệt
//                                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' // Bóng đổ nhẹ để nổi bật
//                             }}
//                         >
//                             <label className="font-semibold text-lg mb-2 block text-gray-700">Hình ảnh bài viết:</label>
//                             <Swiper
//                                 modules={[Navigation, Pagination]}
//                                 navigation
//                                 pagination={{ clickable: true }}
//                                 spaceBetween={10}
//                                 slidesPerView={1}
//                                 loop={true}
//                                 style={{ height: '100%' }}
//                             >
//                                 {Array.isArray(JSON.parse(currentPost.Images[0].img_url_list)) &&
//                                     JSON.parse(currentPost.Images[0].img_url_list).map((img, index) => (
//                                         <SwiperSlide key={index} onClick={() => openLightbox(JSON.parse(currentPost.Images[0].img_url_list), index)}>
//                                             <img src={img} alt={`preview-${index}`} className="w-full h-full object-cover rounded-md" />
//                                         </SwiperSlide>
//                                     ))}
//                             </Swiper>
//                             {isOpen && (
//                                 <Lightbox
//                                     mainSrc={lightboxImages[currentImage]}
//                                     nextSrc={lightboxImages[(currentImage + 1) % lightboxImages.length]}
//                                     prevSrc={lightboxImages[(currentImage + lightboxImages.length - 1) % lightboxImages.length]}
//                                     onCloseRequest={closeLightbox}
//                                     onMovePrevRequest={() =>
//                                         setCurrentImage((currentImage + lightboxImages.length - 1) % lightboxImages.length)
//                                     }
//                                     onMoveNextRequest={() => setCurrentImage((currentImage + 1) % lightboxImages.length)}
//                                     imageCaption={`Image ${currentImage + 1} of ${lightboxImages.length}`}
//                                 />
//                             )}
//                         </div>


//                         {/* User Information Block */}
//                         <div className="flex mt-4">
//                             <div className="w-[55%]">
//                                 <h3 className="text-lg font-medium mb-2">Thông tin người đăng tin</h3>
//                                 <div className="mb-2">
//                                     <label>Họ và tên:</label>
//                                     <input
//                                         type="text"
//                                         value={`${currentPost.User.firstName} ${currentPost.User.lastName}`}
//                                         disabled
//                                         className="border p-2 rounded-md w-full"
//                                     />
//                                 </div>
//                                 <div className="mb-2">
//                                     <label>Email:</label>
//                                     <input
//                                         type="text"
//                                         value={currentPost.User.email}
//                                         disabled
//                                         className="border p-2 rounded-md w-full"
//                                     />
//                                 </div>
//                                 <div className="mb-2">
//                                     <label>Số điện thoại:</label>
//                                     <input
//                                         type="text"
//                                         value={currentPost.User.phone}
//                                         disabled
//                                         className="border p-2 rounded-md w-full"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="w-[45%] flex justify-center items-center">
//                                 <img src={currentPost.User.img_avt} alt={currentPost.User.fistName} className="w-25 h-25 rounded-full object-cover" />
//                             </div>
//                         </div>

//                         <div className="mt-10 justify-end flex">
//                             <button
//                                 className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md mr-2"
//                                 onClick={closeModalView}
//                             >
//                                 Đóng
//                             </button>
//                         </div>
//                     </div>
//                 </div>


//             )}


//             {/* Update Post Modal */}
//             {isModalOpen && currentPost && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-white p-6 rounded-lg w-1/3">
//                         <h3 className="text-xl font-bold mb-4">Cập nhật bài viết</h3>
//                         <div className="mb-4">
//                             <label>ID:</label>
//                             <input
//                                 type="text"
//                                 value={currentPost.id}
//                                 disabled
//                                 className="border p-2 rounded-md w-full"
//                             />
//                         </div>
//                         <div className="mb-4">
//                             <label>Tiêu đề:</label>
//                             <input
//                                 type="text"
//                                 name="title"
//                                 value={currentPost.title}
//                                 onChange={handleInputChange}
//                                 className="border p-2 rounded-md w-full"
//                             />
//                             {errors.title && <small className="text-red-500 italic">{errors.title}</small>}
//                         </div>
//                         <div className="mb-4">
//                             <label>Giá:</label>
//                             <input
//                                 type="text"
//                                 name="price"
//                                 value={currentPost.price}
//                                 onChange={handleInputChange}
//                                 className="border p-2 rounded-md w-full"
//                             />
//                             {errors.price && <small className="text-red-500 italic">{errors.price}</small>}
//                         </div>
//                         <div className="mb-4">
//                             <label>Diện tích:</label>
//                             <input
//                                 type="text"
//                                 name="acreage"
//                                 value={currentPost.acreage}
//                                 onChange={handleInputChange}
//                                 className="border p-2 rounded-md w-full"
//                             />
//                             {errors.acreage && <small className="text-red-500 italic">{errors.acreage}</small>}
//                         </div>
//                         <div className="mb-4">
//                             <label>Địa chỉ:</label>
//                             <input
//                                 type="text"
//                                 name="address"
//                                 value={currentPost.address}
//                                 onChange={handleInputChange}
//                                 className="border p-2 rounded-md w-full"
//                             />
//                             {errors.address && <small className="text-red-500 italic">{errors.address}</small>}
//                         </div>
//                         <div className="mb-4">
//                             <label>Danh mục:</label>
//                             <input
//                                 type="text"
//                                 name="category"
//                                 value={currentPost.category}
//                                 onChange={handleInputChange}
//                                 className="border p-2 rounded-md w-full"
//                             />
//                             {errors.category && <small className="text-red-500 italic">{errors.category}</small>}
//                         </div>
//                         <div className="flex justify-end">
//                             <button
//                                 className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
//                                 onClick={closeModal}
//                             >
//                                 Hủy
//                             </button>
//                             {/* <button
//                                 className="bg-green-500 text-white px-4 py-2 rounded-md"
//                                 onClick={handleUpdatePost}
//                             >
//                                 Cập nhật
//                             </button> */}
//                         </div>
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// };

// export default ManagePost;



import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsAdmin, deletePost } from "../../store/actions/admin";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import Loading from '../../components/Loading';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const ManagePost = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const categories = useSelector(state => state.app.categories);
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [isModalOpenView, setIsModalOpenView] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const { token } = useSelector((state) => state.auth);
    const { postsAdmin } = useSelector(state => state.post);

    const [isOpen, setIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [lightboxImages, setLightboxImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // State để quản lý trạng thái loading

    const modalRef = useRef(null);

    useEffect(() => {
        dispatch(fetchPostsAdmin(token, 1));
    }, [dispatch, token]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModalView();
            }
        };

        if (isModalOpenView) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpenView]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const toggleSelectPost = (id) => {
        if (selectedPosts.includes(id)) {
            setSelectedPosts(selectedPosts.filter(postId => postId !== id));
        } else {
            setSelectedPosts([...selectedPosts, id]);
        }
    };

    const toggleSelectAllPosts = () => {
        if (selectedPosts.length === postsAdmin.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(postsAdmin.map(post => post.id));
        }
    };
    const handleDeletePost = async (postId, email) => {
        const { value: reasonDeletePost } = await Swal.fire({
            title: 'Lí do xóa bài viết',
            input: 'textarea',
            inputPlaceholder: 'Nhập lí do xóa bài viết...',
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
                    Swal.showValidationMessage('Vui lòng nhập lý do xóa bài viết !');
                }
                return reason; // Trả về giá trị lý do nếu người dùng nhập
            }
        });

        if (reasonDeletePost) {
            setIsLoading(true); // Hiển thị thẻ Loading ngay khi bắt đầu xử lý
            try {
                await dispatch(deletePost(postId, token, email, reasonDeletePost));
                Swal.fire({
                    title: 'Xóa bài viết thành công !',
                    text: 'Bài viết đã được xóa',
                    icon: 'success',
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
                    dispatch(fetchPostsAdmin(token, 1)); // Refresh 
                }, 1);
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Xóa bài viết thất bại',
                    icon: 'error',
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

    };

    const handleDeleteSelected = () => {
        //selectedPosts.forEach(postId => dispatch(deletePost(postId, token)));
        Swal.fire('Thành công', 'Xóa toàn bộ bài viết thành công!', 'success');
        setSelectedPosts([]);
    };

    const openLightbox = (images, index) => {
        setLightboxImages(images);
        setCurrentImage(index);
        setIsOpen(true);
    };

    const closeLightbox = () => {
        setIsOpen(false);
    };

    const openModalView = (post) => {
        setCurrentPost(post);
        setIsModalOpenView(true);
    };

    const closeModalView = () => {
        setIsModalOpenView(false);
        setCurrentPost(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentPost({ ...currentPost, [name]: value });
    };

    const filteredPosts = postsAdmin.filter(post =>
        (selectedCategory === "all" || post.Category.category_name === selectedCategory) &&
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

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

        // Calculate the data to display on the current page
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatDateDetail = (dateString) => {
        const date = new Date(dateString);
        const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

        const dayName = daysOfWeek[date.getDay()];
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

    const formatNumberWithDots = (number) => {
        // Convert the input to a string and remove any non-digit characters (except for the decimal point)
        const numStr = number.toString().replace(/[^0-9.]/g, '');

        // Split the number into integer and decimal parts
        const [integerPart, decimalPart] = numStr.split('.');

        // Add dots as thousand separators to the integer part
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combine the formatted integer part with the decimal part (if any)
        let formattedNumber = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

        // Remove trailing .00 if present
        if (formattedNumber.endsWith('.00')) {
            formattedNumber = formattedNumber.slice(0, -3);
        }

        return formattedNumber;
    };

    if (isLoading || !postsAdmin.length) {
        return <Loading />;
    }

   

    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center py-4 border-b border-gray-200 mb-4">
                    Quản lý tin đăng
                </h1>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm bài viết theo tiêu đề..."
                    value={search}
                    onChange={handleSearch}
                    className="border p-2 rounded-md flex-grow mb-2 md:mb-0 md:mr-4"
                />
                <select value={selectedCategory} onChange={handleCategoryChange} className="border p-2 rounded-md">
                    <option value="all">Tất cả danh mục</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.category_name}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Bulk Delete */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <button
                    className={`bg-red-500 text-white px-4 py-2 rounded-md ${selectedPosts.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleDeleteSelected}
                    disabled={selectedPosts.length === 0}
                >
                    Xóa bài viết đã chọn
                </button>
                <div className="flex items-center mt-2 md:mt-0">
                    <input
                        type="checkbox"
                        checked={selectedPosts.length === postsAdmin.length}
                        onChange={toggleSelectAllPosts}
                    />
                    <span className="ml-2">Chọn tất cả</span>
                </div>
            </div>

            {/* Post Table */}
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">
                                <input
                                    type="checkbox"
                                    checked={selectedPosts.length === postsAdmin.length}
                                    onChange={toggleSelectAllPosts}
                                />
                            </th>
                            <th className="p-2">ID</th>
                            <th className="p-2">Tiêu đề</th>
                            <th className="p-2">Giá cho thuê</th>
                            <th className="p-2">Diện tích</th>
                            <th className="p-2">Địa chỉ</th>
                            <th className="p-2">Danh mục</th>
                            <th className="p-2">Ngày đăng</th>
                            <th className="p-2">Chức năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map((post) => (
                            <tr key={post.id} className="border-b">
                                <td className="p-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedPosts.includes(post.id)}
                                        onChange={() => toggleSelectPost(post.id)}
                                    />
                                </td>
                                <td className="p-2">{post.id}</td>
                                <td className="p-2">{post.title}</td>
                                <td className="p-2">{formatNumberWithDots(post.price)}</td>
                                <td className="p-2">{formatNumberWithDots(post.acreage)}</td>
                                <td className="p-2"></td>
                                {/* {post.Address.city.replace("Thành phố ", "")} */}
                                <td className="p-2">{post.Category.category_name}</td>
                                <td className="p-2">{formatDate(post.createdAt)}</td>
                                <td className="p-2">
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                                        onClick={() => openModalView(post)}
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded-md"
                                        onClick={() => handleDeletePost(post.id, post.User.email)}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Post Modal */}
            {isModalOpenView && currentPost && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
                >
                    <div
                        ref={modalRef}
                        className="bg-white p-3.5 rounded-lg w-11/12 md:w-1/3 max-h-screen overflow-y-auto relative"
                        style={{
                            maxHeight: 'calc(100vh - 20px)',
                            overflowY: 'auto'
                        }}
                    >
                        <h3
                            className="text-xl font-bold mb-4 py-4"
                            style={{
                                position: 'sticky',
                                top: '0',
                                backgroundColor: 'white',
                                zIndex: 10
                            }}
                        >
                            Thông tin chi tiết bài viết
                        </h3>
                        <div
                            className="grid mb-4 overflow-y-auto"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '1rem',
                                overflowY: 'auto'
                            }}
                        >
                            <div>
                                <label>ID:</label>
                                <input
                                    type="text"
                                    value={currentPost.id}
                                    disabled
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div>
                                <label>Danh mục:</label>
                                <input
                                    type="text"
                                    value={currentPost.Category.category_name}
                                    disabled
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div>
                                <label>Giá cho thuê (đồng/tháng):</label>
                                <input
                                    type="text"
                                    value={formatNumberWithDots(currentPost.price)}
                                    disabled
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div>
                                <label>Diện tích (mét vuông):</label>
                                <input
                                    type="text"
                                    value={formatNumberWithDots(currentPost.acreage)}
                                    disabled
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label>Ngày đăng tin:</label>
                                <input
                                    type="text"
                                    value={formatDateDetail(currentPost.createdAt)}
                                    disabled
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div>
                                <label>Ngày cập nhật tin đăng:</label>
                                <input
                                    type="text"
                                    value={formatDateDetail(currentPost.updatedAt)}
                                    disabled
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div>
                                <label>Ngày hết hạn tin đăng:</label>
                                <input
                                    type="text"
                                    value={formatDateDetail(currentPost.Overview.expire)}
                                    disabled
                                    className="border p-2 rounded-md w-full "
                                />
                            </div>
                            <div>
                                <label>Đối tượng cho thuê:</label>
                                <input
                                    type="text"
                                    value={
                                        parseInt(currentPost.Overview.target) === 0
                                            ? 'Tất cả'
                                            : parseInt(currentPost.Overview.target) === 1
                                                ? 'Nam'
                                                : 'Nữ'
                                    }
                                    disabled
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div className="col-span-2">
                                <label>Địa chỉ chi tiết:</label>
                                <input
                                    type="text"
                                    value={`${currentPost.Address.detail_address}, ${currentPost.Address.district}, ${currentPost.Address.city}`}
                                    disabled
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div className="col-span-2">
                                <label>Tiêu đề:</label>
                                <input
                                    type="text"
                                    value={currentPost.title}
                                    disabled
                                    className="border p-2 rounded-md w-full "
                                />
                            </div>
                            <div className="col-span-2">
                                <label>Mô tả:</label>
                                <textarea
                                    value={currentPost.description}
                                    disabled
                                    className="border p-2 rounded-md w-full h-32"
                                    style={{ resize: 'none' }}
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Image Section */}
                        <div
                            className="w-full mb-4 p-4 rounded-lg shadow-lg border border-gray-300 bg-white"
                            style={{
                                backgroundColor: '#f9f9f9', // Màu nền nhẹ để phân biệt
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' // Bóng đổ nhẹ để nổi bật
                            }}
                        >
                            <label className="font-semibold text-lg mb-2 block text-gray-700">Hình ảnh bài viết:</label>
                            <Swiper
                                modules={[Navigation, Pagination]}
                                navigation
                                pagination={{ clickable: true }}
                                spaceBetween={10}
                                slidesPerView={1}
                                loop={true}
                                style={{ height: '100%' }}
                            >
                                {Array.isArray(JSON.parse(currentPost.Images[0].img_url_list)) &&
                                    JSON.parse(currentPost.Images[0].img_url_list).map((img, index) => (
                                        <SwiperSlide key={index} onClick={() => openLightbox(JSON.parse(currentPost.Images[0].img_url_list), index)}>
                                            <img src={img} alt={`preview-${index}`} className="w-full h-full object-cover rounded-md" />
                                        </SwiperSlide>
                                    ))}
                            </Swiper>
                            {isOpen && (
                                <Lightbox
                                    mainSrc={lightboxImages[currentImage]}
                                    nextSrc={lightboxImages[(currentImage + 1) % lightboxImages.length]}
                                    prevSrc={lightboxImages[(currentImage + lightboxImages.length - 1) % lightboxImages.length]}
                                    onCloseRequest={closeLightbox}
                                    onMovePrevRequest={() =>
                                        setCurrentImage((currentImage + lightboxImages.length - 1) % lightboxImages.length)
                                    }
                                    onMoveNextRequest={() => setCurrentImage((currentImage + 1) % lightboxImages.length)}
                                    imageCaption={`Image ${currentImage + 1} of ${lightboxImages.length}`}
                                />
                            )}
                        </div>

                        {/* User Information Block */}
                        <div className="flex mt-4">
                            <div className="w-[55%]">
                                <h3 className="text-lg font-medium mb-2">Thông tin người đăng tin</h3>
                                <div className="mb-2">
                                    <label>Họ và tên:</label>
                                    <input
                                        type="text"
                                        value={`${currentPost.User.firstName} ${currentPost.User.lastName}`}
                                        disabled
                                        className="border p-2 rounded-md w-full"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label>Email:</label>
                                    <input
                                        type="text"
                                        value={currentPost.User.email}
                                        disabled
                                        className="border p-2 rounded-md w-full"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label>Số điện thoại:</label>
                                    <input
                                        type="text"
                                        value={currentPost.User.phone}
                                        disabled
                                        className="border p-2 rounded-md w-full"
                                    />
                                </div>
                            </div>
                            <div className="w-[45%] flex justify-center items-center">
                                <img src={currentPost.User.img_avt} alt={currentPost.User.fistName} className="w-25 h-25 rounded-full object-cover" />
                            </div>
                        </div>

                        <div className="mt-10 justify-end flex">
                            <button
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md mr-2"
                                onClick={closeModalView}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManagePost;
