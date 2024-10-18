// //Trang đăng tin cho thuê bắt đầu từ thông tin mô tả tới đối tượng cho thuê

// import React, { useContext, useState, useEffect } from 'react'
// import { Select, InputReadOnly, InputFormV2 } from './'
// import InputFormV3 from './InputFormV3.js'
// import { useSelector } from 'react-redux'
// import { AuthContext } from '../Context/AuthContext'
// import { getPersonalInfo } from '../services/userService'

// const targets = [
//     { code: 'Nam', value: 'Nam' },
//     { code: 'Nữ', value: 'Nữ' },
// ]


// const Overview = ({ payload, setPayload, handleInputChange, errorMessages }) => {
//     const { categories } = useSelector(state => state.app)

//     const { token } = useContext(AuthContext);

//     const [personalInfo, setPersonalInfo] = useState(null);

//     useEffect(() => {
//         const fetchPersonalInfo = async () => {
//             try {
//                 const data = await getPersonalInfo(token);
//                 setPersonalInfo(data.info_user);
//             } catch (error) {
//                 console.error('Error fetching personal information:', error);
//             }
//         };

//         fetchPersonalInfo();
//     }, [token]);

//     const fullName = personalInfo ? `${personalInfo.firstName} ${personalInfo.lastName}`.trim() : '';

//     return (
//         <div>
//             <h2 className='font-semibold text-xl py-4'>Thông tin mô tả</h2>
//             <div className='w-full flex flex-col gap-4'>
//                 <div className='w-1/2 relative'> {/* Add relative positioning */}
//                     <Select
//                         value={payload.category_id}
//                         setValue={(value) => handleInputChange('category_id', value)}
//                         name='category_id'
//                         options={categories}
//                         label='Loại chuyên mục'
//                     />
//                     {errorMessages.category_id && (
//                         <p className='text-red-500 absolute -bottom-6 text-sm'>
//                             {errorMessages.category_id}
//                         </p>
//                     )}
//                 </div>
//                 <div className='relative mt-5'> {/* Add relative positioning */}
//                     <InputFormV3
//                         value={payload.title}
//                         name='title'
//                         setValue={(value) => handleInputChange('title', value)}
//                         label='Tiêu đề'
//                     />
//                     {errorMessages.title && (
//                         <p className='text-red-500 absolute -bottom-6 text-sm'>
//                             {errorMessages.title}
//                         </p>
//                     )}
//                 </div>
//                 <div className='relative flex flex-col gap-2  mt-5'>
//                     <label htmlFor="desc">Nội dung mô tả</label>
//                     <textarea
//                         id="desc"
//                         cols="30" rows="10"
//                         className='w-full rounded-md outline-none border border-gray-300 p-2'
//                         value={payload.description}
//                         name='description'
//                         onChange={(e) => handleInputChange('description', e.target.value)}
//                     ></textarea>
//                     {errorMessages.description && (
//                         <p className='text-red-500 absolute -bottom-6 text-sm'>
//                             {errorMessages.description}
//                         </p>
//                     )}
//                 </div>
//                 <div className='w-1/2 flex flex-col gap-4  mt-5'>
//                     <InputReadOnly label='Thông tin liên hệ' value={fullName} />
//                     <InputReadOnly label='Điện thoại' value={personalInfo?.phone} />
//                     <div className='relative'>
//                         <InputFormV2
//                             value={payload.price}
//                             setValue={(value) => handleInputChange('price', value)}
//                             name='price'
//                             small='Nhập đầy đủ số, ví dụ 1 triệu thì nhập là 1000000'
//                             label='Giá cho thuê'
//                             unit='đồng'
//                         />
//                         {errorMessages.price && (
//                             <p className='text-red-500 absolute -bottom-6 text-sm'>
//                                 {errorMessages.price}
//                             </p>
//                         )}
//                     </div>
//                     <div className='relative  mt-5'>
//                         <InputFormV2
//                             value={payload.areaNumber}
//                             setValue={(value) => handleInputChange('areaNumber', value)}
//                             name='areaNumber'
//                             label='Diện tích'
//                             unit='m2'
//                         />
//                         {errorMessages.areaNumber && (
//                             <p className='text-red-500 absolute -bottom-6 text-sm'>
//                                 {errorMessages.areaNumber}
//                             </p>
//                         )}
//                     </div>
//                     <div className='relative mt-5'>
//                         <Select
//                             value={payload.target}
//                             setValue={(value) => handleInputChange('target', value)}
//                             name='target'
//                             options={targets}
//                             label='Đối tượng cho thuê'
//                         />
//                         {errorMessages.target && (
//                             <p className='text-red-500 absolute -bottom-6 text-sm'>
//                                 {errorMessages.target}
//                             </p>
//                         )}
//                     </div>
//                 </div>
//             </div>


//         </div>
//     )
// }

// export default Overview


import React, { useContext, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Select, InputReadOnly, InputFormV2 } from './';
import InputFormV3 from './InputFormV3.js';
import { useSelector } from 'react-redux';
import { AuthContext } from '../Context/AuthContext';
import { getPersonalInfo } from '../services/userService';

const targets = [
    { code: 'Nam', value: 'Nam' },
    { code: 'Nữ', value: 'Nữ' },
];

