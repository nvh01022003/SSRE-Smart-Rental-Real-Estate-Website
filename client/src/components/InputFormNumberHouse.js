// import React, { memo } from 'react'

// const InputFormNumberHouse = ({ label, value, setValue }) => {
//     return (
//         <div className="input-form-number-house">
//             <label htmlFor={label} className='block text-sm font-medium text-gray-700'>{label}</label>
//             <input
//                 type= "text"
//                 id={label}
//                 className='outline-none bg-[#e8f0fe] p-2 rounded-md w-full'
//                 value={value}
//                 onChange={(e) => setValue(e.target.value)}
//             />
//         </div>
//     )
// }

// export default memo(InputFormNumberHouse)

// import React from 'react';

const InputFormNumberHouse = ({ label, value, setValue }) => {
    return (
        <div className="input-form-number-house">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e)}
                className="mt-3 mb-2 p-2 bg-gray-100 w-full shadow-sm sm:text-sm border-gray-700 rounded-md  "
            />
        </div>
    );
};

export default InputFormNumberHouse;