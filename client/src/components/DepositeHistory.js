import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';

const DepositeHistory = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = useSelector(state => state.auth.token);

    const totalPages = Math.ceil(transactions.length / itemsPerPage);

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

    // Fetch deposit history from the API
    useEffect(() => {
        const fetchDepositHistory = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/user/depositHistory', {
                    headers: {
                        'token': `${token}`,
                    }
                });
                console.log(res)
                if (res.data.err === 0) {
                    setTransactions(res.data.transactions);
                }
            } catch (error) {
                console.error('Error fetching deposit history:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDepositHistory();
    }, [token]);

    // Calculate the data to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
    console.log(currentItems);
    console.log(transactions);
    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

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
                                    <th className="border border-gray-200 px-4 py-2">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{formatDate(item.createdAt)}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{item.paycode}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{item.paycode.startsWith('MOMO') ? 'MoMo' : 'Chuyển khoản'}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{item.amount}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center align-middle">{item.status}</td>
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
    );
}

export default DepositeHistory;