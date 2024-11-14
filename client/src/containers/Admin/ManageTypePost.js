// src/containers/Admin/ManageTypePost.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchTypePosts,
    createTypePost,
    updateTypePost,
    deleteTypePost,
} from "../../store/actions/admin";
import Swal from "sweetalert2";

const ManageTypePost = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [selectedTypePosts, setSelectedTypePosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenView, setIsModalOpenView] = useState(false);
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [currentTypePost, setCurrentTypePost] = useState(null);
    const [newTypePost, setNewTypePost] = useState({ name: '', price: '' });
    const [errors, setErrors] = useState({});
    const { token } = useSelector((state) => state.auth);
    const { typePosts } = useSelector((state) => state.admin);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        dispatch(fetchTypePosts(token));
    }, [dispatch, token]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const toggleSelectTypePost = (id) => {
        if (selectedTypePosts.includes(id)) {
            setSelectedTypePosts(selectedTypePosts.filter((typePostId) => typePostId !== id));
        } else {
            setSelectedTypePosts([...selectedTypePosts, id]);
        }
    };

    const toggleSelectAllTypePosts = () => {
        if (selectedTypePosts.length === typePosts.length) {
            setSelectedTypePosts([]);
        } else {
            setSelectedTypePosts(typePosts.map((typePost) => typePost.id));
        }
    };

    const handleDeleteSelected = () => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa các loại tin này?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Không, hủy!'
        }).then((result) => {
            if (result.isConfirmed) {
                selectedTypePosts.forEach((typePostId) => dispatch(deleteTypePost(token, typePostId)));
                setTimeout(() => {
                    dispatch(fetchTypePosts(token));
                }, 1000);
                Swal.fire('', 'Xóa toàn bộ loại tin thành công!', 'success');
                setSelectedTypePosts([]);
            }
        });
    };

    const openModal = (typePost) => {
        setCurrentTypePost(typePost);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTypePost(null);
        setErrors({});
    };

    const openModalView = (typePost) => {
        setCurrentTypePost(typePost);
        setIsModalOpenView(true);
    };

    const closeModalView = () => {
        setIsModalOpenView(false);
        setCurrentTypePost(null);
    };

    const openModalCreate = () => {
        setIsModalOpenCreate(true);
    };

    const closeModalCreate = () => {
        setIsModalOpenCreate(false);
        setNewTypePost({ name: '', price: '' });
        setErrors({});
    };

    const handleUpdateTypePost = async () => {
        if (currentTypePost) {
            if (!validateUpdate()) return;

            try {
                await dispatch(updateTypePost(token, currentTypePost.id, currentTypePost.name, currentTypePost.price));
                Swal.fire('Thành công', 'Cập nhật loại tin thành công!', 'success');
                setTimeout(() => closeModal(), 1000);
                await dispatch(fetchTypePosts(token));
            } catch (error) {
                console.error(error);
                Swal.fire('Lỗi', 'Lỗi khi cập nhật thông tin loại tin!', 'error');
            }
        }
    };

    const handleCreateTypePost = async () => {
        if (!validateCreate()) return;

        try {
            await dispatch(createTypePost(token, newTypePost.name, newTypePost.price));
            Swal.fire('Thành công', 'Tạo mới loại tin thành công!', 'success');
            setTimeout(() => closeModalCreate(), 1000);
            await dispatch(fetchTypePosts(token));
        } catch (error) {
            console.error(error);
            Swal.fire('Lỗi', 'Lỗi khi tạo mới loại tin!', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentTypePost({ ...currentTypePost, [name]: value });
    };

    const handleNewTypePostChange = (e) => {
        const { name, value } = e.target;
        setNewTypePost({ ...newTypePost, [name]: value });
    };

    // Hàm validateUpdate
    const validateUpdate = () => {
        const newErrors = {};
        const trimmedName = currentTypePost.name.trim();

        // Biểu thức chính quy cho phép ký tự tiếng Việt và chặn ký tự đặc biệt
        const specialCharPattern = /[^a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯàáâãèéêìíòóôõùúăđĩũơưẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸạảấầẩẫậắằẳẵặẹẻẽềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/;

        if (!trimmedName) {
            newErrors.name = 'Tên loại tin không được để trống';
        } else if (specialCharPattern.test(trimmedName)) {
            newErrors.name = 'Tên loại tin không được chứa ký tự đặc biệt';
        } else {
            // Kiểm tra tên trùng với các loại tin khác
            const isDuplicate = typePosts.some(
                (typePost) =>
                    typePost.name.toLowerCase() === trimmedName.toLowerCase() &&
                    typePost.id !== currentTypePost.id
            );
            if (isDuplicate) {
                newErrors.name = 'Tên loại tin đã tồn tại';
            }
        }

        if (!currentTypePost.price) {
            newErrors.price = 'Giá không được để trống';
        } else if (isNaN(currentTypePost.price) || currentTypePost.price <= 0) {
            newErrors.price = 'Giá phải là số dương';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Hàm validateCreate
    const validateCreate = () => {
        const newErrors = {};
        const trimmedName = newTypePost.name.trim();

        const specialCharPattern = /[^a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯàáâãèéêìíòóôõùúăđĩũơưẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸạảấầẩẫậắằẳẵặẹẻẽềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/;

        if (!trimmedName) {
            newErrors.name = 'Tên loại tin không được để trống';
        } else if (specialCharPattern.test(trimmedName)) {
            newErrors.name = 'Tên loại tin không được chứa ký tự đặc biệt';
        } else {
            // Kiểm tra tên trùng với các loại tin đã tồn tại
            const isDuplicate = typePosts.some(
                (typePost) => typePost.name.toLowerCase() === trimmedName.toLowerCase()
            );
            if (isDuplicate) {
                newErrors.name = 'Tên loại tin đã tồn tại';
            }
        }

        if (!newTypePost.price) {
            newErrors.price = 'Giá không được để trống';
        } else if (isNaN(newTypePost.price) || newTypePost.price <= 0) {
            newErrors.price = 'Giá phải là số dương';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDeleteTypePost = async (typePostId) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc muốn xóa loại tin này?',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'custom-confirm',
                cancelButton: 'custom-cancel',
                title: 'custom-title',
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
                        width: 300px;
                    }
                </style>
            `,
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deleteTypePost(token, typePostId));
                Swal.fire({
                    title: 'Xóa thành công!',
                    text: 'Loại tin đã được xóa!',
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
                    dispatch(fetchTypePosts(token));
                }, 1000);
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Xóa loại tin thất bại!',
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
            }
        }
    };

    const filteredTypePosts = typePosts.filter((typePost) =>
        typePost.name.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const totalPages = Math.ceil(filteredTypePosts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTypePosts.slice(indexOfFirstItem, indexOfLastItem);

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
            <h2 className="text-3xl font-medium mb-10">Quản lý loại tin</h2>

            {/* Search and Create Button */}
            <div className="flex flex-col md:flex-row mb-8">
                <input
                    type="text"
                    placeholder="Tìm kiếm loại tin theo tên..."
                    value={search}
                    onChange={handleSearch}
                    className="border p-2 rounded-md flex-grow mb-2 md:mb-0 md:mr-4"
                />
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300"
                    onClick={openModalCreate}
                >
                    Tạo mới
                </button>
            </div>

            {/* Bulk Delete */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <button
                    className={`bg-red-500 hover:bg-red-600 transition duration-300 text-white px-4 py-2 rounded-md ${selectedTypePosts.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleDeleteSelected}
                    disabled={selectedTypePosts.length === 0}
                >
                    Xóa loại tin đã chọn
                </button>
                <div className="flex items-center mt-2 md:mt-0">
                    <input
                        type="checkbox"
                        checked={selectedTypePosts.length === typePosts.length}
                        onChange={toggleSelectAllTypePosts}
                    />
                    <span className="ml-2">Chọn tất cả</span>
                </div>
            </div>

            {/* Type Post Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-5 flex-1 max-h-[calc(50vh-79px)]">
                <div className="h-[calc(50vh-130px)]">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead className="sticky top-0 bg-gray-100">
                            <tr className="bg-gray-100 font-semibold text-gray-700 uppercase tracking-wider">
                                <th className='border border-gray-200 px-4 py-2 '>
                                    <input
                                        type="checkbox"
                                        checked={selectedTypePosts.length === typePosts.length}
                                        onChange={toggleSelectAllTypePosts}
                                    />
                                </th>
                                <th className='border border-gray-200 px-4 py-2 '>ID</th>
                                <th className='border border-gray-200 px-4 py-2 '>Tên loại tin</th>
                                <th className='border border-gray-200 px-4 py-2 '>Giá (VNĐ/ngày)</th>
                                <th className='border border-gray-200 px-4 py-2 '>Ngày tạo</th>
                                <th className='border border-gray-200 px-4 py-2 '>Ngày cập nhật</th>
                                <th className='border border-gray-200 px-4 py-2 '>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="overflow-y-auto">
                            {currentItems.map((typePost) => (
                                <tr key={typePost.id} className="border-b">
                                    <td className='border border-gray-200 px-4 py-2 text-center align-middle'>
                                        <input
                                            type="checkbox"
                                            checked={selectedTypePosts.includes(typePost.id)}
                                            onChange={() => toggleSelectTypePost(typePost.id)}
                                        />
                                    </td>
                                    <td className='border border-gray-200 px-4 py-2 text-center align-middle'>{typePost.id}</td>
                                    <td className='border border-gray-200 px-4 py-2 text-center align-middle'>{typePost.name}</td>
                                    <td className='border border-gray-200 px-4 py-2 text-center align-middle'>{Number(typePost.price).toLocaleString('de-DE')}</td>
                                    <td className='border border-gray-200 px-4 py-2 text-center align-middle'>{formatDate(typePost.createdAt)}</td>
                                    <td className='border border-gray-200 px-4 py-2 text-center align-middle'>{formatDate(typePost.updatedAt)}</td>
                                    <td className='border border-gray-200 px-4 py-2 text-center align-middle'>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md mr-2 transition duration-300"
                                            onClick={() => openModalView(typePost)}
                                        >
                                            Xem
                                        </button>
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md mr-2 transition duration-300"
                                            onClick={() => openModal(typePost)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md transition duration-300"
                                            onClick={() => handleDeleteTypePost(typePost.id)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                    <span className="ml-2 text-gray-500">loại tin mỗi trang</span>
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

            {/* Create Type Post Modal */}
            {isModalOpenCreate && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3">
                        <h3 className="text-xl font-bold mb-4">Tạo mới loại tin</h3>
                        <div className="mb-4">
                            <label className="font-semibold">Tên loại tin:</label>
                            <input
                                type="text"
                                name="name"
                                value={newTypePost.name}
                                onChange={handleNewTypePostChange}
                                className="border p-2 rounded-md w-full"
                            />
                            {errors.name && <small className="text-red-500 italic">{errors.name}</small>}
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold">Giá (VNĐ/ngày):</label>
                            <input
                                type="number"
                                name="price"
                                value={newTypePost.price}
                                onChange={handleNewTypePostChange}
                                className="border p-2 rounded-md w-full"
                            />
                            {errors.price && <small className="text-red-500 italic">{errors.price}</small>}
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                                onClick={closeModalCreate}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md"
                                onClick={handleCreateTypePost}
                            >
                                Tạo mới
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Type Post Modal */}
            {isModalOpenView && currentTypePost && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3">
                        <h3 className="text-xl font-bold mb-4">Chi tiết loại tin</h3>
                        <div className="mb-4">
                            <label className="font-semibold">ID:</label>
                            <input
                                type="text"
                                value={currentTypePost.id}
                                disabled
                                className="border p-2 rounded-md w-full mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold">Tên loại tin:</label>
                            <input
                                type="text"
                                value={currentTypePost.name}
                                disabled
                                className="border p-2 rounded-md w-full mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold">Giá (VNĐ/ngày):</label>
                            <input
                                type="text"
                                value={Number(currentTypePost.price).toLocaleString('de-DE')}
                                disabled
                                className="border p-2 rounded-md w-full mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold">Ngày tạo:</label>
                            <input
                                type="text"
                                value={formatDate(currentTypePost.createdAt)}
                                disabled
                                className="border p-2 rounded-md w-full mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold">Ngày cập nhật:</label>
                            <input
                                type="text"
                                value={formatDate(currentTypePost.updatedAt)}
                                disabled
                                className="border p-2 rounded-md w-full mt-1"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300"
                                onClick={closeModalView}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Type Post Modal */}
            {isModalOpen && currentTypePost && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h3 className="text-xl font-bold mb-4">Cập nhật loại tin</h3>
                        <div className="mb-4">
                            <label className="font-semibold">ID:</label>
                            <input
                                type="text"
                                value={currentTypePost.id}
                                disabled
                                className="border p-2 rounded-md w-full mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold">Tên loại tin:</label>
                            <input
                                type="text"
                                name="name"
                                value={currentTypePost.name}
                                onChange={handleInputChange}
                                className="border p-2 rounded-md w-full mt-1"
                            />
                            {errors.name && <small className="text-red-500 italic">{errors.name}</small>}
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold">Giá (VNĐ/ngày):</label>
                            <input
                                type="number"
                                name="price"
                                value={currentTypePost.price}
                                onChange={handleInputChange}
                                className="border p-2 rounded-md w-full mt-1"
                            />
                            {errors.price && <small className="text-red-500 italic">{errors.price}</small>}
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md mr-2 transition duration-300"
                                onClick={closeModal}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300"
                                onClick={handleUpdateTypePost}
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTypePost;