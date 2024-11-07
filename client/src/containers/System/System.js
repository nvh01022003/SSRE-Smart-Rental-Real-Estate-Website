import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { path } from '../../ultils/constant';
import { Sidebar } from './';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import * as actions from '../../store/actions';
import { useDispatch } from 'react-redux'

const System = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, token, role } = useSelector(state => state.auth);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                //const response = 
                await dispatch(actions.Role(token));
                //console.log('Fetched User Role:', response);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
        if (isLoggedIn) {
            fetchUserRole();
        }
    }, [isLoggedIn, token, dispatch]);

    if (!isLoggedIn) return <Navigate to={`/${path.LOGIN}`} replace={true} />;

    return (
        <div className="w-full h-screen flex overflow-hidden">
            <div className={`flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
                <div className="flex items-center justify-between p-4">
                    <Link to={'/'} className="flex items-center">
                        <img
                            src={logo}
                            alt="logo"
                            className="w-14 h-14 object-contain mt-4"
                        />
                        {isSidebarOpen && (
                            <span className="text-normal font-semibold ml-2">
                                Smart Rental Real Estate
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        {isSidebarOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
                <Sidebar isSidebarOpen={isSidebarOpen} role={role} />
            </div>
            <div className="flex-auto bg-white shadow-md h-auto p-4 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default System;