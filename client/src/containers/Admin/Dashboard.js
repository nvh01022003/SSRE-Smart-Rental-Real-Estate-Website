import React, { useState, useEffect } from "react";
import { FaUser, FaChartBar, FaListAlt, FaExchangeAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import axios from "axios";

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalupgrade, setTotalupgrade] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalDeletePosts, setTotalDeletePosts] = useState(0);
    const [totalCategory, setTotalCategory] = useState(0);
    const [totalPostTypes, setTotalPostTypes] = useState(0);
    const [totalPaymentTransactions, setTotalPaymentTransactions] = useState(0);
    const [totalDepositTransactions, setTotalDepositTransactions] = useState(0);
    const { token } = useSelector((state) => state.auth);

    const fetchTotalUsers = async () => {
        try {
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

    const fetchTotalPostTypes = async () => {
        try {
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch("http://localhost:5000/api/v1/admin/getTotalPostType", {
                method: "GET",
                headers: {
                    "token": `${token}`,

                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch total post types");
            }

            const data = await response.json();
            setTotalPostTypes(data.total);
        } catch (error) {
            console.error("Error fetching total post types:", error.message);
        }
    };

    const fetchTotalPaymentTransactions = async () => {
        try {
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
                throw new Error(errorData.message || "Failed to fetch total payment transactions");
            }

            const data = await response.json();
            setTotalPaymentTransactions(data.total);
        } catch (error) {
            console.error("Error fetching total payment transactions:", error.message);
        }
    };

    const fetchTotalDepositTransactions = async () => {
        try {
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch("http://localhost:5000/api/v1/admin/getTotalDepositTransactions", {
                method: "GET",
                headers: {
                    "token": `${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch total deposit transactions");
            }

            const data = await response.json();
            setTotalDepositTransactions(data.total);
        } catch (error) {
            console.error("Error fetching total deposit transactions:", error.message);
        }
    };

    const fetchTotalupgrade = async () => {
        try {
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch("http://localhost:5000/api/v1/admin/totalupgrade", {
                method: "GET",
                headers: {
                    "token": `${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch total upgrades");
            }

            const data = await response.json();
            setTotalupgrade(data.total);
        } catch (error) {
            console.error("Error fetching total upgrades:", error.message);
        }
    };

    const fetchTotalPosts = async () => {
        try {
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch("http://localhost:5000/api/v1/admin/getTotalPosts", {
                method: "GET",
                headers: {
                    "token": `${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch total posts");
            }

            const data = await response.json();
            setTotalPosts(data.total);
        } catch (error) {
            console.error("Error fetching total posts:", error.message);
        }
    };

    const fetchTotalDeletePosts = async () => {
        try {
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch("http://localhost:5000/api/v1/admin/getTotalDeletePosts", {
                method: "GET",
                headers: {
                    "token": `${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch total delete posts");
            }

            const data = await response.json();
            setTotalDeletePosts(data.total);
        } catch (error) {
            console.error("Error fetching total delete posts:", error.message);
        }
    };

    useEffect(() => {
        fetchTotalUsers();
        fetchTotalCategory();
        fetchTotalPostTypes();
        fetchTotalPaymentTransactions();
        fetchTotalupgrade();
        fetchTotalPosts();
        fetchTotalDepositTransactions();
        fetchTotalDeletePosts();
    }, []);

    const RevenueChart = () => {
        const [chartData, setChartData] = useState([]);

        useEffect(() => {
            axios
                .get('http://localhost:5000/api/v1/admin/getDepositRevenueByTime', {
                    params: { year: 2024 },
                    headers: {
                        token: `${token}`,
                    },
                })
                .then((res) => {
                    // Transform data to match Recharts needs
                    const data = res.data?.totalDeposit?.data?.map((item) => ({
                        name: `Tháng ${item.month}`,
                        deposit: item.total_deposit,
                    }));
                    setChartData(data);
                })
                .catch((err) => console.error(err));
        }, []);

        return (
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ left: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                            tickFormatter={(value) => new Intl.NumberFormat('en-US').format(value)}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="deposit" fill="#4F46E5" name="Doanh thu nạp tiền" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const NewUsersChart = () => {
        const [chartData, setChartData] = useState([]);

        useEffect(() => {
            axios
                .get('http://localhost:5000/api/v1/admin/newusers', {
                    params: { year: 2024 },
                    headers: {
                        token: `${token}`,
                    },
                })
                .then((res) => {
                    const data = res.data?.data?.map((item) => ({
                        name: `Tháng ${item.month}`,
                        users: item.newUsersCount,
                    }));
                    setChartData(data);
                })
                .catch((err) => console.error(err));
        }, []);

        return (
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ left: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" fill="#10B981" name="Người dùng mới" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const NewPostsChart = () => {
        const [chartData, setChartData] = useState([]);

        useEffect(() => {
            axios
                .get('http://localhost:5000/api/v1/admin/newposts', {
                    params: { year: 2024 },
                    headers: {
                        token: `${token}`,
                    },
                })
                .then((res) => {
                    const data = res.data?.data?.map((item) => ({
                        name: `Tháng ${item.month}`,
                        posts: item.newPostsCount,
                    }));
                    setChartData(data);
                })
                .catch((err) => console.error(err));
        }, []);

        return (
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ left: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="posts" fill="#F97316" name="Bài viết mới" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
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
                            <p className="text-gray-500">Tổng số chuyên mục</p>
                            <h2 className="text-3xl font-bold">{totalCategory}</h2>
                        </div>
                        <FaListAlt className="text-green-500 text-3xl" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Tổng số tin đăng</p>
                            <h2 className="text-3xl font-bold">{totalPosts}</h2>
                        </div>
                        <FaListAlt className="text-green-500 text-3xl" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Tổng số tin đăng quá hạn/bị xóa</p>
                            <h2 className="text-3xl font-bold">{totalDeletePosts}</h2>
                        </div>
                        <FaListAlt className="text-green-500 text-3xl" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Tổng số yêu cầu nâng cấp tài khoản</p>
                            <h2 className="text-3xl font-bold">{totalupgrade}</h2>
                        </div>
                        <FaListAlt className="text-green-500 text-3xl" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Tổng số giao dịch thanh toán</p>
                            <h2 className="text-3xl font-bold">{totalPaymentTransactions}</h2>
                        </div>
                        <FaCheckCircle className="text-green-500 text-3xl" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Tổng số giao dịch nạp tiền</p>
                            <h2 className="text-3xl font-bold">{totalDepositTransactions}</h2>
                        </div>
                        <FaCheckCircle className="text-green-500 text-3xl" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Tổng số loại tin</p>
                            <h2 className="text-3xl font-bold">{totalPostTypes}</h2>
                        </div>
                        <FaChartBar className="text-purple-500 text-3xl" />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Bảng hoạt động tổng quan</h2>
                </div>
                <div >
                    <div className="p-4">
                        <h2 className="font-semibold text-xl mb-4">Thống kê Doanh thu</h2>
                        <RevenueChart />

                        <h2 className="font-semibold text-xl mt-8 mb-4">Thống kê Người dùng mới</h2>
                        <NewUsersChart />

                        <h2 className="font-semibold text-xl mt-8 mb-4">Thống kê Bài viết mới</h2>
                        <NewPostsChart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;