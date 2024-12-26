import React, { useState, useEffect } from "react";
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
        const maxValue = chartData.length > 0 ? Math.max(...chartData.map((item) => item.deposit)) : 0;
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
                        name: `${item.month}`,
                        deposit: item.total_deposit,
                    }));
                    setChartData(data);
                })
                .catch((err) => console.error(err));
        }, []);

        return (
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}
                        margin={{ top: 28, right: 53, left: 20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="name"
                            label={{
                                value: "Tháng",
                                offset: -5,
                                dx: 225,
                                dy: -15,
                            }}
                        />

                        <YAxis
                            tickFormatter={(value) =>
                                new Intl.NumberFormat("vi-VN").format(Math.round(value))
                            }
                            domain={[0, maxValue]}
                            allowDecimals={false}
                            label={{
                                value: "VNĐ",
                                angle: -360,
                                dx: 30,
                                dy: -140,
                            }}
                        />

                        <Tooltip
                            formatter={(value) =>
                                `${new Intl.NumberFormat("vi-VN").format(value)} VNĐ`
                            }
                            labelFormatter={(label) => `Tháng: ${label}`}
                        />
                        <Legend />
                        <Bar
                            dataKey="deposit"
                            fill="#4F46E5"
                            name="Giao dịch nạp tiền"
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const PaymentChart = () => {
        const [chartData, setChartData] = useState([]);
        const maxValue = chartData.length > 0 ? Math.max(...chartData.map((item) => item.deposit)) : 0;
        useEffect(() => {
            axios
                .get('http://localhost:5000/api/v1/admin/getPaymentByTime', {
                    params: { year: 2024 },
                    headers: {
                        token: `${token}`,
                    },
                })
                .then((res) => {
                    // Transform data to match Recharts needs
                    const data = res.data?.totalDeposit?.data?.map((item) => ({
                        name: `${item.month}`,
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
                        margin={{ top: 28, right: 53, left: 20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name"
                            label={{
                                value: "Tháng",
                                offset: -5,
                                dx: 225,
                                dy: -15,
                            }}
                        />
                        <YAxis
                            tickFormatter={(value) => new Intl.NumberFormat('vi-VN').format(Math.round(value))} // Định dạng số
                            domain={[0, maxValue]} // Thiết lập giá trị lớn nhất theo tính toán
                            allowDecimals={false} // Không cho phép số thập phân
                            label={{
                                value: "VNĐ",
                                angle: -360,
                                dx: 30,
                                dy: -140,
                            }}
                        />

                        <Tooltip
                            formatter={(value) =>
                                `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`
                            } // Định dạng số trong Tooltip
                            labelFormatter={(label) => `Tháng: ${label}`} // Định dạng tháng
                        />
                        <Legend />
                        <Bar dataKey="deposit" fill="#FF0000" name="Giao dịch thanh toán" barSize={20} />
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
                        name: `${item.month}`,
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
                        margin={{ top: 28, right: 53, left: 20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name"
                            label={{
                                value: "Tháng",
                                offset: -5,
                                dx: 225,
                                dy: -15,
                            }}
                        />
                        <YAxis
                            tickFormatter={(value) => Math.round(value)} // Làm tròn giá trị về số nguyên
                            domain={[0, 'dataMax']} // Giới hạn trục Y từ 0 đến giá trị lớn nhất trong dữ liệu
                            allowDecimals={false} // Không cho phép hiển thị số thập phân
                            label={{
                                value: "Số người",
                                angle: -360,
                                dx: 30,
                                dy: -140,
                            }}
                        />

                        <Tooltip
                            labelFormatter={(label) => `Tháng: ${label}`} // Định dạng tháng
                        />
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
                        name: `${item.month}`,
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
                        margin={{ top: 25, right: 53, left: 20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name"
                            label={{
                                value: "Tháng",
                                offset: -5,
                                dx: 225,
                                dy: -15,
                            }}
                        />
                        <YAxis
                            label={{
                                value: "Số bài viết",
                                angle: -360,
                                dx: 30,
                                dy: -140,
                            }} />
                        <Tooltip
                            labelFormatter={(label) => `Tháng: ${label}`} // Định dạng tháng
                        />
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
                <div className="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-1 hover:shadow-2xl transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Tổng số người dùng</p>
                            <h2 className="text-3xl font-bold text-gray-800">{totalUsers}</h2>
                        </div>
                        <div className="text-blue-500 text-4xl">👤</div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-1 hover:shadow-2xl transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Tổng số chuyên mục</p>
                            <h2 className="text-3xl font-bold text-gray-800">{totalCategory}</h2>
                        </div>
                        <div className="text-green-500 text-4xl">📋</div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-1 hover:shadow-2xl transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Tổng số tin đăng</p>
                            <h2 className="text-3xl font-bold text-gray-800">{totalPosts}</h2>
                        </div>
                        <div className="text-green-500 text-4xl">📝</div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-1 hover:shadow-2xl transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Tổng số tin đăng quá hạn/bị xóa</p>
                            <h2 className="text-3xl font-bold text-gray-800">{totalDeletePosts}</h2>
                        </div>
                        <div className="text-green-500 text-4xl">❌</div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-1 hover:shadow-2xl transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Tổng số yêu cầu nâng cấp tài khoản</p>
                            <h2 className="text-3xl font-bold text-gray-800">{totalupgrade}</h2>
                        </div>
                        <div className="text-green-500 text-4xl">🔼</div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-1 hover:shadow-2xl transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Tổng số giao dịch thanh toán</p>
                            <h2 className="text-3xl font-bold text-gray-800">{totalPaymentTransactions}</h2>
                        </div>
                        <div className="text-green-500 text-4xl">✅</div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-1 hover:shadow-2xl transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Tổng số giao dịch nạp tiền</p>
                            <h2 className="text-3xl font-bold text-gray-800">{totalDepositTransactions}</h2>
                        </div>
                        <div className="text-green-500 text-4xl">💵</div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-1 hover:shadow-2xl transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Tổng số loại tin</p>
                            <h2 className="text-3xl font-bold text-gray-800">{totalPostTypes}</h2>
                        </div>
                        <div className="text-purple-500 text-4xl">📊</div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Bảng hoạt động tổng quan</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-4 ">
                    <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow">
                        <h2 className="font-semibold text-lg mb-4">Thống kê Bài viết mới</h2>
                        <NewPostsChart />
                    </div>
                    <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow">
                        <h2 className="font-semibold text-lg mb-4">Thống kê Người dùng mới</h2>
                        <NewUsersChart />
                    </div>
                </div>
                <div className="mt-3 mb-3">
                    <hr />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow">
                        <h2 className="font-semibold text-lg mb-4">Thống kê giao dịch nạp tiền</h2>
                        <RevenueChart />
                    </div>
                    <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow">
                        <h2 className="font-semibold text-lg mb-4">Thống kê giao dịch thanh toán</h2>
                        <PaymentChart />
                    </div>
                </div>


            </div>
        </div>
    );
};
export default Dashboard;