import React from 'react'
import * as actions from '../../store/actions'
import { logout } from '../../store/actions/auth'
import { useDispatch } from 'react-redux'
import { AiOutlineLogout, AiOutlineCreditCard } from 'react-icons/ai'
import { useState } from "react";
import { FiHome, FiUsers, FiFolder, FiFileText, FiUserCheck, FiMenu, FiX } from "react-icons/fi";
import logo from '../../assets/logo.png'
import ManageUser from './ManageUser';
import ManageCategory from './ManageCategory';
import ManageRequest from './ManageRequest';
import ManagePost from './ManagePost';
import Dashboard from './Dashboard';
import ManageTransaction from './ManageTransaction';

const HomeAdmin = () => {
    const dispatch = useDispatch();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("Tổng quan");

    const sidebarItems = [
        { name: "Tổng quan", icon: <FiHome /> },
        { name: "Quản lý người dùng", icon: <FiUsers /> },
        { name: "Quản lý chuyên mục", icon: <FiFolder /> },
        { name: "Quản lý tin đăng", icon: <FiFileText /> },
        { name: "Quản lý yêu cầu", icon: <FiUserCheck /> },
        { name: "Quản lý giao dịch", icon: <AiOutlineCreditCard /> },
        { name: "Đăng xuất", icon: <AiOutlineLogout />, action: "logout" }
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
                        <ManageRequest />
                    )}
                    {activeTab === "Quản lý người dùng" && (
                        <ManageUser />
                    )}
                    {activeTab === "Quản lý chuyên mục" && (
                        <ManageCategory />
                    )}
                    {activeTab === "Quản lý tin đăng" && (
                        <ManagePost />
                    )}
                    {activeTab === "Tổng quan" && (
                        <Dashboard />
                    )}
                    {activeTab === "Quản lý giao dịch" && (
                        <ManageTransaction />
                    )}
                </div>
            </div>

        </div>
    )
}
export default HomeAdmin;




