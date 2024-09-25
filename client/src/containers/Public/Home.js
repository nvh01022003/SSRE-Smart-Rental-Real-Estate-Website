import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import { Navigation, Search } from './index'
import { Contact } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import Footer from './Footer'


const Home = () => {
    const { isLoggedIn } = useSelector(state => state.auth)

    return (
        <div className='w-full flex gap-6 flex-col items-center h-full'>
            <Header />
            <Navigation />
            {/* {isLoggedIn && <Search />} */}
            <div className='w-4/5 lg:w-4/5 flex flex-col items-start justify-start mt-3'>
                <Outlet />
            </div>
            <Contact />
            <br />
            <hr className='w-4/5 h-[2px] bg-gray-300' />
            <div >
                <Footer />
            </div>
        </div>
    )
}

export default Home