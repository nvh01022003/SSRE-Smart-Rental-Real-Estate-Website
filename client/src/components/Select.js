import React, { memo } from 'react'

const Select = ({ label, options, value, setValue, type, reset, name }) => {

    return (
        <div className='flex flex-col gap-2 flex-1'>
            <label className='font-medium align-center' htmlFor="select-address">{label} <span className='text-red-500'>*</span></label>
            <select
                value={reset ? '' : String(value || '')}  // Đảm bảo giá trị là một chuỗi
                onChange={(e) => {
                    const selectedValue = e.target.value; // Lấy giá trị đã chọn
                    setValue(selectedValue); // Cập nhật giá trị đã chọn
                }}
                id="select-address"
                className='outline-none border border-gray-300 p-2 rounded-md w-full'
            >
                <option value="">{`--Chọn ${label}--`}</option>
                {/* {options?.map((item, index) => {
                    return (
                        <option
                            key={type === 'city' ? item?.city_id : type === 'district' ? item?.district_id : type === 'ward' ? item?.ward_id : index}
                            value={type === 'city' ? item?.city_id : type === 'district' ? item?.district_id : type === 'ward' ? item?.ward_id : ''}
                        >
                            {type === 'city' ? item?.city_name : type === 'district' ? item?.district_name : type === 'ward' ? item?.ward_name : ''}
                        </option>
                    )
                })} */}
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
    )
}

export default memo(Select)
