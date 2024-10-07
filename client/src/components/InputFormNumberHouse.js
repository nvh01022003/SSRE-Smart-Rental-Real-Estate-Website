import React, { memo } from 'react'

const InputFormNumberHouse = ({ label, value, setValue, type }) => {
    return (
        <div>
            <label htmlFor={label} className='text-xs'>{label}</label>
            <input
                type={type || 'text'}
                id={label}
                className='outline-none bg-[#e8f0fe] p-2 rounded-md w-full'
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    )
}

export default memo(InputFormNumberHouse)

