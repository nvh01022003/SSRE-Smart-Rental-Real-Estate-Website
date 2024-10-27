import React from 'react'
import * as actions from '../../store/actions'
import { logout } from '../../store/actions/auth'
import { useDispatch } from 'react-redux'
import { AiOutlineLogout } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { useState } from "react";
import { FiHome, FiUsers, FiFolder, FiFileText, FiUserCheck, FiMenu, FiX } from "react-icons/fi";
import logo from '../../assets/logo.png'
import ManageUser from './ManageUser';
import ManageCategory from './ManageCategory';
import ManageRequest from './ManageRequest';

const HomeAdmin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("Tổng quan");

    const sidebarItems = [
        { name: "Tổng quan", icon: <FiHome /> },
        { name: "Quản lý người dùng", icon: <FiUsers /> },
        { name: "Quản lý chuyên mục", icon: <FiFolder /> },
        { name: "Quản lý tin đăng", icon: <FiFileText /> },
        { name: "Quản lý yêu cầu", icon: <FiUserCheck /> },
        { name: "Đăng xuất", icon: <AiOutlineLogout />, action: "logout" }
    ];

    const upgradeRequests = [
        {
            id: 1,
            fullName: "John Smith",
            birthday: "1990-05-15",
            address: "123 Main Street, New York, NY",
            image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
            citizenId: "ABC123456789"
        },
        {
            id: 2,
            fullName: "Emma Johnson",
            birthday: "1988-08-22",
            address: "456 Oak Avenue, Los Angeles, CA",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            citizenId: "XYZ987654321"
        }
    ];

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleSidebarItemClick = (item) => {
        if (item.action === "logout") {
            dispatch(actions.logout())
            handleLogout();
        } else {
            setActiveTab(item.name);
        }
    };

    return (
        <div >
            <div className="flex h-screen bg-gray-100">
                {/* Sidebar */}
                <div
                    className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300 ease-in-out`}
                >
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <img
                                sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                                src={logo}
                                alt="Logo"
                                className="w-[70px] h-[70px] object-contain "
                            />
                            {isSidebarOpen && (
                                // <h1 className="text-xl font-bold ml-2">Smart Rental Real Estate</h1>
                                <div className='text-xl font-semibold block pb-1'>
                                    Smart Rental Real Estate
                                </div>
                            )}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                            >
                                {isSidebarOpen ? <FiX /> : <FiMenu />}
                            </button>
                        </div>
                    </div>

                    <nav className="mt-4">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleSidebarItemClick(item)}
                                className={`w-full flex items-center p-4 hover:bg-gray-100 transition-colors duration-200 ${activeTab === item.name ? "bg-blue-50 text-blue-600" : ""}`}
                                aria-label={item.name}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {isSidebarOpen && <span className="ml-4">{item.name}</span>}
                            </button>
                        ))}
                    </nav>
                </div>


                {/* Main Content */}
                <div className="flex-1 overflow-auto p-8">
                    {activeTab === "Quản lý yêu cầu" && (
                        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        //     {upgradeRequests.map((request) => (
                        //         <div
                        //             key={request.id}
                        //             className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105"
                        //         >
                        //             <img
                        //                 src={request.image}
                        //                 alt={request.fullName}
                        //                 className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                        //             />
                        //             <h3 className="text-xl font-semibold mb-2 text-center">{request.fullName}</h3>
                        //             <div className="space-y-2">
                        //                 <p><span className="font-medium">Birthday:</span> {request.birthday}</p>
                        //                 <p><span className="font-medium">Address:</span> {request.address}</p>
                        //                 <p><span className="font-medium">Citizen ID:</span> {request.citizenId}</p>
                        //             </div>
                        //             <div className="mt-4 flex justify-center space-x-4">
                        //                 <button
                        //                     className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        //                     aria-label="Approve request"
                        //                 >
                        //                     Approve
                        //                 </button>
                        //                 <button
                        //                     className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        //                     aria-label="Reject request"
                        //                 >
                        //                     Reject
                        //                 </button>
                        //             </div>
                        //         </div>
                        //     ))}
                        // </div>
                        <ManageRequest />
                    )}
                    {activeTab === "Quản lý người dùng" && (
                        <ManageUser />
                    )}
                    {activeTab === "Quản lý chuyên mục" && (
                        <ManageCategory />
                    )}
                    {/* {activeTab !== "Quản lý yêu cầu" && activeTab !== "Đăng xuất" && activeTab === "Quản lý người dùng" && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
                            <p className="text-gray-600">Content for {activeTab} goes here.</p>
                        </div>
                    )} */}
                </div>
            </div>

        </div>
    )
}
export default HomeAdmin;




