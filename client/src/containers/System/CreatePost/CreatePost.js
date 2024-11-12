import React, { useState, useRef } from 'react';
import { Overview, Address, Loading, Button } from '../../../components';
import icons from '../../../ultils/icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const { BsCameraFill, ImBin } = icons;

const CreatePost = () => {
    const location = useLocation();
    const { selectedTypePostId } = location.state || {};

    const { token } = useSelector(state => state.auth);
    const [payload, setPayload] = useState({
        category_id: '',
        postType_id: selectedTypePostId || '',
        totalPayment: 0,
        title: '',
        price: 0,
        acreage: 0,
        images: [],
        address: {
            detail_address: '',
            district: '',
            city: '',
            ward: ''
        },
        priceCode: '',
        areaCode: '',
        description: '',
        target: '',
        city: '',
        district: '',
        ward: '',
        detail_address: '',
        expire: '',
    });
    const [imagesPreview, setImagesPreview] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const [errorMessages, setErrorMessages] = useState({
        postType_id: '',
        title: '',
        description: '',
        price: '',
        acreage: '',
        target: '',
        images: '',
        expire: '',
    });

    const addressRef = useRef();
    const overviewRef = useRef();

    const { role } = useSelector(state => state.auth);

    const handleInputChange = (name, value) => {
        setPayload(prev => ({ ...prev, [name]: value }));

    };

    const [payloadResetFlag, setPayloadResetFlag] = useState(false);

    const handleFiles = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        let images = [];
        let files = e.target.files;
        const filetypes = /jpeg|jpg|png|gif/;
        let valid = true;

        for (let i of files) {
            const mimetype = filetypes.test(i.type);
            const extname = filetypes.test(i.name.split('.').pop().toLowerCase());

            if (!mimetype || !extname) {
                valid = false;
                setErrorMessages(prev => ({ ...prev, images: 'Chỉ cho phép các tệp hình ảnh (jpeg, jpg, png, gif)' }));
                break;
            }
            const imageURL = URL.createObjectURL(i);  // Tạo URL tạm thời từ file ảnh
            images.push(imageURL);
        }

        if (valid) {
            setIsLoading(false);
            setImagesPreview(prev => [...prev, ...images]); // Cập nhật danh sách preview ảnh
            setPayload(prev => ({
                ...prev,
                images: [...prev.images, ...images]
            }));
            setErrorMessages(prev => ({ ...prev, images: '' })); // Clear error message if valid
        } else {
            setIsLoading(false);
        }
    };

    const handleDeleteImage = (image) => {
        setImagesPreview(prev => prev?.filter(item => item !== image));
        setPayload(prev => ({
            ...prev,
            images: prev.images?.filter(item => item !== image)
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        // Validate postType_id
        if (!payload.postType_id) {
            setErrorMessages(prev => ({ ...prev, postType_id: 'Vui lòng chọn loại tin đăng.' }));
        } else {
            setErrorMessages(prev => ({ ...prev, postType_id: '' }));
        }

        // Validate address and overview fields
        const isAddressValid = addressRef.current.validateFields();
        const isOverviewValid = overviewRef.current.validateFields();

        // Ensure all required fields are filled out before submitting
        if (
            !isAddressValid ||
            !isOverviewValid ||
            payload.images.length === 0
        ) {
            setErrorMessages(prev => ({
                ...prev,
                images: payload.images.length === 0 ? 'Chưa cập nhật ảnh' : prev.images
            }));
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();

            // Append address with required fields
            const addressData = {
                detail_address: payload.detail_address,
                district: payload.district,
                city: payload.city,
                ward: payload.ward // Thêm ward vào đây
            };

            const contentPost = {
                ...payload,
                address: addressData // Gửi address với cấu trúc đúng
            };

            // Append all fields to formData
            formData.append('contentPost', JSON.stringify(contentPost));

            payload.images.forEach(image => {
                formData.append('imageUrls', image); // Thêm từng URL hình ảnh
            });

            // Lấy file từ input và append vào formData với tên 'imgPost'
            const fileInput = document.getElementById('file');
            //console.log(fileInput);
            const files = fileInput.files;
            for (let i = 0; i < files.length; i++) {
                formData.append('imgPost', files[i]); // Phải khớp với tên trường ở BE
            }

            // Send the formData via axios
            const response = await axios.post('http://localhost:5000/api/v1/user/ladnlord/createPost', formData,
                {
                    headers: {
                        'token': `${token}`,
                        'Content-Type': 'multipart/form-data' // Đảm bảo định dạng gửi đi là multipart/form-data
                    }
                });
            console.log(response);
            if (response.status === 200) {
                if (response.data.err === 0) {
                    console.log('Post created successfully:', response.data);
                    Swal.fire('Thành công', 'Tạo bài đăng thành công', 'success');
                    // Handle success (e.g., redirect or success message)
                    // Reset form if needed
                    setPayload({
                        category_id: '',
                        title: '',
                        price: 0,
                        acreage: 0,
                        images: [],
                        address: {
                            detail_address: '',
                            district: '',
                            city: '',
                            ward: ''
                        },
                        priceCode: '',
                        areaCode: '',
                        description: '',
                        target: '',
                        city: '',
                        district: '',
                        ward: '',
                        detail_address: '',
                        expire: '',
                    });
                    // Trigger the address reset
                    setPayloadResetFlag(true);  // This will reset the Address component fields

                    // Reset the reset flag after a short delay to avoid issues with multiple submissions
                    setTimeout(() => setPayloadResetFlag(false), 100);
                    setImagesPreview([]);
                    setErrorMessages({
                        title: '',
                        description: '',
                        price: '',
                        acreage: '',
                        target: '',
                        images: '',
                        expire: '',
                    });
                }
                else {
                    Swal.fire('Thất bại', 'Tạo bài đăng thất bại !', 'error');
                    console.log('error', response.data)
                    setPayload({
                        images: []
                    });
                }
            }

        } catch (error) {
            console.error('Error creating post:', error);

            // Handle error (e.g., show an error message)
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            {role === 'tenants' ? (
                <div className='bg-white shadow-md rounded-lg p-6'>
                    <h1 className='text-3xl md:text-4xl font-bold text-gray-800 text-center py-4 border-b border-gray-200'>Đăng tin mới</h1>
                    <div className='flex flex-col md:flex-row gap-2 mt-10 font-medium text-lg'>
                        <p className='text-gray-500'>Chức năng này chỉ dành cho nhà cho thuê :</p>
                        <p
                            className='text-blue-500 hover:text-red-500 hover:underline cursor-pointer'
                            onClick={() => window.location.href = '/he-thong/nang-cap-tai-khoan'}
                        >Nâng cấp tài khoản theo đường link này !</p>
                    </div>
                </div>
            ) : (
                <div className='bg-white shadow-md rounded-lg p-6'>
                    <h1 className='text-3xl md:text-4xl font-bold text-gray-800 text-center py-4 border-b border-gray-200'>Đăng tin mới</h1>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='py-4 flex flex-col gap-8 flex-auto'>
                            <div className='py-4 border-b border-gray-200'>
                                <Address ref={addressRef} payload={payload} setPayload={setPayload} handleInputChange={handleInputChange} resetForm={payloadResetFlag} />
                            </div>
                            <div className='py-4 border-b border-gray-200'>
                                <Overview ref={overviewRef} payload={payload} setPayload={setPayload} handleInputChange={handleInputChange} />
                            </div>
                            <div className='w-full mb-5'>
                                <h2 className='font-semibold text-xl py-4'>Hình ảnh <span className='text-red-500'>*</span></h2>
                                <small className='text-gray-600'>Cập nhật hình ảnh rõ ràng sẽ cho thuê nhanh hơn</small>
                                <div className='w-full'>
                                    <label className='w-full border-2 h-[200px] mt-4 mb-1 gap-4 flex flex-col items-center justify-center border-gray-400 border-dashed rounded-md' htmlFor="file">
                                        {isLoading
                                            ? <Loading />
                                            : <div className='flex flex-col items-center justify-center'>
                                                <BsCameraFill color='blue' size={50} />
                                                <span className='text-gray-700'>Thêm ảnh</span>
                                            </div>}
                                    </label>
                                    {errorMessages.images && <p className='text-red-500 text-sm'>{errorMessages.images}</p>}
                                    <input onChange={handleFiles} hidden type="file" id='file' name='imgPost' multiple />
                                    <div className='w-full mt-5'>
                                        <h3 className='font-medium py-4 text-xl'>Ảnh đã chọn</h3>
                                        <div className='flex flex-wrap gap-4 items-center'>
                                            {imagesPreview?.map(item => {
                                                return (
                                                    <div key={item} className='relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-1/3'>
                                                        <img src={item} alt="preview" className='w-full h-full object-cover rounded-md shadow' />
                                                        <span
                                                            title='Xóa'
                                                            onClick={() => handleDeleteImage(item)}
                                                            className='absolute top-0 right-0 p-2 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-full'
                                                        >
                                                            <ImBin />
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button onClick={handleSubmit} text='Tạo mới' bgColor='bg-green-600' textColor='text-white' />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePost;