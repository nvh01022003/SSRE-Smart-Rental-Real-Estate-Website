import React, { useEffect, useState } from 'react';
import { FaSearch, FaPlus, FaTrash, FaUndo } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiGetPubliccitys, apiGetPublicDistrict, apiGetPublicWard } from '../../services';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ManagePost = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    //const [filteredPosts, setFilteredPosts] = useState([]);
    const [deletedPosts, setDeletedPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleted, setShowDeleted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const { token } = useSelector(state => state.auth);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [cities, setCities] = useState([]); // Danh sách Tỉnh/Thành phố
    const [districts, setDistricts] = useState([]); // Danh sách Quận/Huyện
    const [wards, setWards] = useState([]); // Danh sách Phường/Xã
    const { categories } = useSelector(state => state.app);

    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:5000/api/v1/user/ladnlord/listPost`, {
                headers: {
                    'token': `${token}`
                },
            });
            console.log('API Response:', response); // Add this line to check the response
            if (response.data.err === 0) {
                setPosts(response.data.msg);
                //setFilteredPosts(response.data.msg);
            } else {
                console.error("Cấu trúc dữ liệu không mong đợi:", response.data);
                setPosts([]);
                //setFilteredPosts([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy bài đăng:", error);
            toast.error("Không thể tải danh sách bài đăng. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCities = async () => {
        const response = await apiGetPubliccitys();
        if (response.status === 200) {
            setCities(response?.data.results);
        }
    };

    const fetchDistricts = async () => {
        if (!city) {
            setDistrict(''); // Đặt lại huyện khi không có tỉnh
            setDistricts([]); // Xóa danh sách huyện
            return;
        }
        const response = await apiGetPublicDistrict(city);
        if (response.status === 200) {
            setDistricts(response.data?.results);
        }
    };

    const fetchWards = async () => {
        if (!district) {
            setWard(''); // Đặt lại phường khi không có huyện
            setWards([]); // Xóa danh sách phường
            return;
        }
        const response = await apiGetPublicWard(district);
        if (response.status === 200) {
            setWards(response.data?.results);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchCities();
    }, [token]);

    useEffect(() => {
        // Kiểm tra nếu selectedPost và selectedPost.Address.city tồn tại thì mới gọi fetchDistricts
        if (selectedPost?.Address?.city) {
            fetchDistricts(selectedPost.Address.city);
        }
    }, [selectedPost?.Address?.city]);

    useEffect(() => {
        console.log('Posts:', posts); // Add this line to check the posts state
    }, [posts]);

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

    const handleEdit = (post) => {
        setSelectedPost({
            ...post,
            city: post.city_id, // Giả sử bạn có city_id trong post
            district: post.district_id, // Giả sử bạn có district_id trong post
            address: post.detail_address_id, // Giả sử bạn có ward_id trong post
        });
        setIsEditing(true);
        setIsModalOpen(true);
        fetchDistricts(post.city_id); // Lấy danh sách quận khi mở modal
        fetchWards(post.district_id); // Lấy danh sách phường khi mở modal
    };

    const handleCloseModal = () => {
        setSelectedPost(null);
        setIsEditing(false);
        setIsModalOpen(false);
    };

    const handleSave = async () => {
        if (isEditing) {
            await handleUpdatePost(selectedPost); // Gọi hàm cập nhật
        } else {
            // Logic để thêm mới bài đăng
        }
        handleCloseModal();
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };


    // Tính toán các bài đăng cho trang hiện tại
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    //const currentPosts = (showDeleted ? deletedPosts : filteredPosts).slice(indexOfFirstPost, indexOfLastPost);

    // Thay đổi trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleUpdatePost = async (updatedPost) => {
        try {
            setIsActionLoading(true);
            const response = await axios.post(`http://localhost:5000/api/v1/user/ladnlord/updatePost/${updatedPost.id}`, updatedPost, {
                headers: {
                    'token': `${token}`
                }
            });
            console.log(response)
            if (response.data.err === 0) {
                toast.success('Cập nhật bài đăng thành công!');
                fetchPosts(); // Làm mới danh sách bài đăng
            } else {
                toast.error('Cập nhật bài đăng thất bi. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật bài đăng:', error);
            toast.error('Đã xảy ra lỗi khi cập nhật bài đăng. Vui lòng thử lại sau.');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };
    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedPost(prev => ({ ...prev, city: cityId, district: '', ward: '' })); // Reset district and ward
        fetchDistricts(cityId);
    };

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        setSelectedPost(prev => ({ ...prev, district: districtId, ward: '' })); // Reset ward
        fetchWards(districtId);
    };

    const handleView = (post) => {
        setSelectedPost(post); // Lưu bài đăng đã chọn
        setIsEditing(false); // Đặt chế độ không chỉnh sửa
        setIsModalOpen(true); // Mở modal
    };

    const filteredPosts = posts.filter(post =>
        (selectedCategory === "all" || post.Category.category_name === selectedCategory) &&
        post.title.toLowerCase().includes(search.toLowerCase())
    );
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newUrls = files.map(file => URL.createObjectURL(file));
        setSelectedPost({ ...selectedPost, Image: { img_url_list: JSON.stringify(newUrls) } });
    };


    console.log(filteredPosts)
    console.log(selectedPost)
    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='mb-8 flex items-center justify-between'>
                <h1 className='text-3xl font-bold text-gray-800'>Quản lý tin đăng</h1>
                <div className='flex items-center'>
                    <div className='relative mr-4'>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tiêu đề..."
                            className='pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                    </div>
                    <button
                        onClick={() => setShowDeleted(!showDeleted)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-300 flex items-center mr-4"
                    >
                        {showDeleted ? <FaUndo className="mr-2" /> : <FaTrash className="mr-2" />}
                        {showDeleted ? 'Tin đang hiển thị' : 'Tin đã xóa'}
                    </button>
                    <button
                        onClick={() => window.location.href = '/he-thong/tao-moi-bai-dang'}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300 flex items-center"
                    >
                        <FaPlus className="mr-2" /> Thêm mới
                    </button>
                </div>
            </div>
            {/* Dropdown cho danh mục */}
            <div className='mb-4'>
                <label className='mr-2'>Chọn danh mục:</label>
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.category_name}>{category.category_name}</option>
                    ))}
                </select>
            </div>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className='py-3 px-4 text-left'>Mã tin</th>
                            <th className='py-3 px-4 text-left'>Tiêu đề</th>
                            <th className='py-3 px-4 text-left'>Giá</th>
                            <th className='py-3 px-4 text-left'>Ngày đăng</th>
                            <th className='py-3 px-4 text-left'>Ảnh</th>
                            <th className='py-3 px-4 text-left'>Danh mục</th>
                            <th className='py-3 px-4 text-left'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                        {isLoading && <div className="text-center">Đang tải...</div>}
                        {filteredPosts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">Không có tin đăng nào</td>
                            </tr>
                        ) : (
                            filteredPosts.map(post => (
                                <tr key={post.id} className="hover:bg-gray-50 transition duration-300">
                                    <td className='py-4 px-4'>{post.id}</td>
                                    <td className='py-4 px-4'>{post.title}</td>
                                    <td className='py-4 px-4'>{post.price}</td>
                                    <td className='py-4 px-4'>{post.createdAt.slice(0, 10)}</td>
                                    <td className='py-4 px-4'>
                                        <img
                                            src={JSON.parse(post.Image.img_url_list)[0]}
                                            alt={post.title}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    </td>
                                    <td className='py-4 px-4'>{post.Category.category_name || 'Không có danh mục'}</td>
                                    <td className='py-4 px-4'>
                                        <button onClick={() => handleView(post)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 transition duration-300">Xem</button>
                                        <button onClick={() => handleEdit(post)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2 transition duration-300">Sửa</button>
                                        <button onClick={() => handleDelete(post.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-300">Xóa</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="mt-4 flex justify-between items-center">
                <span>Tổng số: {filteredPosts.length} tin đăng</span>
                <div>
                    {Array.from({ length: Math.ceil((showDeleted ? deletedPosts : filteredPosts).length / postsPerPage) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-5xl">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">{isEditing ? 'Chỉnh sửa bài đăng' : 'Xem bài đăng'}</h3>
                        {selectedPost && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã tin</label>
                                    <input
                                        type="text"
                                        value={selectedPost.id}
                                        onChange={(e) => setSelectedPost({ ...selectedPost, id: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                                    <input
                                        type="text"
                                        value={selectedPost.title}
                                        onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ / tháng)</label>
                                    <input
                                        type="text"
                                        value={selectedPost.price}
                                        onChange={(e) => setSelectedPost({ ...selectedPost, price: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Diện tích ( mét vuông )</label>
                                    <input
                                        type="text"
                                        value={selectedPost.acreage}
                                        onChange={(e) => setSelectedPost({ ...selectedPost, acreage: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                    <textarea
                                        value={selectedPost.description}
                                        onChange={(e) => setSelectedPost({ ...selectedPost, description: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2 "
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đăng</label>
                                    <input
                                        type="text"
                                        value={new Date(selectedPost.createdAt).toLocaleDateString('vi-VN')}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày cập nhật</label>
                                    <input
                                        type="text"
                                        value={new Date(selectedPost.updatedAt).toLocaleDateString('vi-VN')}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                                    <input
                                        type="text"
                                        value={new Date(selectedPost.Overview.expire).toLocaleDateString('vi-VN')}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                                    {isEditing ? (
                                        <div>
                                            {/* Hiển thị ảnh hiện tại */}
                                            <div className="flex gap-14 mb-2">
                                                {JSON.parse(selectedPost.Image.img_url_list).map((url, index) => (
                                                    <img
                                                        key={index}
                                                        src={url}
                                                        alt={`Post Image ${index + 1}`}
                                                        className="w-1/5 h-auto rounded"
                                                    />
                                                ))}
                                            </div>

                                            {/* Nút chọn ảnh */}
                                            <input
                                                type="file"
                                                onChange={(e) => handleImageChange(e)}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                multiple
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            {JSON.parse(selectedPost.Image.img_url_list).map((url, index) => (
                                                <img
                                                    key={index}
                                                    src={url}
                                                    alt={`Post Image ${index + 1}`}
                                                    className="w-1/5 h-auto rounded"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                                    <input
                                        type="text"
                                        value={selectedPost.Category.category_name}
                                        onChange={(e) => setSelectedPost({ ...selectedPost, category_name: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng cho thuê</label>
                                    {isEditing ? (
                                        <select
                                            value={selectedPost.Overview.target}
                                            onChange={(e) =>
                                                setSelectedPost({
                                                    ...selectedPost,
                                                    Overview: { ...selectedPost.Overview, target: Number(e.target.value) }
                                                })
                                            }
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        >
                                            <option value="0">Tất cả</option>
                                            <option value="1">Nam</option>
                                            <option value="2">Nữ</option>
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={
                                                selectedPost.Overview.target === 0
                                                    ? "Tất cả"
                                                    : selectedPost.Overview.target === 1
                                                        ? "Nam"
                                                        : "Nữ"
                                            }
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                            disabled
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số nhà, đường</label>
                                    <input
                                        type="text"
                                        value={selectedPost.Address.detail_address}
                                        onChange={(e) =>
                                            setSelectedPost({
                                                ...selectedPost,
                                                Address: { ...selectedPost.Address, detail_address: e.target.value }
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                                    {isEditing ? (
                                        <select
                                            value={selectedPost.Address.district}
                                            onChange={(e) =>
                                                setSelectedPost({
                                                    ...selectedPost,
                                                    Address: { ...selectedPost.Address, district: e.target.value }
                                                })
                                            }
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        >
                                            <option value="">Chọn quận/huyện</option>
                                            {districts.map((district) => (
                                                <option key={district.district_id} value={district.district_name}>
                                                    {district.district_name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={selectedPost.Address.district}
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                            disabled
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                                    {isEditing ? (
                                        <select
                                            value={selectedPost.Address.city}
                                            onChange={(e) => {
                                                setSelectedPost({
                                                    ...selectedPost,
                                                    Address: { ...selectedPost.Address, city: e.target.value, district: "" } // Reset district when city changes
                                                });
                                            }}
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        >
                                            <option value="">Chọn tỉnh/thành phố</option>
                                            {cities.map((city) => (
                                                <option key={city.province_id} value={city.province_name}>
                                                    {city.province_name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={selectedPost.Address.city}
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                            disabled
                                        />
                                    )}
                                </div>

                            </div>
                        )}
                        <div className="mt-8 flex justify-end">
                            <button onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded transition duration-300">Đóng</button>
                            {isEditing && <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition duration-300 ml-4">Cập Nhập</button>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default ManagePost;