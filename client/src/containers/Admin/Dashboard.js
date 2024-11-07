import { useState, useEffect } from "react";
import Chart from 'chart.js/auto';


const Card = ({ chartId, title, subtitle, footerText, onClick }) => (
    <div className="bg-white rounded-lg shadow-md p-4 m-2 w-full cursor-pointer" onClick={onClick}>
        <canvas id={chartId} className="w-full h-40"></canvas>
        <div className="mt-4">
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
        </div>
        <div className="mt-4 border-t pt-2">
            <p className="text-gray-500 text-sm"><i className="fas fa-clock"></i> {footerText}</p>
        </div>
    </div>
);

const Modal = ({ chartId, title, onClose, children }) => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-md p-4 m-2 w-1/4 h-auto relative"> {/* Adjusted width to w-1/4 */}
            <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
                <i className="fas fa-times fa-2x"></i>
            </button>
            <h2 className="text-lg font-bold mb-4">{title}</h2>
            <div className="overflow-auto">
                {children}
                <canvas id={chartId} className="w-full h-40"></canvas>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [modalChart, setModalChart] = useState(null);
    const [userTimeframe, setUserTimeframe] = useState('week');
    const [revenueTimeframe, setRevenueTimeframe] = useState('week');
    const [combinedTimeframe, setCombinedTimeframe] = useState('month');
    const [userChart, setUserChart] = useState(null);
    const [revenueChart, setRevenueChart] = useState(null);
    const [combinedChart, setCombinedChart] = useState(null);
    const [modalUserChart, setModalUserChart] = useState(null);
    const [modalRevenueChart, setModalRevenueChart] = useState(null);
    const [modalCombinedChart, setModalCombinedChart] = useState(null);

    useEffect(() => {
        const userChartCtx = document.getElementById('userChart').getContext('2d');
        const newUserChart = new Chart(userChartCtx, {
            type: 'bar',
            data: {
                labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                datasets: [{
                    label: 'Users',
                    data: [12, 19, 3, 5, 2, 3, 7],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        setUserChart(newUserChart);

        const revenueChartCtx = document.getElementById('revenueChart').getContext('2d');
        const newRevenueChart = new Chart(revenueChartCtx, {
            type: 'line',
            data: {
                labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                datasets: [{
                    label: 'Revenue',
                    data: [0, 100, 200, 300, 400, 500, 400],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        setRevenueChart(newRevenueChart);

        const combinedChartCtx = document.getElementById('combinedChart').getContext('2d');
        const newCombinedChart = new Chart(combinedChartCtx, {
            type: 'line',
            data: {
                labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Users',
                        data: [0, 100, 200, 300, 400, 500, 400, 300, 500],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Revenue',
                        data: [0, 50, 150, 250, 350, 450, 350, 250, 450],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        setCombinedChart(newCombinedChart);
    }, []);

    useEffect(() => {
        if (modalChart) {
            const modalChartCtx = document.getElementById(modalChart).getContext('2d');
            const newModalChart = new Chart(modalChartCtx, {
                type: modalChart === 'userChartModal' ? 'bar' : 'line',
                data: {
                    labels: modalChart === 'userChartModal' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                    datasets: modalChart === 'combinedChartModal' ? [
                        {
                            label: 'Users',
                            data: [0, 100, 200, 300, 400, 500, 400, 300, 500],
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Revenue',
                            data: [0, 50, 150, 250, 350, 450, 350, 250, 450],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }
                    ] : [{
                        label: modalChart === 'userChartModal' ? 'Users' : 'Revenue',
                        data: modalChart === 'userChartModal' ? [12, 19, 3, 5, 2, 3, 7] : [0, 100, 200, 300, 400, 500, 400],
                        backgroundColor: modalChart === 'userChartModal' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(54, 162, 235, 0.2)',
                        borderColor: modalChart === 'userChartModal' ? 'rgba(75, 192, 192, 1)' : 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            if (modalChart === 'userChartModal') {
                setModalUserChart(newModalChart);
            } else if (modalChart === 'revenueChartModal') {
                setModalRevenueChart(newModalChart);
            } else {
                setModalCombinedChart(newModalChart);
            }
        }
    }, [modalChart]);

    const handleUserTimeframeChange = (timeframe) => {
        setUserTimeframe(timeframe);
        const data = {
            week: [12, 19, 3, 5, 2, 3, 7],
            month: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160],
            year: [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300]
        };
        const labels = {
            week: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        };
        if (userChart) {
            userChart.data.labels = labels[timeframe];
            userChart.data.datasets[0].data = data[timeframe];
            userChart.update();
        }
        if (modalUserChart) {
            modalUserChart.data.labels = labels[timeframe];
            modalUserChart.data.datasets[0].data = data[timeframe];
            modalUserChart.update();
        }
    };

    const handleRevenueTimeframeChange = (timeframe) => {
        setRevenueTimeframe(timeframe);
        const data = {
            week: [0, 100, 200, 300, 400, 500, 400],
            month: [100, 200, 300, 400],
            quarter: [300, 400, 500, 600],
            year: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200]
        };
        const labels = {
            week: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            quarter: ['Q1', 'Q2', 'Q3', 'Q4'],
            year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        };
        if (revenueChart) {
            revenueChart.data.labels = labels[timeframe];
            revenueChart.data.datasets[0].data = data[timeframe];
            revenueChart.update();
        }
        if (modalRevenueChart) {
            modalRevenueChart.data.labels = labels[timeframe];
            modalRevenueChart.data.datasets[0].data = data[timeframe];
            modalRevenueChart.update();
        }
    };

    const handleCombinedTimeframeChange = (timeframe) => {
        setCombinedTimeframe(timeframe);
        const data = {
            month: {
                users: [0, 100, 200, 300, 400, 500, 400, 300, 500],
                revenue: [0, 50, 150, 250, 350, 450, 350, 250, 450]
            },
            year: {
                users: [0, 100, 200, 300, 400, 500, 400, 300, 500, 600, 700, 800],
                revenue: [0, 50, 150, 250, 350, 450, 350, 250, 450, 550, 650, 750]
            }
        };
        const labels = {
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            year: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030']
        };
        if (combinedChart) {
            combinedChart.data.labels = labels[timeframe];
            combinedChart.data.datasets[0].data = data[timeframe].users;
            combinedChart.data.datasets[1].data = data[timeframe].revenue;
            combinedChart.update();
        }
        if (modalCombinedChart) {
            modalCombinedChart.data.labels = labels[timeframe];
            modalCombinedChart.data.datasets[0].data = data[timeframe].users;
            modalCombinedChart.data.datasets[1].data = data[timeframe].revenue;
            modalCombinedChart.update();
        }
    };


    return (
        <div className="w-full max-w-7xl mx-auto ">
            <div className="flex space-x-4 w-30% mb-5">
                <Card
                    chartId="userChart"
                    title="User Statistics"
                    subtitle="Last Campaign Performance"
                    footerText="campaign sent 2 days ago"
                    onClick={() => setModalChart('userChartModal')}
                    className="w-full md:w-96"
                />
                <Card
                    chartId="revenueChart"
                    title="Revenue Statistics"
                    subtitle="15% increase in today sales"
                    footerText="updated 4 min ago"
                    onClick={() => setModalChart('revenueChartModal')}
                    className="w-full md:w-96"
                />
                <Card
                    chartId="combinedChart"
                    title="User and Revenue"
                    subtitle="Last Campaign Performance"
                    footerText="just updated"
                    onClick={() => setModalChart('combinedChartModal')}
                    className="w-full md:w-96"
                />
                {modalChart && (
                    <Modal
                        chartId={modalChart}
                        title={modalChart === 'userChartModal' ? 'User Statistics' : modalChart === 'revenueChartModal' ? 'Revenue Statistics' : 'User and Revenue'}
                        onClose={() => setModalChart(null)}
                    >
                        {modalChart === 'userChartModal' && (
                            <div className="flex justify-center space-x-2 mb-2">
                                <button className={`px-2 py-1 rounded ${userTimeframe === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleUserTimeframeChange('week')}>Week</button>
                                <button className={`px-2 py-1 rounded ${userTimeframe === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleUserTimeframeChange('month')}>Month</button>
                                <button className={`px-2 py-1 rounded ${userTimeframe === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleUserTimeframeChange('year')}>Year</button>
                            </div>
                        )}
                        {modalChart === 'revenueChartModal' && (
                            <div className="flex justify-center space-x-2 mb-2">
                                <button className={`px-2 py-1 rounded ${revenueTimeframe === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleRevenueTimeframeChange('week')}>Week</button>
                                <button className={`px-2 py-1 rounded ${revenueTimeframe === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleRevenueTimeframeChange('month')}>Month</button>
                                <button className={`px-2 py-1 rounded ${revenueTimeframe === 'quarter' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleRevenueTimeframeChange('quarter')}>Quarter</button>
                                <button className={`px-2 py-1 rounded ${revenueTimeframe === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleRevenueTimeframeChange('year')}>Year</button>
                            </div>
                        )}
                        {modalChart === 'combinedChartModal' && (
                            <div className="flex justify-center space-x-2 mb-2">
                                <button className={`px-2 py-1 rounded ${combinedTimeframe === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleCombinedTimeframeChange('month')}>Month</button>
                                <button className={`px-2 py-1 rounded ${combinedTimeframe === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleCombinedTimeframeChange('year')}>Year</button>
                            </div>
                        )}
                    </Modal>
                )}
            </div>
        </div>

    );
};

export default Dashboard;




// import { useState, useEffect } from "react";
// import Chart from 'chart.js/auto';
// import { fetchPostsAdmin, fetchUsers, fetchCategories, fetchUpgradeRequests } from "../../store/actions/admin";
// import { useSelector, useDispatch } from "react-redux";
// import axios from "axios";

// const Card = ({ chartId, title, subtitle, footerText, onClick }) => (
//     <div className="bg-white rounded-lg shadow-md p-4 m-2 w-full cursor-pointer" onClick={onClick}>
//         <canvas id={chartId} className="w-full h-40"></canvas>
//         <div className="mt-4">
//             <h2 className="text-lg font-bold">{title}</h2>
//             <p className="text-gray-600">{subtitle}</p>
//         </div>
//         <div className="mt-4 border-t pt-2">
//             <p className="text-gray-500 text-sm"><i className="fas fa-clock"></i> {footerText}</p>
//         </div>
//     </div>
// );

// const Modal = ({ chartId, title, onClose, children }) => (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg shadow-md p-4 m-2 w-1/4 h-auto relative">
//             <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
//                 <i className="fas fa-times fa-2x"></i>
//             </button>
//             <h2 className="text-lg font-bold mb-4">{title}</h2>
//             <div className="overflow-auto">
//                 {children}
//                 <canvas id={chartId} className="w-full h-40"></canvas>
//             </div>
//         </div>
//     </div>
// );

// const Dashboard = () => {
//     const dispatch = useDispatch();
//     const { token } = useSelector(state => state.auth);
//     const [modalChart, setModalChart] = useState(null);
//     const [userTimeframe, setUserTimeframe] = useState('week');
//     const [revenueTimeframe, setRevenueTimeframe] = useState('week');
//     const [combinedTimeframe, setCombinedTimeframe] = useState('month');
//     const [userChart, setUserChart] = useState(null);
//     const [revenueChart, setRevenueChart] = useState(null);
//     const [combinedChart, setCombinedChart] = useState(null);
//     const [modalUserChart, setModalUserChart] = useState(null);
//     const [modalRevenueChart, setModalRevenueChart] = useState(null);
//     const [modalCombinedChart, setModalCombinedChart] = useState(null);
//     const [depositHistory, setDepositHistory] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const users = useSelector((state) => state.admin.users);
//     const categories = useSelector((state) => state.app.categories);
//     const { postsAdmin } = useSelector(state => state.post);
//     const { upgradeRequests } = useSelector(state => state.admin);

//     useEffect(() => {
//         const delayFetch = setTimeout(() => {
//             dispatch(fetchUsers(token));
//             dispatch(fetchCategories(token));
//             dispatch(fetchPostsAdmin(token, 1));
//             dispatch(fetchUpgradeRequests(token, 1));
//         }, 1);

//         return () => clearTimeout(delayFetch);
//     }, [dispatch, token]);

//     useEffect(() => {
//         const fetchDepositHistory = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/api/v1/admin/showAllDepositHistory', {
//                     headers: { 'token': token },
//                 });
//                 if (response.data.err === 0) {
//                     setDepositHistory(response.data.depositHistory);
//                 } else {
//                     console.error('Error fetching deposit history:', response.data.msg);
//                 }
//             } catch (error) {
//                 console.error('Error fetching deposit history:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchDepositHistory();
//     }, [token]);

//     useEffect(() => {
//         if (!isLoading) {
//             // Destroy any existing charts before creating new ones
//             if (userChart) userChart.destroy();
//             if (revenueChart) revenueChart.destroy();
//             if (combinedChart) combinedChart.destroy();

//             // Create user chart
//             const userChartCtx = document.getElementById('userChart').getContext('2d');
//             const newUserChart = new Chart(userChartCtx, {
//                 type: 'bar',
//                 data: {
//                     labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
//                     datasets: [{
//                         label: 'Users',
//                         data: users.map(user => user.id), // Example data mapping
//                         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                         borderColor: 'rgba(75, 192, 192, 1)',
//                         borderWidth: 1
//                     }]
//                 },
//                 options: {
//                     scales: {
//                         y: { beginAtZero: true }
//                     }
//                 }
//             });
//             setUserChart(newUserChart);

//             // Create revenue chart
//             const revenueChartCtx = document.getElementById('revenueChart').getContext('2d');
//             const newRevenueChart = new Chart(revenueChartCtx, {
//                 type: 'line',
//                 data: {
//                     labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
//                     datasets: [{
//                         label: 'Revenue',
//                         data: depositHistory.map(transaction => transaction.amount), // Example data mapping
//                         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                         borderColor: 'rgba(54, 162, 235, 1)',
//                         borderWidth: 1
//                     }]
//                 },
//                 options: {
//                     scales: {
//                         y: { beginAtZero: true }
//                     }
//                 }
//             });
//             setRevenueChart(newRevenueChart);

//             // Create combined chart
//             const combinedChartCtx = document.getElementById('combinedChart').getContext('2d');
//             const newCombinedChart = new Chart(combinedChartCtx, {
//                 type: 'line',
//                 data: {
//                     labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//                     datasets: [
//                         {
//                             label: 'Users',
//                             data: users.map(user => user.id),
//                             backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                             borderColor: 'rgba(75, 192, 192, 1)',
//                             borderWidth: 1
//                         },
//                         {
//                             label: 'Revenue',
//                             data: depositHistory.map(transaction => transaction.amount),
//                             backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                             borderColor: 'rgba(54, 162, 235, 1)',
//                             borderWidth: 1
//                         }
//                     ]
//                 },
//                 options: {
//                     scales: {
//                         y: { beginAtZero: true }
//                     }
//                 }
//             });
//             setCombinedChart(newCombinedChart);
//         }
//     }, [users, categories, postsAdmin, upgradeRequests, depositHistory, isLoading]);

//     useEffect(() => {
//         if (modalChart) {
//             // Destroy any existing modal charts before creating new ones
//             if (modalUserChart) modalUserChart.destroy();
//             if (modalRevenueChart) modalRevenueChart.destroy();
//             if (modalCombinedChart) modalCombinedChart.destroy();

//             const modalChartCtx = document.getElementById(modalChart).getContext('2d');
//             const newModalChart = new Chart(modalChartCtx, {
//                 type: modalChart === 'userChartModal' ? 'bar' : 'line',
//                 data: {
//                     labels: modalChart === 'userChartModal' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
//                     datasets: modalChart === 'combinedChartModal' ? [
//                         {
//                             label: 'Users',
//                             data: users.map(user => user.id),
//                             backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                             borderColor: 'rgba(75, 192, 192, 1)',
//                             borderWidth: 1
//                         },
//                         {
//                             label: 'Revenue',
//                             data: depositHistory.map(transaction => transaction.amount),
//                             backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                             borderColor: 'rgba(54, 162, 235, 1)',
//                             borderWidth: 1
//                         }
//                     ] : [{
//                         label: modalChart === 'userChartModal' ? 'Users' : 'Revenue',
//                         data: modalChart === 'userChartModal' ? users.map(user => user.id) : depositHistory.map(transaction => transaction.amount),
//                         backgroundColor: modalChart === 'userChartModal' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(54, 162, 235, 0.2)',
//                         borderColor: modalChart === 'userChartModal' ? 'rgba(75, 192, 192, 1)' : 'rgba(54, 162, 235, 1)',
//                         borderWidth: 1
//                     }]
//                 },
//                 options: {
//                     scales: { y: { beginAtZero: true } }
//                 }
//             });

//             if (modalChart === 'userChartModal') {
//                 setModalUserChart(newModalChart);
//             } else if (modalChart === 'revenueChartModal') {
//                 setModalRevenueChart(newModalChart);
//             } else if (modalChart === 'combinedChartModal') {
//                 setModalCombinedChart(newModalChart);
//             }
//         }
//     }, [modalChart, users, depositHistory]);

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Card chartId="userChart" title="Total Users" subtitle="New Users" footerText="Last Week" onClick={() => setModalChart('userChartModal')} />
//             <Card chartId="revenueChart" title="Total Revenue" subtitle="Revenue This Week" footerText="Last Week" onClick={() => setModalChart('revenueChartModal')} />
//             <Card chartId="combinedChart" title="Combined Chart" subtitle="Users & Revenue" footerText="Last Month" onClick={() => setModalChart('combinedChartModal')} />
//         </div>
//     );
// };

// export default Dashboard;