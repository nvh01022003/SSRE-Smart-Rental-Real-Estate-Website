import React, { useState, useEffect } from "react";
import { FaUser, FaChartBar, FaListAlt, FaExchangeAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
    const [timeFrame, setTimeFrame] = useState("daily");
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalCategory, setTotalCategory] = useState(0);
    const [totalTransactions, setTotaTransactions] = useState(0);
    const [totalPaymentTransactions, setTotalPaymentTransactions] = useState(0);
    const [depositRevenue, setDepositRevenue] = useState([]);
    const [newUsers, setNewUsers] = useState([]);

    const fetchNewUsers = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/admin/newusers?year=2024`);
            const data = await response.json();
            if (response.ok) {
                const formattedData = data.data.map(item => ({
                    name: `Tháng ${item.month}`,
                    newUsersCount: item.newUsersCount,
                }));
                setNewUsers(formattedData);
                console.log("Dữ liệu người dùng mới:", formattedData);
            } else {
                console.error("Không thể lấy dữ liệu số lượng người dùng mới:", data.message);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu số lượng người dùng mới:", error.message);
        }
    };

    const fetchDepositRevenue = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/admin/getDepositRevenueByTime?year=2024`);
            const data = await response.json();
            if (response.ok) {
                const formattedData = data.totalDeposit.data.map(item => ({
                    name: `Tháng ${item.month}`,
                    totalDeposit: parseFloat(item.total_deposit) || 0,
                }));
                setDepositRevenue(formattedData);
                console.log("Dữ liệu doanh thu nạp tiền (formatted):", formattedData);
            } else {
                console.error("Không thể lấy dữ liệu doanh thu nạp tiền:", data.message);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu doanh thu nạp tiền:", error.message);
        }
    };



    const fetchTotalUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch("http://localhost:5000/api/v1/admin/getTotalUsers", {
                method: "GET",
                headers: {
                    "token": `${token}`,

                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch total users");
            }

            const data = await response.json();
            setTotalUsers(data.total);
        } catch (error) {
            console.error("Error fetching total users:", error.message);
        }
    };

    const fetchTotalCategory = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch("http://localhost:5000/api/v1/admin/getTotalCategory", {
                method: "GET",
                headers: {
                    "token": `${token}`,

                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch total users");
            }

            const data = await response.json();
            setTotalCategory(data.total);
        } catch (error) {
            console.error("Error fetching total users:", error.message);
        }
    };

    const fetchTotalTransactions = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch("http://localhost:5000/api/v1/admin/getTotalTransactions", {
                method: "GET",
                headers: {
                    "token": `${token}`,

                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch total users");
            }

            const data = await response.json();
            setTotaTransactions(data.total);
        } catch (error) {
            console.error("Error fetching total users:", error.message);
        }
    };

    const fetchTotalPaymentTransactions = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch("http://localhost:5000/api/v1/admin/getTotalPaymentTransactions", {
                method: "GET",
                headers: {
                    "token": `${token}`,

                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch total users");
            }

            const data = await response.json();
            setTotalPaymentTransactions(data.total);
        } catch (error) {
            console.error("Error fetching total users:", error.message);
        }
    };

    useEffect(() => {
        fetchTotalUsers();
        fetchTotalCategory();
        fetchTotalTransactions();
        fetchTotalPaymentTransactions();
        fetchDepositRevenue();
        fetchNewUsers();
    }, []);

    useEffect(() => {
        console.log("Dữ liệu doanh thu nạp tiền:", depositRevenue);
        console.log("Dữ liệu người dùng mới:", newUsers);
    }, [depositRevenue, newUsers]);


    const generateMonthlyData = () => {
        if (depositRevenue.length === 0 || newUsers.length === 0) {
            console.warn("Dữ liệu chưa đủ để hiển thị biểu đồ.");
            return [];
        }

        const data = depositRevenue.map((item, index) => ({
            name: item.name,
            deposit: item.totalDeposit || 0,
            users: newUsers[index]?.newUsersCount || 0,
        }));

        console.log("Dữ liệu cho biểu đồ (theo tháng):", data);
        return data;
    };
    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 w-full">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Tổng số người dùng</p>
                            <h2 className="text-3xl font-bold">{totalUsers}</h2>
                        </div>
                        <FaUser className="text-blue-500 text-3xl" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Tổng danh mục</p>
                            <h2 className="text-3xl font-bold">{totalCategory}</h2>
                        </div>
                        <FaListAlt className="text-green-500 text-3xl" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Tổng số giao dịch</p>
                            <h2 className="text-3xl font-bold">{totalPaymentTransactions}</h2>
                        </div>
                        <FaCheckCircle className="text-green-500 text-3xl" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Bảng giá dịch vụ</p>
                            <h2 className="text-3xl font-bold">{totalTransactions}</h2>
                        </div>
                        <FaChartBar className="text-purple-500 text-3xl" />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Bảng hoạt động tổng quan</h2>
                </div>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={generateMonthlyData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis
                                yAxisId="left"
                                width={80}
                                domain={[0, 'dataMax']}
                                tickFormatter={(value) => new Intl.NumberFormat('en-US').format(value)}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[0, 'dataMax']}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="deposit" fill="#4F46E5" name="Doanh thu nạp tiền" barSize={20} />
                            <Bar yAxisId="right" dataKey="users" fill="#10B981" name="Người dùng mới" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;