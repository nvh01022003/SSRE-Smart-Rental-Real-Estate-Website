import React, { useState } from "react"
import Header from "../containers/System/Header"
import { Link } from 'react-router-dom'

const HistoryPayment = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalPages = 2; // Example total pages

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
        <div>
            <Header />
            <div className='px-6'>
                <div className='flex items-center py-4 border-b border-gray-200'>
                    <Link to="/he-thong/vi-tien" className='text-3xl font-medium ml-4 hover:text-blue-700'>
                        Ví tiền tài khoản
                    </Link>
                    <span className=' text-3xl font-medium mx-2'>/</span>
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
                                {/* Thêm dữ liệu vào đây */}
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

export default HistoryPayment;
