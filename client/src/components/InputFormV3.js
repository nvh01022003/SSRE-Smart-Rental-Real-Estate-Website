const InputFormV3 = ({ value, setValue, name, label, unit, small }) => {
    return (
        <div>
            <label htmlFor={name}>{label} <span className='text-red-500'>*</span></label>
            <div className='flex items-center'>
                <input
                    type='text'
                    id={name}
                    value={value}
                    onChange={(e) => setValue(e.target.value)} // Ensure this is correct
                    className='border border-gray-300 p-2 rounded-md flex-auto'
                />
                {unit && <span className='ml-2'>{unit}</span>}
            </div>
            {small && <small className='text-gray-500'>{small}</small>}
        </div>
    );
};
export default InputFormV3;