const Overview = forwardRef(({ payload, setPayload, handleInputChange }, ref) => {
    const { categories } = useSelector(state => state.app);
    const { token } = useContext(AuthContext);
    const [personalInfo, setPersonalInfo] = useState(null);

    const [errorMessages, setErrorMessages] = useState({
        title: '',
        description: '',
        price: '',
        areaNumber: '',
        target: '',
    });

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const data = await getPersonalInfo(token);
                setPersonalInfo(data.info_user);
            } catch (error) {
                console.error('Error fetching personal information:', error);
            }
        };

        fetchPersonalInfo();
    }, [token]);

    const fullName = personalInfo ? `${personalInfo.firstName} ${personalInfo.lastName}`.trim() : '';

    // Real-time validation logic
    const handleInputChangeWithValidation = (name, value) => {
        handleInputChange(name, value);
        setPayload(prev => ({ ...prev, [name]: value }));

        // Validation logic
        switch (name) {
            case 'title':
                setErrorMessages(prev => ({
                    ...prev,
                    title: value.length >= 20 ? '' : 'Tiêu đề yêu cầu ít nhất 20 ký tự'
                }));
                break;
            case 'description':
                setErrorMessages(prev => ({
                    ...prev,
                    description: value.length >= 100 ? '' : 'Mô tả yêu cầu ít nhất 100 ký tự'
                }));
                break;
            case 'price':
                setErrorMessages(prev => ({
                    ...prev,
                    price: value > 0 ? '' : 'Giá cho thuê không được để trống và phải lớn hơn 0'
                }));
                break;
            case 'areaNumber':
                setErrorMessages(prev => ({
                    ...prev,
                    areaNumber: value > 0 ? '' : 'Diện tích không được để trống và phải lớn hơn 0'
                }));
                break;
            case 'target':
                setErrorMessages(prev => ({
                    ...prev,
                    target: value ? '' : 'Chưa chọn chuyên mục'
                }));
                break;
            default:
                break;
        }
    };

    // Hàm kiểm tra và cập nhật lỗi
    const validateFields = () => {
        setErrorMessages(prev => ({
            ...prev,
            title: payload.title.length >= 20 ? '' : 'Tiêu đề yêu cầu ít nhất 20 ký tự',
            description: payload.description.length >= 100 ? '' : 'Mô tả yêu cầu ít nhất 100 ký tự',
            price: payload.price > 0 ? '' : 'Giá cho thuê không được để trống và phải lớn hơn 0',
            areaNumber: payload.areaNumber > 0 ? '' : 'Diện tích không được để trống và phải lớn hơn 0',
            target: payload.target ? '' : 'Chưa chọn chuyên mục',
        }));

        return (
            payload.title.length >= 20 &&
            payload.description.length >= 100 &&
            payload.price > 0 &&
            payload.areaNumber > 0 &&
            payload.target
        );
    };

    // Expose validateFields function to parent component
    useImperativeHandle(ref, () => ({
        validateFields
    }));

    return (
        <div>
            <h2 className='font-semibold text-xl py-4'>Thông tin mô tả</h2>
            <div className='w-full flex flex-col gap-4'>
                <div className='w-1/2 relative'>
                    <Select
                        value={payload.category_id}
                        setValue={(value) => handleInputChangeWithValidation('category_id', value)}
                        name='category_id'
                        options={categories}
                        label='Loại chuyên mục'
                    />
                    {errorMessages.category_id && (
                        <p className='text-red-500 absolute -bottom-6 text-sm'>
                            {errorMessages.category_id}
                        </p>
                    )}
                </div>
                <div className='relative mt-5'>
                    <InputFormV3
                        value={payload.title}
                        name='title'
                        setValue={(value) => handleInputChangeWithValidation('title', value)}
                        label='Tiêu đề'
                    />
                    {errorMessages.title && (
                        <p className='text-red-500 absolute -bottom-6 text-sm'>
                            {errorMessages.title}
                        </p>
                    )}
                </div>
                <div className='relative flex flex-col gap-2 mt-5'>
                    <label htmlFor="desc">Nội dung mô tả</label>
                    <textarea
                        id="desc"
                        cols="30" rows="10"
                        className='w-full rounded-md outline-none border border-gray-300 p-2'
                        value={payload.description}
                        name='description'
                        onChange={(e) => handleInputChangeWithValidation('description', e.target.value)}
                    ></textarea>
                    {errorMessages.description && (
                        <p className='text-red-500 absolute -bottom-6 text-sm'>
                            {errorMessages.description}
                        </p>
                    )}
                </div>
                <div className='w-1/2 flex flex-col gap-4 mt-5'>
                    <InputReadOnly label='Thông tin liên hệ' value={fullName} />
                    <InputReadOnly label='Điện thoại' value={personalInfo?.phone} />
                    <div className='relative'>
                        <InputFormV2
                            value={payload.price}
                            setValue={(value) => handleInputChangeWithValidation('price', value)}
                            name='price'
                            small='Nhập đầy đủ số, ví dụ 1 triệu thì nhập là 1000000'
                            label='Giá cho thuê'
                            unit='đồng'
                        />
                        {errorMessages.price && (
                            <p className='text-red-500 absolute -bottom-6 text-sm'>
                                {errorMessages.price}
                            </p>
                        )}
                    </div>
                    <div className='relative mt-5'>
                        <InputFormV2
                            value={payload.areaNumber}
                            setValue={(value) => handleInputChangeWithValidation('areaNumber', value)}
                            name='areaNumber'
                            label='Diện tích'
                            unit='m2'
                        />
                        {errorMessages.areaNumber && (
                            <p className='text-red-500 absolute -bottom-6 text-sm'>
                                {errorMessages.areaNumber}
                            </p>
                        )}
                    </div>
                    <div className='relative mt-5'>
                        <Select
                            value={payload.target}
                            setValue={(value) => handleInputChangeWithValidation('target', value)}
                            name='target'
                            options={targets}
                            label='Đối tượng cho thuê'
                        />
                        {errorMessages.target && (
                            <p className='text-red-500 absolute -bottom-6 text-sm'>
                                {errorMessages.target}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Overview;