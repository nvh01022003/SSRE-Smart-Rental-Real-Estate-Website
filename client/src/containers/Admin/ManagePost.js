import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsAdmin, deletePost } from "../../store/actions/admin";
import Swal from "sweetalert2";


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
    const [isLoading, setIsLoading] = useState(false); // State để quản lý trạng thái loading

    const modalRef = useRef(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

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

    const handleDeleteSelected = async () => {
        for (const postId of selectedPosts) {
            const post = postsAdmin.find(p => p.id === postId); // Find the post object by ID
            const { value: reasonDeletePost } = await Swal.fire({
                title: `Lí do xóa bài viết có id ${post.id}`,
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

                    // Apply CSS directly to the Confirm button
                    confirmButton.style.backgroundColor = 'red';
                    confirmButton.style.color = 'white';
                    confirmButton.style.padding = '8px 16px';
                    confirmButton.style.marginRight = '20px'; // Create space between the two buttons
                    confirmButton.style.borderRadius = '4px';
                    confirmButton.style.border = 'none';
                    confirmButton.style.cursor = 'pointer';

                    // Apply CSS directly to the Cancel button
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
                        width: 500px; /* Wider size */
                    }
                    .swal2-validation-message {
                        color: red; /* Red color for error message */
                    }
                </style>
                `,
                preConfirm: () => {
                    const reason = Swal.getInput().value;
                    if (!reason) {
                        Swal.showValidationMessage('Vui lòng nhập lý do xóa bài viết !');
                    }
                    return reason; // Return the reason if the user enters it
                }
            });

            if (reasonDeletePost) {
                setIsLoading(true); // Show Loading indicator at the start of processing
                try {
                    await dispatch(deletePost(postId, token, reasonDeletePost));
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
                    setIsLoading(false); // Hide Loading indicator after processing
                }
            }
        }
        dispatch(fetchPostsAdmin(token, 1)); // Refresh post list after deletion
        setSelectedPosts([]); // Clear selected posts
    };

    const openModalView = (post) => {
        setCurrentPost(post);
        setIsModalOpenView(true);
    };

    const closeModalView = () => {
        setIsModalOpenView(false);
        setCurrentPost(null);
    };

    const filteredPosts = postsAdmin.filter(post =>
        (selectedCategory === "all" || post.Category.category_name === selectedCategory) &&
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
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

    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);

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

    return (
        <div className="p-4 md:pt-9 md:p-6 md:mb-5 bg-white rounded-lg shadow-lg h-[calc(100vh-84px)] flex flex-col">
            <h2 className="text-3xl font-medium mb-10">Quản lý tin đăng</h2>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row mb-8">
                <input
                    type="text"
                    placeholder="Tìm kiếm bài viết theo tiêu đề..."
                    value={search}
                    onChange={handleSearch}
                    className="border p-2 rounded-md flex-grow mb-2 md:mb-0 md:mr-4"
                />
                <select value={selectedCategory} onChange={handleCategoryChange} className="border border-gray-400 p-2 rounded-md">
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
                    className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300 ${selectedPosts.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
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
            <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-5 flex-1 max-h-[calc(50vh-79px)]">
                <div className="h-[calc(50vh-130px)]">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead className="sticky top-0 bg-gray-100">
                            <tr className="font-semibold text-gray-700 uppercase tracking-wider">
                                <th className="border border-gray-200 px-2 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedPosts.length === postsAdmin.length}
                                        onChange={toggleSelectAllPosts}
                                    />
                                </th>
                                <th className='border border-gray-200 px-4 py-2'>ID</th>
                                <th className='border border-gray-200 px-4 py-2'>Tiêu đề</th>
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
                                <th className='border border-gray-200 px-4 py-2'>Địa chỉ</th>
                                <th className='border border-gray-200 px-4 py-2'>Danh mục</th>
                                <th className='border border-gray-200 px-4 py-2'>Ngày đăng</th>
                                <th className='border border-gray-200 px-4 py-2'>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading || !postsAdmin.length ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-4">
                                        {isLoading ? 'Đang tải...' : 'Không có bài viết nào trên hệ thống'}
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((post) => (
                                    <tr key={post.id} className="border-b">
                                        <td className="border border-gray-200 px-2 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedPosts.includes(post.id)}
                                                onChange={() => toggleSelectPost(post.id)}
                                            />
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{post.id}</td>
                                        <td className="border border-gray-200 px-4 py-2 truncate max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis">{post.title}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{formatNumberWithDots(post.price)}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{formatNumberWithDots(post.acreage)}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{post.Address.city.replace("Thành phố ", "")}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{post.Category.category_name}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{formatDate(post.createdAt)}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md mr-2 transition duration-300"
                                                onClick={() => openModalView(post)}
                                            >
                                                Xem
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md transition duration-300"
                                                onClick={() => handleDeletePost(post.id, post.User.email)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* View Post Modal */}
                {isModalOpenView && currentPost && (
                    <div className="fixed inset-0 bg-gray-600 overflow-y-auto bg-opacity-50 flex items-center justify-center z-50">
                        <div
                            ref={modalRef}
                            className="bg-white p-3.5 rounded-lg w-11/12 md:w-2/3 max-h-screen overflow-y-auto relative "
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

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div className="col-span-1">
                                    <label className="font-semibold">ID:</label>
                                    <input
                                        type="text"
                                        value={currentPost.id}
                                        disabled
                                        className="border p-2 rounded-md w-full"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="font-semibold">Danh mục:</label>
                                    <input
                                        type="text"
                                        value={currentPost.Category.category_name}
                                        disabled
                                        className="border p-2 rounded-md w-full"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="font-semibold">Giá cho thuê (VNĐ/tháng):</label>
                                    <input
                                        type="text"
                                        value={formatNumberWithDots(currentPost.price)}
                                        disabled
                                        className="border p-2 rounded-md w-full"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="font-semibold">Diện tích (m²):</label>
                                    <input
                                        type="text"
                                        value={formatNumberWithDots(currentPost.acreage)}
                                        disabled
                                        className="border p-2 rounded-md w-full"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div className="col-span-1">
                                    <label className="font-semibold">Ngày đăng tin:</label>
                                    <input
                                        type="text"
                                        value={new Date(currentPost.createdAt).toLocaleDateString('vi-VN')}
                                        disabled
                                        className="border p-2 rounded-md w-full"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="font-semibold">Ngày cập nhật tin đăng:</label>
                                    <input
                                        type="text"
                                        value={new Date(currentPost.updatedAt).toLocaleDateString('vi-VN')}
                                        disabled
                                        className="border p-2 rounded-md w-full"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="font-semibold">Ngày hết hạn tin đăng:</label>
                                    <input
                                        type="text"
                                        value={new Date(currentPost.Overview.expire).toLocaleDateString('vi-VN')}
                                        disabled
                                        className="border p-2 rounded-md w-full"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="font-semibold">Đối tượng cho thuê:</label>
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
                            </div>
                            <div className="col-span-2 mb-4">
                                <label className="font-semibold">Địa chỉ chi tiết:</label>
                                <input
                                    type="text"
                                    value={`${currentPost.Address.detail_address}, ${currentPost.Address.district}, ${currentPost.Address.city}`}
                                    disabled
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div className="col-span-2 mb-4">
                                <label className="font-semibold">Tiêu đề:</label>
                                <input
                                    type="text"
                                    value={currentPost.title}
                                    disabled
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                            <div className="col-span-2 mb-4">
                                <label className="font-semibold">Mô tả:</label>
                                <textarea
                                    value={currentPost.description}
                                    disabled
                                    className="border p-2 rounded-md w-full h-32"
                                    style={{ resize: 'none' }}
                                    rows={3}
                                />
                            </div>


                            {/* Image Section */}
                            <div
                                className="w-full mb-4 p-4 rounded-lg shadow-lg border border-gray-300 bg-white "
                                style={{
                                    backgroundColor: '#f9f9f9',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <label className="font-semibold text-lg mb-2 block text-gray-700">Hình ảnh bài viết:</label>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
                                    {Array.isArray(JSON.parse(currentPost.Image.img_url_list)) &&
                                        JSON.parse(currentPost.Image.img_url_list).map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`preview-${index}`}
                                                className="w-full h-42 object-cover rounded-md"
                                            />
                                        ))}
                                </div>
                            </div>

                            {/* User Information Block */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
                                <div className="col-span-3">
                                    <h3 className="text-lg font-medium mb-2">Thông tin người đăng tin</h3>
                                    <div className="mb-2">
                                        <label className="font-semibold">Họ và tên:</label>
                                        <input
                                            type="text"
                                            value={`${currentPost.User.firstName} ${currentPost.User.lastName}`}
                                            disabled
                                            className="border p-2 rounded-md w-full"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="font-semibold">Email:</label>
                                        <input
                                            type="text"
                                            value={currentPost.User.email}
                                            disabled
                                            className="border p-2 rounded-md w-full"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="font-semibold">Số điện thoại:</label>
                                        <input
                                            type="text"
                                            value={currentPost.User.phone}
                                            disabled
                                            className="border p-2 rounded-md w-full"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1 flex justify-center items-center">
                                    <img src={currentPost.User.img_avt} alt={currentPost.User.firstName} className="w-25 h-25 rounded-full object-cover" />
                                </div>
                            </div>

                            <div className="mt-10 justify-end flex">
                                <button
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md mr-2 transition duration-300"
                                    onClick={closeModalView}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center sticky bottom-0 bg-white py-4">
                <div className="flex items-center">
                    <label className="mr-2 text-gray-500">Hiển thị</label>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                    </select>
                    <span className="ml-2 text-gray-500">chuyên mục mỗi trang</span>
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

        </div>
    );
};

export default ManagePost;
