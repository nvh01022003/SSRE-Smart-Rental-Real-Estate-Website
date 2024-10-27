// import React from 'react'
// import { ColorRing } from 'react-loader-spinner'

// const Loading = () => {
//     return (
//         <ColorRing
//             visible={true}
//             height="80"
//             width="80"
//             ariaLabel="blocks-loading"
//             wrapperStyle={{}}
//             wrapperClass="blocks-wrapper"
//             colors={['#ccc', '#ccc', '#ccc', '#ccc', '#ccc']}
//         />
//     )
// }

// export default Loading
import React from 'react';
import logo from '../assets/logo.png';

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <img src={logo} alt="Logo" className="w-12 h-12" />
                </div>
            </div>
        </div>
    );
};

export default Loading;