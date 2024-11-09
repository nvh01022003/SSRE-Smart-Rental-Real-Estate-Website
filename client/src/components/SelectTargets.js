// import React, { memo } from 'react';

// const SelectTargets = ({ label, options, value, setValue, type, reset, name }) => {

//     return (
//         <div className='flex flex-col gap-2 flex-1'>
//             <label className='font-medium align-center' htmlFor="select-address">{label}</label>
//             <select
//                 value={reset ? '' : value || ''}  // Ensure value is not undefined/null
//                 onChange={(e) => !name ? setValue(e.target.value) : setValue(prev => ({ ...prev, [name]: e.target.value }))}
//                 id="select-address"
//                 className='outline-none border border-gray-300 p-2 rounded-md w-full'
//             >
//                 {/* <option value="all">Tất cả</option>  */}
//                 {options?.map((item, index) => {
//                     const optionValue =
//                         type === 'province' ? item?.province_id :
//                             type === 'district' ? item?.district_id :
//                                 type === 'ward' ? item?.ward_id :
//                                     item?.code || ''; // Fall back to a valid string for non-location types

//                     const optionLabel =
//                         type === 'province' ? item?.province_name :
//                             type === 'district' ? item?.district_name :
//                                 type === 'ward' ? item?.ward_name :
//                                     item?.value || ''; // Set the label

//                     return (
//                         <option
//                             key={optionValue || index} // Ensure key is unique
//                             value={optionValue} // Ensure value is a string or number
//                         >
//                             {optionLabel}
//                         </option>
//                     );
//                 })}
//             </select>
//         </div>
//     );
// }

// export default memo(SelectTargets);


import React from 'react';

const SelectTargets = ({ label, options, value, setValue, name }) => {
    return (
        <div className='flex flex-col gap-2 flex-1'>
            <label className='font-medium align-center' htmlFor="select-target">{label}</label>
            <select
                value={String(value || '')}  // Đảm bảo giá trị là một chuỗi
                onChange={(e) => {
                    const selectedValue = e.target.value; // Lấy giá trị đã chọn
                    setValue(selectedValue); // Cập nhật giá trị đã chọn
                }}
                id="select-target"
                className='outline-none border border-gray-300 p-2 rounded-md w-full'
            >
                <option value="">{`--Chọn ${label}--`}</option>
                {options?.map((item, index) => {
                    const optionValue = String(item.code || ''); // Đảm bảo optionValue là một chuỗi

                    return (
                        <option
                            key={optionValue || index} // Đảm bảo key là duy nhất
                            value={optionValue} // Đảm bảo value là một chuỗi
                        >
                            {item.value} {/* Hiển thị tên của tùy chọn */}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default SelectTargets;
