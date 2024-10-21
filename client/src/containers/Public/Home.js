import React, { useEffect, useState } from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import { Navigation, Search } from './index'
import { Contact } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import Footer from './Footer'
import HomeAdmin from '../../containers/Admin/HomeAdmin'
import axios from 'axios';

const Home = () => {
    const { isLoggedIn, token } = useSelector(state => state.auth)
    const [role, setRole] = useState(null);
    //console.log('token:', token);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const res = await axios.post('http://localhost:5000/api/v1/auth/checkRole', {}, {
                    headers: {
                        'token': `${token}`,
                    }
                });
                setRole(res.data.msg);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        if (isLoggedIn) {
            fetchUserRole();
        }
    }, [isLoggedIn, token]);

    if (!isLoggedIn || !token) {
        return (<div className='w-full flex gap-6 flex-col items-center h-full'>
            <Header />
            <Navigation />
            {/* {isLoggedIn && <Search />} */}
            <div className='w-4/5 lg:w-4/5 flex flex-col items-start justify-start mt-3'>
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
                    <div className='w-4/5 lg:w-4/5 flex flex-col items-start justify-start mt-3'>
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