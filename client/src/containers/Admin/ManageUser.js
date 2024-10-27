import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUsers, deleteUser, updateUser } from "../../store/actions/admin";
import { FaTrashAlt, FaEdit, FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const ManageUser = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    //const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal
    const [isModalOpenView, setIsModalOpenView] = useState(false); // State to control modal
    const [currentUser, setCurrentUser] = useState(null); // State to store user info for update
    const { token } = useSelector((state) => state.auth);
    const users = useSelector((state) => state.admin.users);
    //console.log(users);

    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null); // Handle image file


    useEffect(() => {
        // Delay fetchUsers by 1 second
        const delayFetch = setTimeout(() => {
            dispatch(fetchUsers(token));  // Use dispatch to call fetchUsers action

        }, 1); // 1000ms = 1 second

        return () => clearTimeout(delayFetch); // Clean up the timeout if the component unmounts
    }, [dispatch, token]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const toggleSelectUser = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const toggleSelectAllUsers = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user.id));
        }
    };

    const handleDeleteSelected = () => {
        selectedUsers.forEach(userId => dispatch(deleteUser(userId, token)));
        Swal.fire('Thành công', 'Xóa toàn bộ người dùng thành công !', 'success');
        setSelectedUsers([]);
    };

    const openModal = (user) => {
        setCurrentUser(user); // Set the current user for editing
        setIsModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
        setCurrentUser(null);  // Clear the current user
        setErrors({});
    };

    const handleUpdateUser = async () => {
        if (currentUser) {
            if (!validate()) return;

            try {
                await dispatch(updateUser(currentUser.id, currentUser, token));
                Swal.fire('Thành công', 'Cập nhật người dùng thành công !', 'success');
                setTimeout(() => closeModal(), 1000); // Close modal after successful update

                await dispatch(fetchUsers(token));  // Refresh user list
            } catch (error) {
                console.error(error);
                // Check for specific error messages based on backend response
                if (error.response.data.err === 1) {
                    setErrors({ email: 'Email đã được sử dụng' });
                } else if (error.response.data.err === 2) {
                    setErrors({ phone: 'Số điện thoại đã được sử dụng' });
                } else {
                    Swal.fire('Error', 'Lỗi khi cập nhật thông tin người dùng !', 'error');
                }
            }
        }
    };



    const openModalView = (user) => {
        setCurrentUser(user); // Set the current user for view
        setIsModalOpenView(true); // Open the modal
    };

    const closeModalView = () => {
        setIsModalOpenView(false); // Close the modal
        setCurrentUser(null);  // Clear the current user
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser({ ...currentUser, [name]: value });
    };


    const filteredUsers = users.filter(user =>
        (role === "all" || user.role === role) &&
        (user.firstName.toLowerCase().includes(search.toLowerCase()) || user.lastName.toLowerCase().includes(search.toLowerCase()))
    );

    // Validation function similar to PersonalInfo
    const validate = () => {
        const newErrors = {};
        if (!currentUser.firstName.trim()) newErrors.firstName = 'Không để trống';
        if (!currentUser.lastName.trim()) newErrors.lastName = 'Không để trống';
        if (!/\S+@\S+\.\S+/.test(currentUser.email)) newErrors.email = 'Email không đúng định dạng';
        if (!/^\d{10}$/.test(currentUser.phone)) newErrors.phone = 'Số điện thoại không hợp lệ';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDeleteUser = async (userId) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc muốn xóa người dùng này ?',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
            buttonsStyling: false, // Tắt kiểu mặc định của SweetAlert2
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
            customClass: {
                title: 'custom-title',  // Tùy chỉnh CSS cho tiêu đề
            },
            html: `
                <style>
                    .custom-title {
                        font-size: 20px;
                        font-weight: bold;
                    }
                    .swal2-popup {
                        width: 300px; /* Kích thước nhỏ gọn */
                    }
                </style>
            `,
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deleteUser(userId, token));
                Swal.fire({
                    title: 'Xóa người dùng thành công !',
                    text: 'Người dùng đã được xóa',
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
                    dispatch(fetchUsers(token)); // Refresh user list after deletion
                }, 1);
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Xóa người dùng thất bại',
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


    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>

            {/* Search and Role Filter */}
            <div className="flex flex-col md:flex-row mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm người dùng theo tên..."
                    value={search}
                    onChange={handleSearch}
                    className="border p-2 rounded-md flex-grow mb-2 md:mb-0 md:mr-4"
                />
                <select value={role} onChange={handleRoleChange} className="border p-2 rounded-md">
                    <option value="all">Tất cả vai trò</option>
                    <option value="tenant">Người thuê</option>
                    <option value="ladnlord">Chủ nhà</option>
                </select>
            </div>

            {/* Bulk Delete */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <button
                    className={`bg-red-500 text-white px-4 py-2 rounded-md ${selectedUsers.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleDeleteSelected}
                    disabled={selectedUsers.length === 0}
                >
                    Xóa người dùng đã chọn
                </button>
                <div className="flex items-center mt-2 md:mt-0">
                    <input
                        type="checkbox"
                        checked={selectedUsers.length === users.length}
                        onChange={toggleSelectAllUsers}
                    />
                    <span className="ml-2">Chọn tất cả</span>
                </div>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.length === users.length}
                                    onChange={toggleSelectAllUsers}
                                />
                            </th>
                            <th className="p-2">ID</th>
                            <th className="p-2">Họ</th>
                            <th className="p-2">Tên</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Số điện thoại</th>
                            <th className="p-2 hidden md:table-cell">Vai trò</th>
                            <th className="p-2 hidden md:table-cell">Hình ảnh</th>
                            <th className="p-2">Chức năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b">
                                <td className="p-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => toggleSelectUser(user.id)}
                                    />
                                </td>
                                <td className="p-2">{user.id}</td>
                                <td className="p-2">{user.firstName}</td>
                                <td className="p-2">{user.lastName}</td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2">{user.phone}</td>
                                <td className="p-2 hidden md:table-cell">
                                    {user.role === "tenant" ? "Người thuê" : user.role === "ladnlord" ? "Chủ nhà" : user.role}
                                </td>
                                <td className="p-2 hidden md:table-cell">
                                    <img src={user.img_avt} alt={user.firstName} className="w-12 h-12 rounded-full object-cover" />
                                </td>
                                <td className="p-2">
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                                        onClick={() => openModalView(user)} // View details logic 
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2"
                                        onClick={() => openModal(user)} // Open modal with user data
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded-md"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Update User Modal */}
            {isModalOpenView && currentUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 md:p-6 rounded-lg w-11/12 md:w-1/3">
                        <h3 className="text-xl font-bold mb-4">Thông tin chi tiết người dùng</h3>
                        <div className="mb-4">
                            <label>ID:</label>
                            <input
                                type="text"
                                value={currentUser.id}
                                disabled
                                className="border p-2 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label>Họ:</label>
                            <input
                                type="text"
                                value={currentUser.firstName}
                                disabled
                                className="border p-2 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label>Tên:</label>
                            <input
                                type="text"
                                value={currentUser.lastName}
                                disabled
                                className="border p-2 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={currentUser.email}
                                disabled
                                className="border p-2 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label>Số điện thoại:</label>
                            <input
                                type="text"
                                value={currentUser.phone}
                                disabled
                                className="border p-2 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label>Vai trò:</label>
                            <input
                                name="role"
                                value={currentUser.role === "tenant" ? "Người thuê" : currentUser.role === "ladnlord" ? "Chủ nhà" : currentUser.role}
                                disabled
                                className="border p-2 rounded-md w-full"
                            />
                        </div>
                        <div className="flex">
                            <div className="w-5/6">
                                <label>Hình ảnh:</label>
                                <img src={currentUser.img_avt} alt={currentUser.firstName} className="w-15 h-15 rounded-full object-cover mt-3" />
                            </div>
                            <div className="mt-20">
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                                    onClick={closeModalView}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update User Modal */}
            {isModalOpen && currentUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 md:p-6 rounded-lg w-11/12 md:w-1/3">
                        <h3 className="text-xl font-bold mb-4">Cập nhật người dùng</h3>
                        <div className="mb-4">
                            <label>ID:</label>
                            <input
                                type="text"
                                value={currentUser.id}
                                disabled
                                className="border p-2 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label>Họ:</label>
                            <input
                                type="text"
                                name="firstName"
                                value={currentUser.firstName}
                                onChange={handleInputChange}
                                className="border p-2 rounded-md w-full"
                            />
                            {errors.firstName && <small className="text-red-500 italic">{errors.firstName}</small>}
                        </div>
                        <div className="mb-4">
                            <label>Tên:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={currentUser.lastName}
                                onChange={handleInputChange}
                                className="border p-2 rounded-md w-full"
                            />
                            {errors.lastName && <small className="text-red-500 italic">{errors.lastName}</small>}
                        </div>
                        <div className="mb-4">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={currentUser.email}
                                onChange={handleInputChange}
                                className="border p-2 rounded-md w-full"
                            />
                            {errors.email && <small className="text-red-500 italic">{errors.email}</small>}
                        </div>
                        <div className="mb-4">
                            <label>Số điện thoại:</label>
                            <input
                                type="text"
                                name="phone"
                                value={currentUser.phone}
                                onChange={handleInputChange}
                                className="border p-2 rounded-md w-full"
                            />
                            {errors.phone && <small className="text-red-500 italic">{errors.phone}</small>}
                        </div>

                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                                onClick={closeModal}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md"
                                onClick={handleUpdateUser}
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

export default ManageUser;
