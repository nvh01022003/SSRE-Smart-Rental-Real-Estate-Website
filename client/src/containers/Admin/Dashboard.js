import { useState, useEffect } from "react";
import { FiUsers, FiFolder, FiFileText, FiInbox, FiSearch, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Dashboard = () => {
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

    const UsersList = () => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Users</h2>
                <div className="relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="grid gap-4">
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

    const PostsOverview = () => (
        <div className="bg-white rounded-lg shadow p-6">
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
            <div className="max-w-7xl mx-auto">
                <div className="flex space-x-4 mb-6">
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