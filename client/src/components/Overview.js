import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { SelectCategory, InputReadOnly, InputFormV2, SelectTargets } from './index.js';
import InputFormV3 from './InputFormV3.js';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories } from '../store/actions/app.js';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import axios from 'axios';
import PriceModal from './PriceModal.js';

const targets = [
    { code: '0', value: 'Tất cả' },
    { code: '1', value: 'Nam' },
    { code: '2', value: 'Nữ' },
];

const Overview = forwardRef(({ payload, setPayload, handleInputChange }, ref) => {
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);
    const [balance, setBalance] = useState(null);
    const [typePosts, setTypePosts] = useState([]);
    // Thêm state cho modal
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

    // Thêm state cho tổng số tiền
    const [totalPayment, setTotalPayment] = useState(0);

    // Tính Toán Tổng Số Tiền Cần Thanh Toán
    useEffect(() => {
        if (payload.postType_id && payload.expire) {
            const selectedType = typePosts.find(type => type.id === parseInt(payload.postType_id));
            if (selectedType) {
                const pricePerDay = selectedType.price;
                const today = new Date();
                const expireDate = new Date(payload.expire);
                const timeDiff = expireDate - today;
                const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
                if (days > 0) {
                    const total = pricePerDay * days;
                    setTotalPayment(total);
                    setPayload(prev => ({ ...prev, totalPayment: total }));
                } else {
                    setTotalPayment(0);
                }
            }
        } else {
            setTotalPayment(0);
        }
    }, [payload.postType_id, payload.expire, typePosts]);



    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/user/showBalance', {
                    headers: {
                        'token': `${token}`,
                    }
                });
                //console.log(res)
                if (res.data.err === 0) {
                    setBalance(res.data.balance)
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
        const fetchTypePost = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/admin/showAllTypePost', {
                    headers: {
                        'token': `${token}`,
                    }
                });
                if (res.data.err === 0) {
                    setTypePosts(res.data.postType)
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        }
        fetchBalance();
        fetchTypePost();
    }, [token]);

    const { categories } = useSelector(state => state.app);
    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    const { user } = useSelector((state) => state.user);

    const [errorMessages, setErrorMessages] = useState({
        postType_id: '',
        title: '',
        description: '',
        price: '',
        acreage: '',
        target: '',
        category_id: '',
        expire: '',
    });

    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (e) => {
        const dateString = e.target.value;
        const date = new Date(dateString);

        setSelectedDate(dateString);

        // Định dạng ngày thành yyyy-MM-dd
        const formattedDate = date ? date.toISOString().split("T")[0] : '';

        setPayload((prev) => ({ ...prev, expire: formattedDate }));
        handleInputChange('expire', formattedDate);

        // Validate ngày hết hạn
        setErrorMessages((prev) => ({
            ...prev,
            expire: date ? '' : 'Chưa chọn ngày hết hạn bài đăng',
        }));
    };


    const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : '';

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

        // Cập nhật payload cho postType_id
        if (name === 'postType_id') {
            setPayload(prev => ({
                ...prev,
                postType_id: value // Cập nhật target bằng giá trị đã chọn
            }));
        }

        // Validation logic
        switch (name) {
            case 'postType_id':
                setErrorMessages(prev => ({
                    ...prev,
                    postType_id: value ? '' : 'Chưa chọn loại tin đăng'
                }));
                break;
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

    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (`0${today.getMonth() + 1}`).slice(-2); // Months are zero-indexed
        const day = (`0${today.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
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
            postType_id: payload.postType_id ? '' : 'Chưa chọn loại tin đăng',
        }));

        return (
            payload.category_id &&
            payload.title.length >= 20 &&
            payload.description.length >= 100 &&
            payload.price > 0 &&
            payload.acreage > 0 &&
            payload.target &&
            payload.expire &&
            payload.postType_id
        );
    };

    // Expose validateFields function to parent component
    useImperativeHandle(ref, () => ({
        validateFields
    }));

    //console.log(payload);

    return (
        <div className="p-4 md:p-6">
            <h2 className="font-semibold text-xl sm:text-2xl py-4">Thông tin mô tả</h2>
            <div className="w-full flex flex-col gap-4">
                <div className="w-[30%] relative">
                    <SelectCategory
                        value={String(payload.category_id || '')}
                        setValue={(value) => handleInputChangeWithValidation('category_id', value)}
                        name="category_id"
                        options={categories.map(category => ({
                            code: category.id,
                            value: category.category_name,
                        }))}
                        label="Loại chuyên mục"
                        className="w-full" // Ensuring full width
                    />
                    {errorMessages.category_id && (
                        <p className="text-red-500 absolute -bottom-6 text-sm">
                            {errorMessages.category_id}
                        </p>
                    )}
                </div>
                <div className="relative mt-3">
                    <InputFormV3
                        value={payload.title}
                        name="title"
                        setValue={(value) => handleInputChangeWithValidation('title', value)}
                        label="Tiêu đề"
                        className="w-full"
                    />
                    {errorMessages.title && (
                        <p className="text-red-500 absolute -bottom-6 text-sm">
                            {errorMessages.title}
                        </p>
                    )}
                </div>
                <div className="relative flex flex-col gap-2 mt-3">
                    <label htmlFor="desc">Nội dung mô tả <span className='text-red-500'>*</span></label>
                    <textarea
                        placeholder="Nhập thông tin chi tiết ..."
                        id="desc"
                        cols="30" rows="5"
                        className="w-full rounded-md outline-none border border-gray-300 p-2"
                        value={payload.description}
                        name="description"
                        onChange={(e) => handleInputChangeWithValidation('description', e.target.value)}
                    ></textarea>
                    {errorMessages.description && (
                        <p className="text-red-500 absolute -bottom-6 text-sm">
                            {errorMessages.description}
                        </p>
                    )}
                </div>
                <div className="w-full flex flex-col gap-4 mt-3">
                    <div className='w-[30%]'>
                        <InputReadOnly label="Thông tin liên hệ" value={fullName} />
                    </div>
                    <div className='w-[30%]'>
                        <InputReadOnly label="Điện thoại" value={user?.phone} />
                    </div>
                    <div className="relative mt-3 w-[30%]">
                        <InputFormV2
                            value={formatNumberWithCommas(payload.price)}
                            setValue={(value) => handlePriceInput(value)}
                            name="price"
                            small="Nhập đầy đủ số, ví dụ 1 triệu thì nhập là 1000000"
                            label="Giá cho thuê"
                            unit="đồng"
                            className="w-full"
                        />
                        {errorMessages.price && (
                            <p className="text-red-500 absolute -bottom-6 text-sm">
                                {errorMessages.price}
                            </p>
                        )}
                    </div>
                    <div className="relative mt-3 w-[30%]">
                        <InputFormV2
                            value={formatNumberWithCommas(payload.acreage)}
                            setValue={(value) => handleAreaInput(value)}
                            name="acreage"
                            label="Diện tích"
                            unit="m²"
                            className="w-full"
                        />
                        {errorMessages.acreage && (
                            <p className="text-red-500 absolute -bottom-6 text-sm">
                                {errorMessages.acreage}
                            </p>
                        )}
                    </div>
                    <div className="relative mt-3 w-[30%]">
                        <SelectTargets
                            value={String(payload.target || '')}
                            setValue={(value) => handleInputChangeWithValidation('target', value)}
                            name="target"
                            options={targets.map(target => ({
                                code: target.code,
                                value: target.value,
                            }))}
                            label="Đối tượng cho thuê"
                            className="w-full"
                        />
                        {errorMessages.target && (
                            <p className="text-red-500 absolute -bottom-6 text-sm">
                                {errorMessages.target}
                            </p>
                        )}
                    </div>
                    <div className='relative mt-3'>
                        {/* Dropdown Loại tin đăng */}
                        <div className='flex items-center justify-between relative'>
                            <div className='w-[35%] relative'>
                                <label className='block font-semibold'>Loại tin đăng <span className='text-red-500'>*</span></label>
                                <select
                                    value={payload.postType_id}
                                    onChange={(e) => handleInputChangeWithValidation('postType_id', e.target.value)}
                                    className='p-2 mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                                >
                                    <option value=''>--Chọn loại tin đăng--</option>
                                    {typePosts.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                                {errorMessages.postType_id && <p className='absolute -bottom-6 text-red-500 text-sm'>{errorMessages.postType_id}</p>}
                            </div>

                            {/* Icon hiển thị bảng giá */}
                            <div className='w-[82%] flex relative'>
                                <button
                                    type='button'
                                    onClick={() => setIsPriceModalOpen(true)}
                                    className='pl-3 mt-7 text-gray-400 hover:text-gray-900 hover:bg-white'
                                    title='Bảng giá loại tin đăng'
                                >
                                    <AiOutlineInfoCircle size={24} />
                                </button>
                                {/* Tooltip */}
                                <div className='absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2'>
                                    Bảng giá loại tin đăng
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ô ngày hết hạn */}
                    <div className="relative mt-3 w-[30%]">
                        <label htmlFor="expire" className="font-medium block mb-2">Ngày hết hạn bài đăng <span className='text-red-500'>*</span></label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className={`mt-1 p-2 border rounded-md w-full ${errorMessages.expire ? 'border-red-500' : 'border-gray-300'
                                }`}
                            min={getTodayDateString()}
                            aria-invalid={errorMessages.expire ? "true" : "false"}
                            aria-describedby="expire-error"
                        />
                        {errorMessages.expire && (
                            <p id="expire-error" className="text-red-500 text-sm mt-1">
                                {errorMessages.expire}
                            </p>
                        )}
                    </div>

                    {/* Hiển thị Tổng số tiền và Số dư tài khoản */}
                    {payload.postType_id && payload.expire && (
                        <div className='mt-4 flex justify-between items-center'>
                            <div className='text-red-500 font-semibold'>
                                Tổng số tiền cần thanh toán: {new Intl.NumberFormat('vi-VN').format(totalPayment)} VNĐ
                            </div>
                            <div className='text-green-600 font-semibold'>
                                Số dư tài khoản: {balance ? new Intl.NumberFormat('vi-VN').format(balance) : '0'} VNĐ
                            </div>
                        </div>
                    )}

                    {/* Thông báo lỗi nếu số dư không đủ */}
                    {totalPayment > balance && (
                        <div className='mt-2 text-red-500 flex items-center'>
                            <span>Số dư không đủ để thực hiện tạo bài đăng này.</span>
                            <a href="nap-tien" className='ml-2 text-blue-500 underline'>Nạp tiền ngay!</a>
                        </div>
                    )}
                    {/* Modal Bảng Giá Tin Đăng */}
                    {isPriceModalOpen && <PriceModal setIsPriceModalOpen={setIsPriceModalOpen} />}
                </div>
            </div>
        </div>
    );
});

export default Overview;