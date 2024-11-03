import React, { useState } from 'react';
import { FiUsers, FiFolder } from 'react-icons/fi';
import { FaEye } from 'react-icons/fa';

const ManageTransaction = () => {
    const [activeTab, setActiveTab] = useState("DepositeHistory");
    const [isModalOpenView, setIsModalOpenView] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Define fake data
    const fakeData = [
        {
            date: '2023-10-01',
            transactionId: 'TXN123456',
            username: 'Joshnguyen',
            method: 'MOMO',
            amount: '500,000đ',
            status: 'Completed',
            note: 'Nạp thành công',
            user: {
                firstName: 'Josh',
                lastName: 'Nguyen',
                phone: '0123456789',
                email: 'josh@example.com',
                img_avt: 'path/to/image.jpg'
            }
        },
        {
            date: '2023-10-02',
            transactionId: 'TXN123457',
            username: 'Joshnguyen1',
            method: 'Bank Transfer',
            amount: '1,000,000đ',
            status: 'Pending',
            note: 'Đang xử lý',
            user: {
                firstName: 'Josh',
                lastName: 'Nguyen',
                phone: '0123456789',
                email: 'josh@example.com',
                img_avt: 'path/to/image.jpg'
            }
        },
    ];
    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return '';
        const [date, time] = dateTimeString.split(' ');
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year} ${time}`;
    };
    const ManageD = () => {
        const [currentPage, setCurrentPage] = useState(1);
        const [itemsPerPage, setItemsPerPage] = useState(10);
        const totalPages = Math.ceil(fakeData.length / itemsPerPage);

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
            setCurrentUser(item.user); // Set user info for modal
            setIsModalOpenView(true);
        };

        // Define the closeModalView function
        const closeModalView = () => {
            setIsModalOpenView(false);
            setCurrentUser(null);
        };
        // Calculate the data to display on the current page
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = fakeData.slice(indexOfFirstItem, indexOfLastItem);
        return (
            <div className='px-6'>
                <h1 className='text-3xl font-medium py-4'>Lịch sử nạp tiền</h1>
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            <th style={{ borderBottom: '2px solid #e2e8f0', padding: '8px' }}>Ngày nạp</th>
                            <th style={{ borderBottom: '2px solid #e2e8f0', padding: '8px' }}>Mã giao dịch</th>
                            <th style={{ borderBottom: '2px solid #e2e8f0', padding: '8px' }}>Người nạp</th>
                            <th style={{ borderBottom: '2px solid #e2e8f0', padding: '8px' }}>Phương thức</th>
                            <th style={{ borderBottom: '2px solid #e2e8f0', padding: '8px' }}>Số tiền</th>
                            <th style={{ borderBottom: '2px solid #e2e8f0', padding: '8px' }}>Trạng thái</th>
                            <th style={{ borderBottom: '2px solid #e2e8f0', padding: '8px' }}>Ghi chú</th>
                            <th style={{ borderBottom: '2px solid #e2e8f0', padding: '8px' }}>Thông tin người dùng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={index}>
                                <td style={{ borderBottom: '1px solid #e2e8f0', padding: '8px', textAlign: 'center' }}>{item.date}</td>
                                <td style={{ borderBottom: '1px solid #e2e8f0', padding: '8px', textAlign: 'center' }}>{item.transactionId}</td>
                                <td style={{ borderBottom: '1px solid #e2e8f0', padding: '8px', textAlign: 'center' }}>{item.username}</td>
                                <td style={{ borderBottom: '1px solid #e2e8f0', padding: '8px', textAlign: 'center' }}>{item.method}</td>
                                <td style={{ borderBottom: '1px solid #e2e8f0', padding: '8px', textAlign: 'center' }}>{item.amount}</td>
                                <td style={{ borderBottom: '1px solid #e2e8f0', padding: '8px', textAlign: 'center' }}>{item.status}</td>
                                <td style={{ borderBottom: '1px solid #e2e8f0', padding: '8px', textAlign: 'center' }}>{item.note}</td>
                                <td className="p-2 flex justify-center">
                                    <button className="bg-blue-500 text-white px-2 py-1 rounded-md" onClick={() => openModalView(item)}>
                                        <FaEye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                            Previous
                        </button>
                        <span className="text-gray-500">{currentPage} of {totalPages} pages</span>
                        <button onClick={handleNextPage} className="px-4 py-2 bg-gray-200 rounded-full ml-2" disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </div>
                {isModalOpenView && currentUser && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-4 md:p-6 rounded-lg w-11/12 md:w-1/3">
                            <h3 className="text-xl font-bold mb-4">Thông tin chi tiết</h3>
                            <div className="mb-4">
                                <label>Tên:</label>
                                <input type="text" value={currentUser.firstName + ' ' + currentUser.lastName} disabled className="border p-2 rounded-md w-full" />
                            </div>
                            <div className="mb-4">
                                <label>Số điện thoại:</label>
                                <input type="text" value={currentUser.phone} disabled className="border p-2 rounded-md w-full" />
                            </div>
                            <div className="mb-4">
                                <label>Email:</label>
                                <input type="email" value={currentUser.email} disabled className="border p-2 rounded-md w-full" />
                            </div>
                            <div className="mb-4">
                                <label>Hình ảnh:</label>
                                <img src={currentUser.img_avt} alt={currentUser.firstName} className="w-15 h-15 rounded-full object-cover mt-3" />
                            </div>
                            <div className="flex">
                                <div className="mt-20">
                                    <button className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2" onClick={closeModalView}>
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
    const ManageH = () => {
        const fakeData = [
            {
                time: '2023-10-01 10:00',
                activityType: 'Deposit',
                postId: 'POST123456',
                postType: 'Premium',
                balance: '1,000,000đ',
                fee: '50,000đ',
                remaining: '950,000đ',
                status: 'Completed'
            },
            {
                time: '2023-10-02 14:30',
                activityType: 'Withdrawal',
                postId: 'POST123457',
                postType: 'Standard',
                balance: '950,000đ',
                fee: '20,000đ',
                remaining: '930,000đ',
                status: 'Pending'
            },
            // Add more fake data as needed
        ];
        const formatDate = (dateTimeString) => {
            const [date, time] = dateTimeString.split(' ');
            const [year, month, day] = date.split('-');
            return `${day}-${month}-${year} ${time}`;
        };
        const [currentPage, setCurrentPage] = useState(1);
        const [itemsPerPage, setItemsPerPage] = useState(10);
        const totalPages = Math.ceil(fakeData.length / itemsPerPage);

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
        const currentItems = fakeData.slice(indexOfFirstItem, indexOfLastItem);

        return (
            <div>
                <div className='px-6'>
                    <div className='flex items-center py-4 border-b border-gray-200'>
                        <h1 className='text-3xl font-medium '>
                            Lịch sử thanh toán
                        </h1>
                    </div>
                    <div className='flex gap-4'>
                        <div className="py-4 flex flex-col gap-8 flex-auto">
                            <table className="min-w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-200 px-4 py-2">Thời gian</th>
                                        <th className="border border-gray-200 px-4 py-2">Loại hoạt động</th>
                                        <th className="border border-gray-200 px-4 py-2">Mã tin đăng</th>
                                        <th className="border border-gray-200 px-4 py-2">Loại tin</th>
                                        <th className="border border-gray-200 px-4 py-2">Số dư</th>
                                        <th className="border border-gray-200 px-4 py-2">Phí</th>
                                        <th className="border border-gray-200 px-4 py-2">Còn lại</th>
                                        <th className="border border-gray-200 px-4 py-2">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{formatDate(item.time)}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.activityType}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.postId}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.postType}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.balance}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.fee}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.remaining}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-center">{item.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                                        Previous
                                    </button>
                                    <span className="text-gray-500">{currentPage} of {totalPages} pages</span>
                                    <button onClick={handleNextPage} className="px-4 py-2 bg-gray-200 rounded-full ml-2" disabled={currentPage === totalPages}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab("DepositeHistory")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${activeTab === "DepositeHistory" ? "bg-blue-500 text-white" : "bg-white"}`}
                >
                    <FiUsers />
                    <span>DepositeHistory</span>
                </button>
                <button
                    onClick={() => setActiveTab("HistoryPayment")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${activeTab === "HistoryPayment" ? "bg-blue-500 text-white" : "bg-white"}`}
                >
                    <FiFolder />
                    <span>HistoryPayment</span>
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