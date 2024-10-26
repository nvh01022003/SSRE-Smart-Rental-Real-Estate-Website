import React, { useEffect } from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import { Navigation } from './index'
import { Contact } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import Footer from './Footer'
import HomeAdmin from '../../containers/Admin/HomeAdmin'

import { Role } from '../../store/actions/auth';

const Home = () => {
    const { isLoggedIn, token, role } = useSelector(state => state.auth)
    console.log('role', role)

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                //const response = 
                await dispatch(Role(token));
                //console.log('Fetched User Role:', response);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
        if (isLoggedIn) {
            fetchUserRole();
        }
    }, [isLoggedIn, token, dispatch]);

    if (!isLoggedIn || !token) {
        return (<div className='w-full flex gap-6 flex-col items-center h-full'>
            <Header />
            <Navigation />
            {/* {isLoggedIn && <Search />} */}
            <div className='w-4/5 lg:w-4/5 flex flex-col items-start justify-start mt-3 container mx-auto'>
                <Outlet />
            </div>
            <Contact />
            <br />
            <hr className='w-4/5 h-[2px] bg-gray-300 container mx-auto' />
            <div className='w-3/5 container '>
                <Footer />
            </div>
        </div>)
    }

    return (
        <div>
            {role === 'admin' ? (
                <HomeAdmin />
            ) : (
                <div className='w-full flex gap-6 flex-col items-center h-full'>
                    <Header />
                    <Navigation />
                    {/* {isLoggedIn && <Search />} */}
                    <div className='w-full lg:w-4/5 flex flex-col items-start justify-start mt-3 container mx-auto'>
                        <Outlet />
                    </div>
                    <Contact />
                    <br />
                    <hr className='w-4/5 h-[2px] bg-gray-300 container mx-auto' />
                    <div className='w-3/5 container '>
                        <Footer />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home