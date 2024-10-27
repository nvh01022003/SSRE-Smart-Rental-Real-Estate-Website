import React, { useState } from "react"
import Header from "../containers/System/Header"
import { Link } from 'react-router-dom'

// Define fake data
const fakeData = [
    {
        date: '2023-10-01',
        transactionId: 'TXN123456',
        method: 'MOMO',
        amount: '500,000đ',
        promotion: '10%',
        received: '550,000đ',
        status: 'Completed',
        note: 'Nạp thành công'
    },
    {
        date: '2023-10-02',
        transactionId: 'TXN123457',
        method: 'Bank Transfer',
        amount: '1,000,000đ',
        promotion: '20%',
        received: '1,200,000đ',
        status: 'Pending',
        note: 'Đang xử lý'
    },
    // Add more fake data as needed
];

const DepositeHistory = () => {
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

    // Function to format date
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    return (
        <div>
            <div className='px-6'>
                <div className='flex items-center py-4 border-b border-gray-200'>
                    <h1 className='text-3xl font-medium '>
                        Lịch sử nạp tiền
                    </h1>
                </div>
                <div className='flex gap-4'>
                    <div className="py-4 flex flex-col gap-8 flex-auto">
                        <table className="min-w-full border-collapse border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="border border-gray-200 px-4 py-2">Ngày nạp</th>
                                    <th className="border border-gray-200 px-4 py-2">Mã giao dịch</th>
                                    <th className="border border-gray-200 px-4 py-2">Phương thức</th>
                                    <th className="border border-gray-200 px-4 py-2">Số tiền</th>
                                    <th className="border border-gray-200 px-4 py-2">Khuyến mãi</th>
                                    <th className="border border-gray-200 px-4 py-2">Thực nhận</th>
                                    <th className="border border-gray-200 px-4 py-2">Trạng thái</th>
                                    <th className="border border-gray-200 px-4 py-2">Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{formatDate(item.date)}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{item.transactionId}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{item.method}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{item.amount}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{item.promotion}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{item.received}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{item.status}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{item.note}</td>

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
    );
}
export default DepositeHistory;