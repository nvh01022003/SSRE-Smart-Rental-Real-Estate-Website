import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { SelectCategory, InputReadOnly, InputFormV2, SelectTargets } from './';
import InputFormV3 from './InputFormV3.js';
import { useSelector, useDispatch } from 'react-redux';
import { getPersonalInfo } from '../services/userService';
import { getCategories } from '../store/actions/app.js';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const targets = [
    { code: '0', value: 'Tất cả' },
    { code: '1', value: 'Nam' },
    { code: '2', value: 'Nữ' },
];

const Overview = forwardRef(({ payload, setPayload, handleInputChange }, ref) => {
    const dispatch = useDispatch();

    const { categories } = useSelector(state => state.app);
    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);
    //console.log(categories);

    const { token } = useSelector(state => state.auth);

    const [personalInfo, setPersonalInfo] = useState(null);

    const [errorMessages, setErrorMessages] = useState({
        title: '',
        description: '',
        price: '',
        acreage: '',
        target: '',
        category_id: '',
        expire: '',
    });

    const [selectedDate, setSelectedDate] = useState(null);

    // Hàm xử lý khi người dùng chọn ngày hết hạn
    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = date ? date.toISOString() : '';
        setPayload((prev) => ({ ...prev, expire: formattedDate }));
        handleInputChange('expire', formattedDate);

        // Validate ngày hết hạn
        setErrorMessages((prev) => ({
            ...prev,
            expire: date ? '' : 'Chưa chọn ngày hết hạn bài đăng',
        }));
    };

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

    // Hàm định dạng số thành dạng có dấu phẩy
    const formatNumberWithCommas = (value) => {
        return new Intl.NumberFormat().format(value);
    };

    // Xử lý sự kiện khi nhập giá cho thuê
    const handlePriceInput = (value) => {
        // Loại bỏ mọi ký tự không phải số
        const numericValue = value.replace(/\D/g, '');
        setPayload(prev => ({ ...prev, price: numericValue }));

        handleInputChange('price', numericValue);

        // Thêm dấu phẩy sau mỗi 3 chữ số
        return formatNumberWithCommas(numericValue);
    };

    // Chỉ cho phép nhập số cho diện tích
    const handleAreaInput = (value) => {
        // Loại bỏ các ký tự không phải số
        const numericValue = value.replace(/\D/g, '');
        setPayload(prev => ({ ...prev, acreage: numericValue }));

        handleInputChange('acreage', numericValue);

        // Thêm dấu phẩy sau mỗi 3 chữ số
        return formatNumberWithCommas(numericValue);
    };

    // Real-time validation logic
    const handleInputChangeWithValidation = (name, value) => {
        handleInputChange(name, value);
        setPayload(prev => ({ ...prev, [name]: value }));

        // Cập nhật payload cho category_id
        if (name === 'category_id') {
            setPayload(prev => ({
                ...prev,
                category_id: value // Cập nhật category_id bằng giá trị đã chọn
            }));
        }

        // Cập nhật payload cho target
        if (name === 'target') {
            setPayload(prev => ({
                ...prev,
                target: value // Cập nhật target bằng giá trị đã chọn
            }));
        }

        // Validation logic
        switch (name) {
            case 'category_id':
                setErrorMessages(prev => ({
                    ...prev,
                    category_id: value ? '' : 'Chưa chọn loại chuyên mục'
                }));
                break;
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
            case 'acreage':
                setErrorMessages(prev => ({
                    ...prev,
                    acreage: value > 0 ? '' : 'Diện tích không được để trống và phải lớn hơn 0'
                }));
                break;
            case 'target':
                setErrorMessages(prev => ({
                    ...prev,
                    target: value ? '' : 'Chưa chọn đối tượng cho thuê'
                }));
                break;
            case 'expire':
                setErrorMessages(prev => ({
                    ...prev,
                    expire: value ? '' : 'Chưa chọn ngày hết hạn bài đăng'
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
            category_id: payload.category_id ? '' : 'Chưa chọn loại chuyên mục',
            title: payload.title.length >= 20 ? '' : 'Tiêu đề yêu cầu ít nhất 20 ký tự',
            description: payload.description.length >= 100 ? '' : 'Mô tả yêu cầu ít nhất 100 ký tự',
            price: payload.price > 0 ? '' : 'Giá cho thuê không được để trống và phải lớn hơn 0',
            acreage: payload.acreage > 0 ? '' : 'Diện tích không được để trống và phải lớn hơn 0',
            target: payload.target ? '' : 'Chưa chọn đối tượng cho thuê',
            expire: payload.expire ? '' : 'Chưa chọn ngày hết hạn bài đăng',
        }));

        return (
            payload.category_id &&
            payload.title.length >= 20 &&
            payload.description.length >= 100 &&
            payload.price > 0 &&
            payload.acreage > 0 &&
            payload.target &&
            payload.expire
        );
    };

    // Expose validateFields function to parent component
    useImperativeHandle(ref, () => ({
        validateFields
    }));

    //console.log(payload);

    return (
        <div>
            <h2 className='font-semibold text-xl py-4'>Thông tin mô tả</h2>
            <div className='w-full flex flex-col gap-4'>
                <div className='w-1/2 relative'>
                    <SelectCategory
                        value={String(payload.category_id || '')} // Đảm bảo đây là chuỗi
                        setValue={(value) => handleInputChangeWithValidation('category_id', value)} // Gọi hàm cập nhật
                        name='category_id'
                        options={categories.map(category => ({
                            code: category.id, // ID của chuyên mục
                            value: category.category_name // Tên hiển thị của chuyên mục
                        }))}
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
                    {/* Giá cho thuê */}
                    <div className='relative'>
                        <InputFormV2
                            value={formatNumberWithCommas(payload.price)}
                            setValue={(value) => handlePriceInput(value)} // Gọi hàm xử lý giá
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

                    {/* Diện tích */}
                    <div className='relative mt-5'>
                        <InputFormV2
                            value={formatNumberWithCommas(payload.acreage)}
                            setValue={(value) => handleAreaInput(value)} // Gọi hàm xử lý diện tích
                            name='acreage'
                            label='Diện tích'
                            unit='m²'
                        />
                        {errorMessages.acreage && (
                            <p className='text-red-500 absolute -bottom-6 text-sm'>
                                {errorMessages.acreage}
                            </p>
                        )}
                    </div>
                    <div className='relative mt-5'>
                        {/* <Select
                            value={payload.target}
                            setValue={(value) => handleInputChangeWithValidation('target', value)}
                            name='target'
                            options={targets}
                            label='Đối tượng cho thuê'
                        /> */}

                        <SelectTargets
                            value={String(payload.target || '')} // Đảm bảo đây là chuỗi
                            setValue={(value) => handleInputChangeWithValidation('target', value)} // Gọi hàm cập nhật
                            name='target'
                            options={targets.map(target => ({
                                code: target.code,
                                value: target.value
                            }))}
                            label='Đối tượng cho thuê'
                        />

                        {errorMessages.target && (
                            <p className='text-red-500 absolute -bottom-6 text-sm'>
                                {errorMessages.target}
                            </p>
                        )}
                    </div>

                    <div className='relative mt-5'>
                        <div className='flex-col'>
                            <label htmlFor="expire" className='font-medium align-center block mb-2' >Ngày hết hạn bài đăng</label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="Pp"
                                className='w-[87%] rounded-md outline-none border border-gray-300 p-2 cursor-pointer'
                                placeholderText="Chọn ngày và giờ"
                            />
                        </div>
                        {errorMessages.expire && (
                            <p className='text-red-500 absolute -bottom-6 text-sm'>
                                {errorMessages.expire}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Overview;