import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../store/actions/admin";
import Swal from "sweetalert2";

const ManageCategory = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenView, setIsModalOpenView] = useState(false);
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false); // State to control create modal
    const [currentCategory, setCurrentCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ category_name: '' }); // State for new category
    const categories = useSelector((state) => state.app.categories);
    const [errors, setErrors] = useState({});
    const { token } = useSelector((state) => state.auth);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        const delayFetch = setTimeout(() => {
            dispatch(fetchCategories(token));
        }, 1);
        return () => clearTimeout(delayFetch);
    }, [dispatch, token]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const toggleSelectCategory = (id) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter(categoryId => categoryId !== id));
        } else {
            setSelectedCategories([...selectedCategories, id]);
        }
    };

    const toggleSelectAllCategories = () => {
        if (selectedCategories.length === categories.length) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(categories.map(category => category.id));
        }
    };

    const handleDeleteSelected = () => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa các chuyên mục này?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Không, hủy!'
        }).then((result) => {
            if (result.isConfirmed) {
                selectedCategories.forEach(categoryId => dispatch(deleteCategory(categoryId, token)));
                setTimeout(() => {
                    dispatch(fetchCategories(token));
                }, 1);
                Swal.fire('', 'Xóa toàn bộ chuyên mục thành công!', 'success');
                setSelectedCategories([]);
            }
        });
    };

    const openModal = (category) => {
        setCurrentCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
        setErrors({});
    };

    const openModalView = (category) => {
        setCurrentCategory(category);
        setIsModalOpenView(true);
    };

    const closeModalView = () => {
        setIsModalOpenView(false);
        setCurrentCategory(null);
    };

    const openModalCreate = () => {
        setIsModalOpenCreate(true);
    };

    const closeModalCreate = () => {
        setIsModalOpenCreate(false);
        setNewCategory({ category_name: '' });
        setErrors({});
    };

    const handleUpdateCategory = async () => {
        if (currentCategory) {
            if (!validate()) return;

            try {
                await dispatch(updateCategory(currentCategory.id, currentCategory, token));
                Swal.fire('Thành công', 'Cập nhật chuyên mục thành công !', 'success');
                setTimeout(() => closeModal(), 1000);
                await dispatch(fetchCategories(token));
            } catch (error) {
                console.error(error);
                if (error.response.data.err === 1) {
                    setErrors({ category_name: 'Tên chuyên mục đã tồn tại !' });
                } else {
                    Swal.fire('Lỗi', 'Lỗi khi cập nhật thông tin chuyên mục !', 'error');
                }
            }
        }
    };

    const handleCreateCategory = async () => {
        if (!validateCreate()) return;

        try {
            await dispatch(createCategory(newCategory, token));
            Swal.fire('Thành công', 'Tạo mới chuyên mục thành công !', 'success');
            setTimeout(() => closeModalCreate(), 1000);
            await dispatch(fetchCategories(token));
        } catch (error) {
            console.error(error);
            if (error.response.data.err === 1) {
                setErrors({ category_name: 'Tên chuyên mục đã tồn tại !' });
            } else {
                Swal.fire('Lỗi', 'Lỗi khi tạo mới chuyên mục !', 'error');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCategory({ ...currentCategory, [name]: value });
    };

    const handleNewCategoryChange = (e) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        // Cập nhật biểu thức chính quy để cho phép ký tự tiếng Việt và loại bỏ ký tự đặc biệt
        const specialCharPattern = /[^a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯàáâãèéêìíòóôõùúăđĩũơưẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸạảấầẩẫậắằẳẵặẹẻẽềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/;

        // Lấy tên chuyên mục và loại bỏ các dấu cách không chuẩn (non-breaking spaces)
        let categoryNameTrimmed = currentCategory.category_name.trim();
        categoryNameTrimmed = categoryNameTrimmed.replace(/\u00A0/g, " "); // Loại bỏ dấu cách không chuẩn

        // Chuyển tên chuyên mục thành chữ thường để kiểm tra dễ dàng hơn
        categoryNameTrimmed = categoryNameTrimmed.toLowerCase();

        console.log("Trimmed and lowercased category name:", categoryNameTrimmed); // Kiểm tra giá trị sau khi xử lý

        // Kiểm tra nếu tên chuyên mục trống
        if (!categoryNameTrimmed) {
            newErrors.category_name = 'Tên chuyên mục không được để trống';
        }
        // Kiểm tra nếu tên chuyên mục chứa ký tự đặc biệt
        else if (specialCharPattern.test(categoryNameTrimmed)) {
            newErrors.category_name = 'Tên chuyên mục không được chứa ký tự đặc biệt';
        }

        // Cập nhật lỗi và trả về kết quả
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };


    const validateCreate = () => {
        const newErrors = {};
        // Updated regex to allow Vietnamese characters and block special characters
        const specialCharPattern = /[^a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯàáâãèéêìíòóôõùúăđĩũơưẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸạảấầẩẫậắằẳẵặẹẻẽềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/;

        // Lấy tên chuyên mục và loại bỏ các dấu cách không chuẩn (non-breaking spaces)
        let categoryNameTrimmed = newCategory.category_name.trim();
        categoryNameTrimmed = categoryNameTrimmed.replace(/\u00A0/g, " "); // Loại bỏ dấu cách không chuẩn

        // Kiểm tra nếu tên chuyên mục trống
        if (!categoryNameTrimmed) {
            newErrors.category_name = 'Tên chuyên mục không được để trống';
        }
        // Kiểm tra nếu tên chuyên mục chứa ký tự đặc biệt
        else if (specialCharPattern.test(categoryNameTrimmed)) {
            newErrors.category_name = 'Tên chuyên mục không được chứa ký tự đặc biệt';
        }

        // Cập nhật lỗi và trả về kết quả
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };


    const handleDeleteCategory = async (categoryId) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc muốn xóa chuyên mục này ?',
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
                await dispatch(deleteCategory(categoryId, token));
                Swal.fire({
                    title: 'Xóa thành công !',
                    text: 'Chuyên mục đã được xóa !',
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
                    dispatch(fetchCategories(token));
                }, 1);
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Xóa chuyên mục thất bại !',
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

    const filteredCategories = categories.filter(category =>
        category.category_name.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

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
            <h2 className="text-3xl font-medium mb-10">Quản lý chuyên mục</h2>

            {/* Search and Create Button */}
            <div className="flex flex-col md:flex-row mb-8">
                <input
                    type="text"
                    placeholder="Tìm kiếm chuyên mục theo tên..."
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
                    className={`bg-red-500 text-white px-4 py-2 rounded-md ${selectedCategories.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleDeleteSelected}
                    disabled={selectedCategories.length === 0}
                >
                    Xóa chuyên mục đã chọn
                </button>
                <div className="flex items-center mt-2 md:mt-0">
                    <input
                        type="checkbox"
                        checked={selectedCategories.length === categories.length}
                        onChange={toggleSelectAllCategories}
                    />
                    <span className="ml-2">Chọn tất cả</span>
                </div>
            </div>

            {/* Category Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-5 flex-1 max-h-[calc(50vh-79px)]">
                <div className="h-[calc(50vh-130px)]">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead className="sticky top-0 bg-gray-100">
                            <tr className="bg-gray-100 font-semibold text-gray-700 uppercase tracking-wider">
                                <th className='border border-gray-200 px-4 py-2 '>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.length === categories.length}
                                        onChange={toggleSelectAllCategories}
                                    />
                                </th>
                                <th className='border border-gray-200 px-4 py-2 '>ID</th>
                                <th className='border border-gray-200 px-4 py-2 '>Tên chuyên mục</th>
                                <th className='border border-gray-200 px-4 py-2 '>Ngày đăng</th>
                                <th className='border border-gray-200 px-4 py-2 '>Ngày cập nhật</th>
                                <th className='border border-gray-200 px-4 py-2 '>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="overflow-y-auto">
                            {currentItems.map((category) => (
                                <tr key={category.id} className="border-b">
                                    <td className='border border-gray-200 px-4 py-2 text-center align-middle'>
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={() => toggleSelectCategory(category.id)}
                                        />
                                    </td>
                                    <td className='border border-gray-200 px-4 py-2 text-center align-middle'>{category.id}</td>
                                    <td className='border border-gray-200 px-4 py-2 text-center align-middle'>{category.category_name}</td>
                                    <td className='border border-gray-200 px-4 py-2 text-center align-middle'>{formatDate(category.createdAt)}</td>
                                    <td className='border border-gray-200 px-4 py-2 text-center align-middle'>{formatDate(category.updatedAt)}</td>
                                    <td className='border border-gray-200 px-4 py-2 text-center align-middle'>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md mr-2"
                                            onClick={() => openModalView(category)}
                                        >
                                            Xem
                                        </button>
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md mr-2"
                                            onClick={() => openModal(category)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                                            onClick={() => handleDeleteCategory(category.id)}
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


            {/* Create Category Modal */}
            {isModalOpenCreate && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3">
                        <h3 className="text-xl font-bold mb-4">Tạo mới chuyên mục</h3>
                        <div className="mb-4">
                            <label className="font-semibold">Tên chuyên mục:</label>
                            <input
                                type="text"
                                name="category_name"
                                value={newCategory.category_name}
                                onChange={handleNewCategoryChange}
                                className="border p-2 rounded-md w-full"
                            />
                            {errors.category_name && <small className="text-red-500 italic">{errors.category_name}</small>}
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
                                onClick={handleCreateCategory}
                            >
                                Tạo mới
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Category Modal */}
            {isModalOpenView && currentCategory && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3">
                        <h3 className="text-xl font-bold mb-4">Chi tiết chuyên mục</h3>
                        <div className="mb-4">
                            <label className="font-semibold">ID:</label>
                            <input
                                type="text"
                                value={currentCategory.id}
                                disabled
                                className="border p-2 rounded-md w-full mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold">Tên chuyên mục:</label>
                            <input
                                type="text"
                                value={currentCategory.category_name}
                                disabled
                                className="border p-2 rounded-md w-full mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold">Ngày tạo:</label>
                            <input
                                type="text"
                                value={formatDate(currentCategory.createdAt)}
                                disabled
                                className="border p-2 rounded-md w-full mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold">Ngày cập nhật:</label>
                            <input
                                type="text"
                                value={formatDate(currentCategory.updatedAt)}
                                disabled
                                className="border p-2 rounded-md w-full mt-1"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                                onClick={closeModalView}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && currentCategory && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h3 className="text-xl font-bold mb-4">Cập nhật chuyên mục</h3>
                        <div className="mb-4">
                            <label className="font-semibold">ID:</label>
                            <input
                                type="text"
                                value={currentCategory.id}
                                disabled
                                className="border p-2 rounded-md w-full mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold">Tên chuyên mục:</label>
                            <input
                                type="text"
                                name="category_name"
                                value={currentCategory.category_name}
                                onChange={handleInputChange}
                                className="border p-2 rounded-md w-full mt-1"
                            />
                            {errors.category_name && <small className="text-red-500 italic">{errors.category_name}</small>}
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md mr-2"
                                onClick={closeModal}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                                onClick={handleUpdateCategory}
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

export default ManageCategory;
