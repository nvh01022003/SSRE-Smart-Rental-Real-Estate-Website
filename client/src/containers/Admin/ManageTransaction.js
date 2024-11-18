import React, { useState, useEffect, useRef } from 'react';
import { FiCreditCard, FiDollarSign } from 'react-icons/fi';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Loading from '../../components/Loading';

const ManageTransaction = () => {
    const [activeTab, setActiveTab] = useState("DepositeHistory");
    const [isModalOpenView, setIsModalOpenView] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [role, setRole] = useState("all");
    const [depositHistory, setDepositHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState("");

    // Tạo một tham chiếu (reference) đến phần tử input
    const inputRef = useRef(null);

    // Hook useEffect sẽ chạy mỗi khi searchTerm thay đổi
    useEffect(() => {
        // Kiểm tra nếu inputRef.current tồn tại, nếu có thì gọi focus() để đưa tiêu điểm vào input
        inputRef.current?.focus();
    }, [searchTerm]);  // useEffect sẽ chỉ chạy khi searchTerm thay đổi

    useEffect(() => {
        const fetchDepositHistory = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/v1/admin/showAllDepositHistory', {
                    headers: { 'token': `${token}` },
                });
                if (response.data.err === 0) {
                    setDepositHistory(response.data.depositHistory);
                } else {
                    console.error('Error fetching deposit history:', response.data.msg);
                }
            } catch (error) {
                console.error('Error fetching deposit history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDepositHistory();
    }, [token]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const filterDepositHistory = () => {
        return depositHistory.filter(item => {
            const fullName = `${item.Wallet.User.firstName} ${item.Wallet.User.lastName}`.toLowerCase();
            const searchMatch = fullName.includes(searchTerm.toLowerCase());
            const roleMatch = role === "all" || (role === "MoMo" && item.paycode.startsWith('MOMO')) || (role === "BankTransfer" && !item.paycode.startsWith('MOMO'));
            return searchMatch && roleMatch;
        });
    };

    const ManageD = () => {
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        };

        const [currentPage, setCurrentPage] = useState(1);
        const [itemsPerPage, setItemsPerPage] = useState(5);
        const totalPages = Math.ceil(filterDepositHistory().length / itemsPerPage);

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
        const currentItems = filterDepositHistory().slice(indexOfFirstItem, indexOfLastItem);

        const openModalView = (item) => {
            setCurrentUser({
                ...item.Wallet.User,
                date: formatDate(item.createdAt),
                transactionId: item.paycode,
                method: item.paycode.startsWith('MOMO') ? 'MoMo' : 'Chuyển khoản',
                amount: item.amount,
                status: item.status,
            });
            setIsModalOpenView(true);
        };

        const closeModalView = () => {
            setIsModalOpenView(false);
            setCurrentUser(null);
        };

        return (
            <div className="p-4 md:pt-9 md:p-6 md:mb-5 bg-white rounded-lg shadow-lg h-[calc(100vh-149px)] flex flex-col">
                <h2 className="text-3xl font-medium mb-10">Lịch sử nạp tiền</h2>

                {/* Search and Role Filter */}
                <div className="flex flex-col md:flex-row mb-8">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Tìm kiếm người dùng theo tên..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border p-2 rounded-md flex-grow mb-2 md:mb-0 md:mr-4"
                    />
                    <select value={role} onChange={handleRoleChange} className="border border-gray-400 p-2 rounded-md">
                        <option value="all">Phương thức nạp tiền</option>
                        <option value="MoMo">MoMo</option>
                        <option value="BankTransfer">Chuyển Khoản</option>
                    </select>
                </div>

                {isLoading ? (
                    <div><Loading /></div>
                ) : (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg flex-1 max-h-[calc(50vh-79px)]">
                        <div className="h-[calc(50vh-130px)]">
                            <table className="min-w-full border-collapse border border-gray-200">
                                <thead className="sticky top-0 bg-gray-100">
                                    <tr className="font-semibold text-gray-700 uppercase tracking-wider">
                                        <th className="border border-gray-200 px-4 py-2">Người nạp</th>
                                        <th className="border border-gray-200 px-4 py-2">Ngày nạp</th>
                                        <th className="border border-gray-200 px-4 py-2">Mã giao dịch</th>
                                        <th className="border border-gray-200 px-4 py-2">Phương thức</th>
                                        <th className="border border-gray-200 px-4 py-2">Số tiền</th>
                                        <th className="border border-gray-200 px-4 py-2">Trạng thái</th>
                                        <th className="border border-gray-200 px-4 py-2">Chức năng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.Wallet.User.firstName} {item.Wallet.User.lastName}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{formatDate(item.createdAt)}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.paycode}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.paycode.startsWith('MOMO') ? 'MoMo' : 'Chuyển khoản'}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.amount}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.status}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">
                                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md transition duration-300" onClick={() => openModalView(item)}>
                                                    Xem
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
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
                {isModalOpenView && currentUser && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-2 md:p-4 rounded-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto shadow-lg">
                            <h3 className="text-2xl font-semibold mb-1 text-center">Thông tin chi tiết</h3>

                            {/* Transaction Details Section */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Thông tin giao dịch</h4>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Ngày nạp:</label>
                                        <input type="text" value={currentUser.date} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>

                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Mã giao dịch:</label>
                                        <input type="text" value={currentUser.transactionId} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 mt-4">
                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Phương thức:</label>
                                        <input type="text" value={currentUser.method} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>

                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Số tiền:</label>
                                        <input type="text" value={currentUser.amount} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>

                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Trạng thái:</label>
                                        <input type="text" value={currentUser.status} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>
                                </div>
                            </div>

                            {/* User Information Section */}
                            <div className='mb-2'>
                                <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Thông tin người dùng</h4>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Họ và tên người nạp:</label>
                                        <input type="text" value={`${currentUser.firstName} ${currentUser.lastName}`} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>

                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Số điện thoại:</label>
                                        <input type="text" value={currentUser.phone} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>

                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Email:</label>
                                        <input type="email" value={currentUser.email} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>
                                    {/* Close Button */}
                                    <div className="flex-1 min-w-[%] flex justify-end">
                                        <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md mt-6 ml-auto" onClick={closeModalView}>
                                            Đóng
                                        </button>
                                    </div>
                                </div>

                                {/* <div className="flex flex-col items-center mt-4">
                                    <label className="font-medium text-gray-600">Hình ảnh:</label>
                                    <img src={currentUser.img_avt} alt={currentUser.firstName} className="w-20 h-20 rounded-full object-cover mt-2 border-2 border-gray-300" />
                                </div> */}
                            </div>


                        </div>
                    </div>
                )}

            </div>
        );
    };

    const ManageH = () => {
        const [historyPayment, setHistoryPayment] = useState([]);
        const [isModalOpenView, setIsModalOpenView] = useState(false);
        const [currentUser, setCurrentUser] = useState(null);
        const [searchTerm, setSearchTerm] = useState('');
        const [statusFilter, setStatusFilter] = useState('all');
        const [isLoading, setIsLoading] = useState(false);

        const [currentPage, setCurrentPage] = useState(1);
        const [itemsPerPage, setItemsPerPage] = useState(5);
        const inputRef = useRef(null);

        useEffect(() => {
            const fetchHistoryPayment = async () => {
                setIsLoading(true);
                try {
                    const response = await axios.get('http://localhost:5000/api/v1/admin/showAllHistoryPayment', {
                        headers: { 'token': `${token}` },
                    });
                    console.log(response);
                    if (response.data.err === 0) {
                        setHistoryPayment(response.data.historyPayment);
                    } else {
                        console.error('Error fetching history payment:', response.data.msg);
                    }
                } catch (error) {
                    console.error('Error fetching history payment:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchHistoryPayment();
        }, []);

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        };

        const handleSearch = (e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
        };

        const handleStatusChange = (e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
            inputRef.current.value = '';
        };

        const filterHistoryPayment = () => {
            return historyPayment.filter((item) => {
                const fullName = `${item.Wallet.User.firstName} ${item.Wallet.User.lastName}`.toLowerCase();
                const matchesName = fullName.includes(searchTerm.toLowerCase());
                const matchesMethod = statusFilter === 'all' || (item.status === statusFilter);
                console.log('status', item.status);
                console.log('statusFilter', statusFilter);
                return matchesName && matchesMethod;
            });
        };

        // Pagination calculations
        const totalPages = Math.ceil(filterHistoryPayment().length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filterHistoryPayment().slice(indexOfFirstItem, indexOfLastItem);

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

        const openModalView = (item) => {
            setCurrentUser({
                ...item.Wallet.User,
                date: formatDate(item.createdAt),
                transactionId: item.paycode,
                amount: parseInt(item.amount).toLocaleString('vi-VN'),
                content: item.content,
                balanceAfterTransaction: parseInt(item.balanceAfterTransaction).toLocaleString('vi-VN'),
                status: item.status,
            });
            setIsModalOpenView(true);
        };

        const closeModalView = () => {
            setIsModalOpenView(false);
            setCurrentUser(null);
        };

        return (
            <div className="p-4 md:pt-9 md:p-6 md:mb-5 bg-white rounded-lg shadow-lg h-[calc(100vh-149px)] flex flex-col">
                <h2 className="text-3xl font-medium mb-10">Lịch sử thanh toán</h2>

                {/* Search and Method Filter */}
                <div className="flex flex-col md:flex-row mb-8">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Tìm kiếm người dùng theo tên..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border p-2 rounded-md flex-grow mb-2 md:mb-0 md:mr-4"
                    />
                    <select value={statusFilter} onChange={handleStatusChange} className="border border-gray-400 p-2 rounded-md">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="Thành công">Thành công</option>
                        <option value="Thất bại">Thất bại</option>
                    </select>
                </div>

                {isLoading ? (
                    <div><Loading /></div>
                ) : (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg flex-1 max-h-[calc(50vh-79px)]">
                        <div className="h-[calc(50vh-130px)]">
                            <table className="min-w-full border-collapse border border-gray-200">
                                <thead className="sticky top-0 bg-gray-100">
                                    <tr className="font-semibold text-gray-700 uppercase tracking-wider">
                                        <th className="border border-gray-200 px-4 py-2">Người tạo</th>
                                        <th className="border border-gray-200 px-4 py-2">Ngày tạo</th>
                                        <th className="border border-gray-200 px-4 py-2">Mã giao dịch</th>
                                        <th className="border border-gray-200 px-4 py-2">Số tiền</th>
                                        <th className="border border-gray-200 px-4 py-2">Nội dung</th>
                                        <th className="border border-gray-200 px-4 py-2">Trạng thái</th>
                                        <th className="border border-gray-200 px-4 py-2">Số dư</th>
                                        <th className="border border-gray-200 py-2">CN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.Wallet.User.firstName} {item.Wallet.User.lastName}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{formatDate(item.createdAt)}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.paycode}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{parseInt(item.amount).toLocaleString('vi-VN')}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.content}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.status}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{parseInt(item.balanceAfterTransaction).toLocaleString('vi-VN')}</td>
                                            <td className="border border-gray-200 py-2 text-center">
                                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md transition duration-300" onClick={() => openModalView(item)}>
                                                    Xem
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
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

                {isModalOpenView && currentUser && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-2 md:p-4 rounded-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto shadow-lg">
                            <h3 className="text-2xl font-semibold mb-1 text-center">Thông tin chi tiết</h3>

                            {/* Transaction Details Section */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Thông tin thanh toán</h4>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Ngày tạo:</label>
                                        <input type="text" value={currentUser.date} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>

                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Mã giao dịch:</label>
                                        <input type="text" value={currentUser.transactionId} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 mt-4">
                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Số tiền:</label>
                                        <input type="text" value={currentUser.amount} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>

                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Nội dung:</label>
                                        <input type="text" value={currentUser.content} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>

                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Trạng thái:</label>
                                        <input type="text" value={currentUser.status} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>

                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Số dư sau giao dịch:</label>
                                        <input type="text" value={currentUser.balanceAfterTransaction} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>
                                </div>
                            </div>

                            {/* User Information Section */}
                            <div className='mb-2'>
                                <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Thông tin người dùng</h4>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Họ và tên:</label>
                                        <input type="text" value={`${currentUser.firstName} ${currentUser.lastName}`} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>

                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Số điện thoại:</label>
                                        <input type="text" value={currentUser.phone} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>

                                    <div className="flex-1 min-w-[45%]">
                                        <label className="font-medium text-gray-600">Email:</label>
                                        <input type="email" value={currentUser.email} disabled className="border border-gray-300 p-2 rounded-md bg-gray-100 w-full text-gray-700" />
                                    </div>

                                    {/* Close Button */}
                                    <div className="flex-1 min-w-[%] flex justify-end">
                                        <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md mt-6 ml-auto" onClick={closeModalView}>
                                            Đóng
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        );
    };
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab("DepositeHistory")}
                    className={`transition duration-300 flex items-center space-x-1 px-4 py-2 rounded-lg ${activeTab === "DepositeHistory" ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-white"}`}
                >
                    <FiDollarSign />
                    <span>Lịch sử nạp tiền</span>
                </button>
                <button
                    onClick={() => setActiveTab("HistoryPayment")}
                    className={`transition duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg ${activeTab === "HistoryPayment" ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-white"}`}
                >
                    <FiCreditCard />
                    <span>Lịch sử thanh toán</span>
                </button>
            </div>
            <div className="space-y-6">
                {activeTab === "DepositeHistory" && <ManageD />}
                {activeTab === "HistoryPayment" && <ManageH />}
            </div>

        </div>
    );
};

export default ManageTransaction;