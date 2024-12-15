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

    const fetchDepositRevenue = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/manager/getDepositRevenueByTime?year=2024`);
            const data = await response.json();
            if (response.ok) {
                const formattedData = data.data.map(item => ({
                    name: `Tháng ${item.month}`,
                    totalDeposit: item.total_deposit,
                }));
                setDepositRevenue(formattedData);
            } else {
                console.error("Không thể lấy dữ liệu doanh thu nạp tiền:", data.message);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu doanh thu nạp tiền:", error.message);
        }
    };

    const fetchNewUsers = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/manager/newusers?year=2024`);
            const data = await response.json();
            if (response.ok) {
                const formattedData = data.data.map(item => ({
                    name: `Tháng ${item.month}`,
                    newUsersCount: item.newUsersCount,
                }));
                setNewUsers(formattedData);
            } else {
                console.error("Không thể lấy dữ liệu số lượng người dùng mới:", data.message);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu số lượng người dùng mới:", error.message);
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

    const generateMonthlyData = () => {
        const data = depositRevenue.map((item, index) => ({
            name: item.name,
            deposit: item.totalDeposit,
            users: newUsers[index]?.newUsersCount || 0,
        }));
        return data;
    };



    const getDayName = (date) => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return days[date.getDay()];
    };

    const generateDailyData = () => {
        const data = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() - i);
            data.unshift({
                name: `${getDayName(currentDate)} ${currentDate.getDate()}/${currentDate.getMonth() + 1}`,
                postings: Math.floor(Math.random() * 100),
                transactions: Math.floor(Math.random() * 100),
                upgrades: Math.floor(Math.random() * 30),
            });
        }

        return data;
    };

    const dailyData = generateDailyData();


    const monthlyData = [
        { name: "Jan", postings: 250, transactions: 180, upgrades: 65 },
        { name: "Feb", postings: 280, transactions: 200, upgrades: 75 },
        { name: "Mar", postings: 320, transactions: 220, upgrades: 85 },
        { name: "Apr", postings: 350, transactions: 240, upgrades: 95 }
    ];

    const recentActivity = [
        { id: 1, type: "Bài viết", description: "New luxury apartment listed", date: "2024-01-20" },
        { id: 2, type: "Lợi nhuận", description: "Rental agreement signed", date: "2024-01-19" },
        { id: 3, type: "Tài khoản nâng cấp", description: "Premium account request", date: "2024-01-18" }
    ];

    const [sortedActivity, setSortedActivity] = useState(recentActivity);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });

        const sorted = [...sortedActivity].sort((a, b) => {
            if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
            if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
            return 0;
        });
        setSortedActivity(sorted);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
                        alt="Smart Rental Logo"
                        className="h-12 w-12 rounded-full"
                    />
                    <h1 className="text-2xl font-bold text-gray-800">Smart Rental Real Estate</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Admin User</span>
                    <FaUser className="text-gray-600 text-xl" />
                </div>
            </div>

            {/* Metrics Cards */}
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
                            <h2 className="text-3xl font-bold">{totalTransactions}</h2>
                        </div>
                        <FaCheckCircle className="text-green-500 text-3xl" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Bảng giá dịch vụ</p>
                            <h2 className="text-3xl font-bold">{totalPaymentTransactions}</h2>
                        </div>
                        <FaChartBar className="text-purple-500 text-3xl" />
                    </div>
                </div>
            </div>


            {/* Chart Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Bảng hoạt động tổng quan</h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-600">View:</span>
                        <select
                            className="border rounded-md p-2"
                            value={timeFrame}
                            onChange={(e) => setTimeFrame(e.target.value)}
                        >
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                </div>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={timeFrame === "daily" ? dailyData : generateMonthlyData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="deposit" fill="#4F46E5" name="Doanh thu nạp tiền" />
                            <Bar dataKey="users" fill="#10B981" name="Người dùng mới" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;