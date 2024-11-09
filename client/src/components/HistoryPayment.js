import React, { useState } from "react"
import Header from "../containers/System/Header"

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

const HistoryPayment = () => {
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
                <div className='bg-white shadow-md rounded-lg p-6 mb-6'>
                    <h1 className='text-3xl md:text-4xl font-bold text-gray-800 text-center py-4 border-b border-gray-200'>
                        Lịch sử thanh toán
                    </h1>
                    <div className='flex flex-col gap-4'>
                        <div className="py-4 flex flex-col gap-8 flex-auto">
                            <div className="overflow-x-auto"> {/* Thêm div này để cuộn ngang */}
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
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center mt-4">
                                <div className="flex items-center mb-4 md:mb-0">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default HistoryPayment;