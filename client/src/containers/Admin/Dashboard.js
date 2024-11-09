import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX, FiUsers, FiFolder, FiFileText, FiInbox, FiSearch } from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
    const [activeTab, setActiveTab] = useState("users");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([
        { id: 1, name: "Technology", description: "Tech related posts" },
        { id: 2, name: "Business", description: "Business related posts" },
        { id: 3, name: "Lifestyle", description: "Lifestyle related posts" }
    ]);

    const users = [
        {
            id: 1,
            name: "John Doe",
            role: "Admin",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
        },
        {
            id: 2,
            name: "Jane Smith",
            role: "Editor",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
        },
        {
            id: 3,
            name: "Mike Johnson",
            role: "Author",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
        }
    ];

    const posts = [
        {
            id: 1,
            title: "Getting Started with React",
            author: "John Doe",
            category: "Technology",
            date: "2024-01-15",
            likes: 45,
            comments: 12
        },
        {
            id: 2,
            title: "Business Strategy 101",
            author: "Jane Smith",
            category: "Business",
            date: "2024-01-14",
            likes: 32,
            comments: 8
        }
    ];

    const requests = [
        {
            id: 1,
            type: "Access Request",
            user: "Mike Johnson",
            status: "pending",
            comments: ["Awaiting approval"]
        },
        {
            id: 2,
            type: "Content Review",
            user: "Jane Smith",
            status: "approved",
            comments: ["Approved by admin"]
        }
    ];

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(categories);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setCategories(items);
    };

    // const UsersList = () => (
    //     <div className="bg-white rounded-lg shadow p-6">
    //         <div className="flex items-center justify-between mb-6">
    //             <h2 className="text-xl font-semibold">Users</h2>
    //             <div className="relative">
    //                 <FiSearch className="absolute left-3 top-3 text-gray-400" />
    //                 <input
    //                     type="text"
    //                     placeholder="Search users..."
    //                     className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                     onChange={(e) => setSearchTerm(e.target.value)}
    //                 />
    //             </div>
    //         </div>
    //         <div className="grid gap-4">
    //             {users.map((user) => (
    //                 <div key={user.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
    //                     <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
    //                     <div className="ml-4">
    //                         <h3 className="font-medium">{user.name}</h3>
    //                         <p className="text-sm text-gray-500">{user.role}</p>
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //         <div className="mt-6 flex justify-center">
    //             <nav className="flex space-x-2">
    //                 <button className="px-3 py-1 border rounded hover:bg-gray-50">1</button>
    //                 <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
    //                 <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
    //             </nav>
    //         </div>
    //     </div>
    // );

    const UsersList = () => (
        <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Users</h2>
            <div className="relative w-full md:w-auto">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
                <div key={user.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div className="ml-4">
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-6 flex justify-center">
            <nav className="flex space-x-2">
                <button className="px-3 py-1 border rounded hover:bg-gray-50">1</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
            </nav>
        </div>
    </div>
    );


    // const CategoryManagement = () => (
    //     <DragDropContext onDragEnd={handleDragEnd}>
    //         <div className="bg-white rounded-lg shadow p-6">
    //             <div className="flex justify-between items-center mb-6">
    //                 <h2 className="text-xl font-semibold">Categories</h2>
    //                 <button
    //                     onClick={() => setIsModalOpen(true)}
    //                     className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
    //                 >
    //                     Add Category
    //                 </button>
    //             </div>
    //             <Droppable droppableId="categories">
    //                 {(provided) => (
    //                     <div {...provided.droppableProps} ref={provided.innerRef}>
    //                         {categories.map((category, index) => (
    //                             <Draggable key={category.id} draggableId={String(category.id)} index={index}>
    //                                 {(provided) => (
    //                                     <div
    //                                         ref={provided.innerRef}
    //                                         {...provided.draggableProps}
    //                                         {...provided.dragHandleProps}
    //                                         className="p-4 mb-3 border rounded-lg hover:bg-gray-50"
    //                                     >
    //                                         <div className="flex justify-between items-center">
    //                                             <div>
    //                                                 <h3 className="font-medium">{category.name}</h3>
    //                                                 <p className="text-sm text-gray-500">{category.description}</p>
    //                                             </div>
    //                                             <div className="flex space-x-2">
    //                                                 <button className="p-2 text-blue-500 hover:bg-blue-50 rounded">
    //                                                     <FiEdit2 />
    //                                                 </button>
    //                                                 <button className="p-2 text-red-500 hover:bg-red-50 rounded">
    //                                                     <FiTrash2 />
    //                                                 </button>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 )}
    //                             </Draggable>
    //                         ))}
    //                         {provided.placeholder}
    //                     </div>
    //                 )}
    //             </Droppable>
    //         </div>
    //     </DragDropContext>
    // );
    const CategoryManagement = () => (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Categories</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Add Category
                    </button>
                </div>
                <Droppable droppableId="categories">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {categories.map((category, index) => (
                                <Draggable key={category.id} draggableId={String(category.id)} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="p-4 mb-3 border rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-medium">{category.name}</h3>
                                                    <p className="text-sm text-gray-500">{category.description}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                                                        <FiEdit2 />
                                                    </button>
                                                    <button className="p-2 text-red-500 hover:bg-red-50 rounded">
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );


    // const PostsOverview = () => (
    //     <div className="bg-white rounded-lg shadow p-6 w-full">
    //         <h2 className="text-xl font-semibold mb-6">Posts</h2>
    //         <div className="overflow-x-auto">
    //             <table className="w-full">
    //                 <thead>
    //                     <tr className="border-b">
    //                         <th className="text-left p-4">Title</th>
    //                         <th className="text-left p-4">Author</th>
    //                         <th className="text-left p-4">Category</th>
    //                         <th className="text-left p-4">Date</th>
    //                         <th className="text-left p-4">Actions</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {posts.map((post) => (
    //                         <tr key={post.id} className="border-b hover:bg-gray-50">
    //                             <td className="p-4">{post.title}</td>
    //                             <td className="p-4">{post.author}</td>
    //                             <td className="p-4">{post.category}</td>
    //                             <td className="p-4">{post.date}</td>
    //                             <td className="p-4">
    //                                 <button className="text-blue-500 hover:text-blue-700">View Details</button>
    //                             </td>
    //                         </tr>
    //                     ))}
    //                 </tbody>
    //             </table>
    //         </div>
    //     </div>
    // );

    const PostsOverview = () => (
        <div className="bg-white rounded-lg shadow p-6 w-full">
            <h2 className="text-xl font-semibold mb-6">Posts</h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-4">Title</th>
                            <th className="text-left p-4">Author</th>
                            <th className="text-left p-4">Category</th>
                            <th className="text-left p-4">Date</th>
                            <th className="text-left p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{post.title}</td>
                                <td className="p-4">{post.author}</td>
                                <td className="p-4">{post.category}</td>
                                <td className="p-4">{post.date}</td>
                                <td className="p-4">
                                    <button className="text-blue-500 hover:text-blue-700">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    // const RequestManagement = () => (
    //     <div className="bg-white rounded-lg shadow p-6">
    //         <h2 className="text-xl font-semibold mb-6">Requests</h2>
    //         <div className="space-y-4">
    //             {requests.map((request) => (
    //                 <div key={request.id} className="border rounded-lg p-4">
    //                     <div className="flex justify-between items-center">
    //                         <div>
    //                             <h3 className="font-medium">{request.type}</h3>
    //                             <p className="text-sm text-gray-500">By {request.user}</p>
    //                         </div>
    //                         <div className="flex items-center space-x-2">
    //                             <span
    //                                 className={`px-3 py-1 rounded-full text-sm ${request.status === "approved" ? "bg-green-100 text-green-800" : request.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
    //                             >
    //                                 {request.status}
    //                             </span>
    //                             <button className="p-2 text-green-500 hover:bg-green-50 rounded">
    //                                 <FiCheck />
    //                             </button>
    //                             <button className="p-2 text-red-500 hover:bg-red-50 rounded">
    //                                 <FiX />
    //                             </button>
    //                         </div>
    //                     </div>
    //                     <div className="mt-4">
    //                         <h4 className="text-sm font-medium mb-2">Comments</h4>
    //                         {request.comments.map((comment, index) => (
    //                             <p key={index} className="text-sm text-gray-600">{comment}</p>
    //                         ))}
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // );
    const RequestManagement = () => (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Requests</h2>
            <div className="space-y-4">
                {requests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium">{request.type}</h3>
                                <p className="text-sm text-gray-500">By {request.user}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${request.status === "approved" ? "bg-green-100 text-green-800" : request.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                                >
                                    {request.status}
                                </span>
                                <button className="p-2 text-green-500 hover:bg-green-50 rounded">
                                    <FiCheck />
                                </button>
                                <button className="p-2 text-red-500 hover:bg-red-50 rounded">
                                    <FiX />
                                </button>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Comments</h4>
                            {request.comments.map((comment, index) => (
                                <p key={index} className="text-sm text-gray-600">{comment}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mb-5">
                    <Card
                        chartId="userChart"
                        title="User Statistics"
                        subtitle="Last Campaign Performance"
                        footerText="campaign sent 2 days ago"
                        onClick={() => setModalChart('userChartModal')}
                        className="w-full md:w-1/3"
                    />
                    <Card
                        chartId="revenueChart"
                        title="Revenue Statistics"
                        subtitle="15% increase in today sales"
                        footerText="updated 4 min ago"
                        onClick={() => setModalChart('revenueChartModal')}
                        className="w-full md:w-1/3"
                    />
                    <Card
                        chartId="combinedChart"
                        title="User and Revenue"
                        subtitle="Last Campaign Performance"
                        footerText="just updated"
                        onClick={() => setModalChart('combinedChartModal')}
                        className="w-full md:w-1/3"
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
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-white"}`}
                    >
                        <FiUsers />
                        <span>Users</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("categories")}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${activeTab === "categories" ? "bg-blue-500 text-white" : "bg-white"}`}
                    >
                        <FiFolder />
                        <span>Categories</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("posts")}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${activeTab === "posts" ? "bg-blue-500 text-white" : "bg-white"}`}
                    >
                        <FiFileText />
                        <span>Posts</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${activeTab === "requests" ? "bg-blue-500 text-white" : "bg-white"}`}
                    >
                        <FiInbox />
                        <span>Requests</span>
                    </button>
                </div>

                <div className="space-y-6">
                    {activeTab === "users" && <UsersList />}
                    {activeTab === "categories" && <CategoryManagement />}
                    {activeTab === "posts" && <PostsOverview />}
                    {activeTab === "requests" && <RequestManagement />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
