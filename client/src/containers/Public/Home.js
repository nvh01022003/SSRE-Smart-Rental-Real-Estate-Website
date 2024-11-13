import React, { useEffect, useState } from 'react'
import Header from './Header'
import { useNavigate } from 'react-router-dom'; // Add this import
import { Outlet } from 'react-router-dom'
import { Navigation } from './index'
import { Contact } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import Footer from './Footer'
import HomeAdmin from '../../containers/Admin/HomeAdmin'
import Loading from '../../components/Loading'
import { Role } from '../../store/actions/auth';

const Home = () => {
    const { isLoggedIn, token, role } = useSelector(state => state.auth)
    console.log('role', role)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchClicked, setSearchClicked] = useState(false);
    const [loading, setLoading] = useState(false); // Bật trạng thái loading khi bắt đầu fetch

    useEffect(() => {
        const fetchUserRole = async () => {
            setLoading(true); // Bật trạng thái loading khi bắt đầu fetch
            try {
                await dispatch(Role(token));
            } catch (error) {
                console.error('Error fetching user role:', error);
            } finally {
                setLoading(false); // Tắt loading sau khi fetch xong
            }
        };
        if (isLoggedIn && token && role == null) {
            fetchUserRole();
        }
    }, [isLoggedIn, token, dispatch, role]);
    useEffect(() => {
        if (isLoggedIn && role === 'admin') {
            navigate('/admin');
        }
    }, [isLoggedIn, role, navigate]);

    if (isLoggedIn && (role === null || loading)) {
        // Hiển thị spinner hoặc trang trắng khi đang loading
        return <div><Loading /></div>;
    }

    return (
        <div>
            {isLoggedIn && role === 'admin' ? (
                <HomeAdmin />
            ) : (
                <div className='w-full flex gap-6 flex-col items-center h-full'>
                    <Header />
                    <Navigation searchClicked={searchClicked} />
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