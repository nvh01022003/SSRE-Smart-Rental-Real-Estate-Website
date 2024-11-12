import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { apiGetPubliccitys, apiGetPublicDistrict, apiGetPublicWard } from '../../services';
import Swal from 'sweetalert2';
import { fetchCategories } from '../../store/actions';
import { Loading } from '../../components';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const DeletedPosts = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [errors, setErrors] = useState({});
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useSelector(state => state.auth);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [cities, setCities] = useState([]); // Danh sách Tỉnh/Thành phố
    const { categories } = useSelector(state => state.app);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    const filteredPosts = posts.filter(post =>
        (selectedCategory === "all" || post.Category.category_name === selectedCategory) &&
        post.title.toLowerCase().includes(search.toLowerCase())
    );

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

    // Get current posts
    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    useEffect(() => {
        dispatch(fetchCategories()); // Fetch categories when the component mounts
    }, [dispatch]);

    const parseImageUrls = (img_url_list) => {
        try {
            return JSON.parse(img_url_list);
        } catch (error) {
            console.error('Error parsing img_url_list:', error);
            return [];
        }
    };

    const handleRestore = async (id) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn khôi phục tin đăng này?',
            text: "Hành động này sẽ khôi phục bài đăng!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, khôi phục!',
            cancelButtonText: 'Không, hủy!'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.put(`http://localhost:5000/api/v1/user/ladnlord/restorePost/${id}`,{}, {
                    headers: {
                        'token': `${token}`
                    }
                });
                if (response.data.err === 0) {
                    Swal.fire('Đã khôi phục!', 'Bài đăng đã được khôi phục.', 'success');
                    fetchPosts(); // Refresh the list of posts
                } else {
                    Swal.fire('Lỗi!', 'Khôi phục bài đăng thất bại. Vui lòng thử lại.', 'error');
                }
            } catch (error) {
                console.error('Lỗi khi khôi phục bài đăng:', error);
                Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi khôi phục bài đăng. Vui lòng thử lại sau.', 'error');
            }
        }
    };
    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:5000/api/v1/user/ladnlord/listPostSoftDelete`, {
                headers: {
                    'token': `${token}`
                },
            });
            console.log(response)
            if (response.data.err === 0) {
                setPosts(response.data.posts); // Giả sử 'posts' chứa dữ liệu trong phản hồi
            } else {
                toast.error("Không thể tải danh sách bài đăng. Vui lòng thử lại sau.");
                console.error("Cấu trúc dữ liệu không mong đợi:", response.data);
                setPosts([]);
            }
        } catch (error) {
            toast.error("Lỗi khi lấy bài đăng: Vui lòng thử lại sau.");
            console.error("Lỗi khi lấy danh sách bài đăng đã xóa:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [token]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };
    const fetchCities = async () => {
        const response = await apiGetPubliccitys();
        if (response.status === 200) {
            setCities(response?.data.results);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [token]);


    // Call this function in useEffect to fetch deleted posts when the component mounts
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa tin đăng này?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Không, hủy!'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/v1/user/ladnlord/deletePost/${id}`, {
                    headers: {
                        'token': `${token}`
                    }
                });
                if (response.data.err === 0) {
                    Swal.fire('Đã xóa!', 'Bài đăng đã được xóa.', 'success');
                    fetchPosts(); // Làm mới danh sách bài đăng
                } else {
                    Swal.fire('Lỗi!', 'Xóa bài đăng thất bại. Vui lòng thử lại.', 'error');
                }
            } catch (error) {
                console.error('Lỗi khi xóa bài đăng:', error);
                Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi xóa bài đăng. Vui lòng thử lại sau.', 'error');
            }
        }
    };

    const handleCloseModal = () => {
        setSelectedPost(null);
        setIsEditing(false);
        setIsModalOpen(false);
        setErrors({}); // Clear errors when closing the modal
    };

    const handleView = async (post) => {
        await fetchCities(); // Fetch cities when opening the modal
        setSelectedPost(post); // Lưu bài đăng đã chọn
        await fetchPosts();
        setIsEditing(false); // Đặt chế độ không chỉnh sửa
        setIsModalOpen(true); // Mở modal
    };

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='bg-white shadow-md rounded-lg p-6'>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-800 text-center py-4 border-b border-gray-200'>Danh sách tin đã xóa</h1>
                <div className="flex mt-5 gap-10">
                    <div className='relative mb-4 md:mr-4 w-full md:w-[85%] '> {/* Thay đổi chiều rộng cho di động */}
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tiêu đề..."
                            className='pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full' // Thêm w-full để ô tìm kiếm chiếm toàn bộ chiều rộng
                            value={search}
                            onChange={handleSearch}
                        />
                        <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                    </div>
                    {/* Dropdown cho danh mục */}
                    <div className='mb-4 w-full md:w-[15%] justify-end'> {/* Thay đổi chiều rộng cho di động */}
                        <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ' // Thêm w-full để dropdown chiếm toàn bộ chiều rộng
                        >
                            <option value="all">Tất cả danh mục</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.category_name}>{category.category_name}</option>
                            ))}
                        </select>
                    </div>
                    </div>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-5 ">
                    
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead className="sticky top-0 bg-gray-100">
                            <tr className="font-semibold text-gray-700 uppercase tracking-wider">
                                <th className='border border-gray-200 py-2 '>Mã tin</th>
                                <th className='border border-gray-200 px-4 py-2 '>Tiêu đề</th>
                                <th className='border border-gray-200  py-2'>
                                    <div className="flex flex-col">
                                        <span>Giá thuê</span>
                                        <span>(VNĐ/tháng)</span>
                                    </div>
                                </th>
                                <th className='border border-gray-200  py-2'>
                                    <div className="flex flex-col">
                                        <span>Diện tích</span>
                                        <span>(m²)</span>
                                    </div>
                                </th>
                                <th className='border border-gray-200 px-4 py-2 '>Ngày đăng</th>
                                <th className='border border-gray-200  px-4 py-2 '>Ảnh</th>
                                <th className='border border-gray-200 px-4 py-2 '>Danh mục</th>
                                <th className='border border-gray-200 px-4 py-2 '>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {isLoading && <div className="text-center">Đang tải...</div>}
                            {currentPosts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">Không có tin đăng nào</td>
                                </tr>
                            ) : (
                                currentPosts.map(post => (
                                    <tr key={post.id} className="hover:bg-gray-50 transition duration-300">
                                        <td className='border border-gray-200 py-2 text-center align-middle'>{post.id}</td>
                                        <td className='border border-gray-200 px-4 py-2 truncate max-w-xs'>{post.title}</td> {/* Title truncation */}
                                        <td className='border border-gray-200 py-2 text-center align-middle'>{post.price}</td>
                                        <td className='border border-gray-200  py-2 text-center align-middle'>{post.acreage}</td>
                                        <td className='border border-gray-200 px-4 py-2 text-center align-middle'>{formatDate(post.createdAt)}</td>
                                        <td className='border border-gray-200 px-4 py-2 text-center align-middle'>
                                            <img
                                                src={JSON.parse(post.Image.img_url_list)[0]}
                                                alt={post.title}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                        </td>
                                        <td className='border border-gray-200  py-2 text-center align-middle'>{post.Category.category_name || 'Không có danh mục'}</td>
                                        <td className='border border-gray-200  py-2 text-center align-middle'>
                                            <button onClick={() => handleView(post)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 transition duration-300">Xem</button>
                                            <button onClick={() => handleRestore(post.id)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2 transition duration-300">Khôi phục</button>
                                            <button onClick={() => handleDelete(post.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-300">Xóa</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    </div>
                {/* Pagination */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-4">
                    <div className="flex items-center mb-4 md:mb-0">
                        <label className="mr-2 text-gray-500">Hiển thị</label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1); // Reset to the first page when items per page changes
                            }}
                            className="border border-gray-300 rounded px-2 py-1"
                        >
                            <option value={4}>4</option>
                            <option value={8}>8</option>
                            <option value={16}>16</option>
                        </select>
                        <span className="ml-2 text-gray-500">giao dịch mỗi trang</span>
                    </div>
                    <div className="flex items-center">
                        <button onClick={handlePreviousPage} className="px-4 py-2 bg-gray-200 rounded-full mr-2" disabled={currentPage === 1}>
                            Trước
                        </button>
                        <span className="text-gray-500">{currentPage} trên {totalPages} trang</span>
                        <button onClick={handleNextPage} className="px-4 py-2 bg-gray-200 rounded-full ml-2" disabled={currentPage === totalPages}>
                            Sau
                        </button>
                    </div>
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                        <div className="bg-white p-4 md:p-8 rounded-lg shadow-xl w-full max-w-6xl">
                            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Chi tiết bài đăng</h3>
                            {isLoading ? (
                                <div><Loading /></div>
                            ) : (
                                selectedPost && (
                                    <form className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                            <div className="relative col-span-1 md:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã tin</label>
                                                <input
                                                    type="text"
                                                    value={selectedPost.id}
                                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                                    disabled
                                                />
                                            </div>
                                            <div className="relative col-span-1 md:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ / tháng)</label>
                                                <input
                                                    type="text"
                                                    value={selectedPost.price}
                                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                                    disabled
                                                />
                                            </div>
                                            <div className="relative col-span-1 md:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Diện tích (m²)</label>
                                                <input
                                                    type="text"
                                                    value={selectedPost.acreage}
                                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                                    disabled
                                                />
                                            </div>
                                            <div className="relative col-span-1 md:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đăng</label>
                                                <input
                                                    type="text"
                                                    value={new Date(selectedPost.createdAt).toLocaleDateString('vi-VN')}
                                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                                    disabled
                                                />
                                            </div>
                                            <div className="relative col-span-1 md:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày cập nhật</label>
                                                <input
                                                    type="text"
                                                    value={new Date(selectedPost.updatedAt).toLocaleDateString('vi-VN')}
                                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                                    disabled
                                                />
                                            </div>
                                            <div className="relative col-span-1 md:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                                                <input
                                                    type="text"
                                                    value={new Date(selectedPost.Overview.expire).toLocaleDateString('vi-VN')}
                                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                                            <input
                                                type="text"
                                                value={selectedPost.title}
                                                className="w-full border border-gray-300 rounded px-3 py-2"
                                                disabled
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                            <textarea
                                                value={selectedPost.description}
                                                className="w-full border border-gray-300 rounded px-3 py-2"
                                                rows="3"
                                                disabled
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                            <div className="relative col-span-1 md:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                                                <input
                                                    type="text"
                                                    value={selectedPost?.Category?.category_name || ''}
                                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                                    disabled
                                                />
                                            </div>
                                            <div className="relative col-span-1 md:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng cho thuê</label>
                                                <input
                                                    type="text"
                                                    value={
                                                        selectedPost.Overview.target === "0"
                                                            ? "Tất cả"
                                                            : selectedPost.Overview.target === "1"
                                                                ? "Nam"
                                                                : "Nữ"
                                                    }
                                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                                    disabled
                                                />
                                            </div>
                                            <div className="relative col-span-1 md:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                                                <input
                                                    type="text"
                                                    value={selectedPost.Address.city}
                                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                                    disabled
                                                />
                                            </div>
                                            <div className="relative col-span-1 md:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                                                <input
                                                    type="text"
                                                    value={selectedPost.Address.district}
                                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                                    disabled
                                                />
                                            </div>
                                            <div className="relative col-span-1 md:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Số nhà, đường</label>
                                                <input
                                                    type="text"
                                                    value={selectedPost.Address.detail_address}
                                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                                    disabled
                                                />
                                            </div>
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh</label>
                                                {parseImageUrls(selectedPost.Image.img_url_list).map((url, index) => (
                                                    <img
                                                        key={index}
                                                        src={url}
                                                        alt={`Post Image ${index + 1}`}
                                                        className="w-[140px] h-[140px] rounded-lg shadow-md transition-transform transform hover:scale-105"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-8 flex justify-end">
                                            <button onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded transition duration-300">Đóng</button>
                                        </div>
                                    </form>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeletedPosts;