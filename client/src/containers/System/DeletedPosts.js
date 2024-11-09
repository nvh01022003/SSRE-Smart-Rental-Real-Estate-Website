import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { fetchDeletedPosts } from '../../store/actions/post';

const DeletedPosts = ({ history }) => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { deletedPosts } = useSelector((state) => state.post);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // useEffect(() => {
    //     dispatch(fetchDeletedPosts(token));
    // }, [dispatch, token]);

    const handleRestore = (postId) => {
        // Thực hiện chức năng khôi phục
    };

    const handlePermanentDelete = (postId) => {
        // Thực hiện chức năng xóa vĩnh viễn
    };

    // Lọc bài viết dựa trên tìm kiếm và bộ lọc danh mục
    const filteredPosts = deletedPosts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? post.categoryId === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => (prevPage === 1 ? prevPage : prevPage - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => (prevPage === totalPages ? prevPage : prevPage + 1));
    };

    return (
        // <div className="manage-post-container">
        //     {/* Header với Tiêu đề và Nút Quay Lại */}
        //     <div className="manage-post-header">
        //         <h2 className="manage-post-title">Tin đã xóa</h2>
        //         <button
        //             onClick={() => history.goBack()}
        //             className="manage-post-back-button"
        //         >
        //             Quay lại
        //         </button>
        //     </div>

        //     {/* Tìm kiếm và Bộ lọc Danh mục */}
        //     <div className="manage-post-filters">
        //         <input
        //             type="text"
        //             placeholder="Tìm kiếm theo tiêu đề..."
        //             value={searchTerm}
        //             onChange={(e) => setSearchTerm(e.target.value)}
        //             className="manage-post-search-input"
        //         />
        //         <select
        //             value={categoryFilter}
        //             onChange={(e) => setCategoryFilter(e.target.value)}
        //             className="manage-post-category-select"
        //         >
        //             <option value="">Chọn danh mục</option>
        //             {/* Map qua các danh mục của bạn */}
        //             {/* categories.map((category) => (
        //     <option key={category.id} value={category.id}>
        //       {category.name}
        //     </option>
        //   )) */}
        //         </select>
        //     </div>

        //     {/* Bảng Bài Viết */}
        //     <table className="manage-post-table">
        //         <thead>
        //             <tr>
        //                 <th>Tiêu đề</th>
        //                 <th>Danh mục</th>
        //                 <th>Giá</th>
        //                 <th>Thao tác</th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {currentPosts.map((post) => (
        //                 <tr key={post.id}>
        //                     <td>{post.title}</td>
        //                     <td>{post.categoryName}</td>
        //                     <td>{post.price}</td>
        //                     <td className="manage-post-actions">
        //                         <button
        //                             onClick={() => {
        //                                 setSelectedPost(post);
        //                                 setIsModalOpen(true);
        //                             }}
        //                             className="manage-post-button view-button"
        //                         >
        //                             Xem Chi Tiết
        //                         </button>
        //                         <button
        //                             onClick={() => handleRestore(post.id)}
        //                             className="manage-post-button restore-button"
        //                         >
        //                             Khôi Phục
        //                         </button>
        //                         <button
        //                             onClick={() => handlePermanentDelete(post.id)}
        //                             className="manage-post-button delete-button"
        //                         >
        //                             Xóa Vĩnh Viễn
        //                         </button>
        //                     </td>
        //                 </tr>
        //             ))}
        //         </tbody>
        //     </table>

        //     {/* Phân trang */}
        //     <div className="manage-post-pagination">
        //         <div className="pagination-items-per-page">
        //             <label className="pagination-label">Hiển thị</label>
        //             <select
        //                 value={itemsPerPage}
        //                 onChange={(e) => {
        //                     setItemsPerPage(Number(e.target.value));
        //                     setCurrentPage(1);
        //                 }}
        //                 className="pagination-select"
        //             >
        //                 <option value={4}>4</option>
        //                 <option value={8}>8</option>
        //                 <option value={16}>16</option>
        //             </select>
        //             <span className="pagination-text">giao dịch mỗi trang</span>
        //         </div>
        //         <div className="pagination-controls">
        //             <button
        //                 onClick={handlePreviousPage}
        //                 className="pagination-button"
        //                 disabled={currentPage === 1}
        //             >
        //                 Trước
        //             </button>
        //             <span className="pagination-page-info">
        //                 {currentPage} trên {totalPages} trang
        //             </span>
        //             <button
        //                 onClick={handleNextPage}
        //                 className="pagination-button"
        //                 disabled={currentPage === totalPages}
        //             >
        //                 Sau
        //             </button>
        //         </div>
        //     </div>

        //     {/* Modal Chi Tiết Bài Viết */}
        //     {isModalOpen && selectedPost && (
        //         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        //             <div className="bg-white p-4 md:p-8 rounded-lg shadow-xl w-full max-w-6xl">
        //                 <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
        //                     Chi tiết bài đăng
        //                 </h3>
        //                 <form className="space-y-4">
        //                     <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        //                         {/* Mã tin */}
        //                         <div className="col-span-1 md:col-span-1">
        //                             <label className="block text-sm font-medium text-gray-700 mb-1">Mã tin</label>
        //                             <input
        //                                 type="text"
        //                                 value={selectedPost.id}
        //                                 className="w-full border border-gray-300 rounded px-3 py-2"
        //                                 disabled
        //                             />
        //                         </div>
        //                         {/* Giá */}
        //                         <div className="col-span-1 md:col-span-1">
        //                             <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ / tháng)</label>
        //                             <input
        //                                 type="text"
        //                                 value={selectedPost.price}
        //                                 className="w-full border border-gray-300 rounded px-3 py-2"
        //                                 disabled
        //                             />
        //                         </div>
        //                         {/* Diện tích */}
        //                         <div className="col-span-1 md:col-span-1">
        //                             <label className="block text-sm font-medium text-gray-700 mb-1">Diện tích (m²)</label>
        //                             <input
        //                                 type="text"
        //                                 value={selectedPost.acreage}
        //                                 className="w-full border border-gray-300 rounded px-3 py-2"
        //                                 disabled
        //                             />
        //                         </div>
        //                         {/* Ngày đăng */}
        //                         <div className="col-span-1 md:col-span-1">
        //                             <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đăng</label>
        //                             <input
        //                                 type="text"
        //                                 value={new Date(selectedPost.createdAt).toLocaleDateString('vi-VN')}
        //                                 className="w-full border border-gray-300 rounded px-3 py-2"
        //                                 disabled
        //                             />
        //                         </div>
        //                         {/* Ngày cập nhật */}
        //                         <div className="col-span-1 md:col-span-1">
        //                             <label className="block text-sm font-medium text-gray-700 mb-1">Ngày cập nhật</label>
        //                             <input
        //                                 type="text"
        //                                 value={new Date(selectedPost.updatedAt).toLocaleDateString('vi-VN')}
        //                                 className="w-full border border-gray-300 rounded px-3 py-2"
        //                                 disabled
        //                             />
        //                         </div>
        //                         {/* Ngày hết hạn */}
        //                         <div className="col-span-1 md:col-span-1">
        //                             <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
        //                             <input
        //                                 type="text"
        //                                 value={new Date(selectedPost?.Overview?.expire).toLocaleDateString('vi-VN')}
        //                                 className="w-full border border-gray-300 rounded px-3 py-2"
        //                                 disabled
        //                             />
        //                         </div>
        //                     </div>
        //                     {/* Tiêu đề */}
        //                     <div>
        //                         <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
        //                         <input
        //                             type="text"
        //                             value={selectedPost.title}
        //                             className="w-full border border-gray-300 rounded px-3 py-2"
        //                             disabled
        //                         />
        //                     </div>
        //                     {/* Mô tả */}
        //                     <div>
        //                         <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
        //                         <textarea
        //                             value={selectedPost.description}
        //                             className="w-full border border-gray-300 rounded px-3 py-2"
        //                             rows="3"
        //                             disabled
        //                         />
        //                     </div>
        //                     <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        //                         {/* Danh mục */}
        //                         <div className="col-span-1 md:col-span-1">
        //                             <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
        //                             <input
        //                                 type="text"
        //                                 value={selectedPost?.Category?.category_name || ''}
        //                                 className="w-full border border-gray-300 rounded px-3 py-2"
        //                                 disabled
        //                             />
        //                         </div>
        //                         {/* Đối tượng cho thuê */}
        //                         <div className="col-span-1 md:col-span-1">
        //                             <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng cho thuê</label>
        //                             <input
        //                                 type="text"
        //                                 value={
        //                                     selectedPost?.Overview?.target === "0"
        //                                         ? "Tất cả"
        //                                         : selectedPost?.Overview?.target === "1"
        //                                             ? "Nam"
        //                                             : "Nữ"
        //                                 }
        //                                 className="w-full border border-gray-300 rounded px-3 py-2"
        //                                 disabled
        //                             />
        //                         </div>
        //                         {/* Tỉnh/Thành phố */}
        //                         <div className="col-span-1 md:col-span-1">
        //                             <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
        //                             <input
        //                                 type="text"
        //                                 value={selectedPost?.Address?.city || ''}
        //                                 className="w-full border border-gray-300 rounded px-3 py-2"
        //                                 disabled
        //                             />
        //                         </div>
        //                         {/* Quận/Huyện */}
        //                         <div className="col-span-1 md:col-span-1">
        //                             <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
        //                             <input
        //                                 type="text"
        //                                 value={selectedPost?.Address?.district || ''}
        //                                 className="w-full border border-gray-300 rounded px-3 py-2"
        //                                 disabled
        //                             />
        //                         </div>
        //                         {/* Số nhà, đường */}
        //                         <div className="col-span-1 md:col-span-1">
        //                             <label className="block text-sm font-medium text-gray-700 mb-1">Số nhà, đường</label>
        //                             <input
        //                                 type="text"
        //                                 value={selectedPost?.Address?.detail_address || ''}
        //                                 className="w-full border border-gray-300 rounded px-3 py-2"
        //                                 disabled
        //                             />
        //                         </div>
        //                     </div>
        //                     {/* Hình ảnh */}
        //                     <div>
        //                         <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
        //                         <div className="grid grid-cols-4 gap-4">
        //                             {selectedPost?.Image?.img_url_list &&
        //                                 selectedPost.Image.img_url_list.split(',').map((url, index) => (
        //                                     <img
        //                                         key={index}
        //                                         src={url.trim()}
        //                                         alt={`Post Image ${index + 1}`}
        //                                         className="w-[140px] h-[140px] rounded-lg shadow-md transition-transform transform hover:scale-105"
        //                                     />
        //                                 ))}
        //                         </div>
        //                     </div>
        //                     <div className="mt-8 flex justify-end">
        //                         <button
        //                             onClick={() => {
        //                                 setIsModalOpen(false);
        //                                 setSelectedPost(null);
        //                             }}
        //                             className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded transition duration-300"
        //                         >
        //                             Đóng
        //                         </button>
        //                     </div>
        //                 </form>
        //             </div>
        //         </div>
        //     )}
        // </div>
        <div>
            list of deleted posts
        </div>
    );
};

export default DeletedPosts;