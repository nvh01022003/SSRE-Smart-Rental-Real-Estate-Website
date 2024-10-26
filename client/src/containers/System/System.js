// import React from 'react'
// import { useSelector } from 'react-redux'
// import { Navigate, Outlet } from 'react-router-dom'
// import { path } from '../../ultils/constant'
// import { Sidebar } from './'

// const System = () => {
//     const { isLoggedIn } = useSelector(state => state.auth)

//     if (!isLoggedIn) return <Navigate to={`/${path.LOGIN}`} replace={true} />
//     return (
//         <div className='w-full h-screen flex flex-col items-center container mx-auto'>
//             {/* <Header /> */}
//             <div className='flex w-full flex-auto'>
//                 <Sidebar />
//                 <div className='flex-auto bg-white shadow-md h-auto p-4'>
//                     <Outlet />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default System
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { path } from '../../ultils/constant';
import { Sidebar } from './';

const System = () => {
    const { isLoggedIn } = useSelector(state => state.auth);

    if (!isLoggedIn) return <Navigate to={`/${path.LOGIN}`} replace={true} />;
    return (
        <div className='w-full h-screen flex flex-col items-center container mx-auto'>
            {/* <Header /> */}
            <div className='flex w-full flex-auto flex-col md:flex-row'>
                <Sidebar className='w-full md:w-1/4' />
                <div className='flex-auto bg-white shadow-md h-auto p-4 w-full md:w-3/4'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default System;