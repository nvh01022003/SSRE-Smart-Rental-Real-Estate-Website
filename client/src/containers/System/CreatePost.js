// import React, { useState, useContext, useRef } from 'react';
// import { Overview, Address, Loading, Button } from '../../components';
// import icons from '../../ultils/icons';
// import axios from 'axios';
// import { AuthContext } from '../../../src/Context/AuthContext';
// import Swal from 'sweetalert2';

// const { BsCameraFill, ImBin } = icons;

// const CreatePost = () => {
//     const [payload, setPayload] = useState({
//         category_id: '',
//         title: '',
//         price: 0,
//         areaNumber: 0   ,
//         images: '',
//         address: '',
//         priceCode: '',
//         areaCode: '',
//         description: '',
//         target: '',
//         province: '',
//         district: '',
//         ward: '',
//         houseNumber: ''
//     });
//     const [imagesPreview, setImagesPreview] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const { token } = useContext(AuthContext);

//     const [errorMessages, setErrorMessages] = useState({
//         title: '',
//         description: '',
//         price: '',
//         areaNumber: '',
//         target: '',
//         images: '',
//     });

//     const addressRef = useRef();

//     // Real-time validation logic
//     const handleInputChange = (name, value) => {
//         setPayload(prev => ({ ...prev, [name]: value }));

//         // Validation logic
//         switch (name) {
//             case 'title':
//                 setErrorMessages(prev => ({
//                     ...prev,
//                     title: value.length >= 20 ? '' : 'Tiêu đề yêu cầu ít nhất 20 ký tự'
//                 }));
//                 break;
//             case 'description':
//                 setErrorMessages(prev => ({
//                     ...prev,
//                     description: value.length >= 100 ? '' : 'Mô tả yêu cầu ít nhất 100 ký tự'
//                 }));
//                 break;
//             case 'price':
//                 setErrorMessages(prev => ({
//                     ...prev,
//                     price: value > 0 ? '' : 'Giá cho thuê không được để trống và phải lớn hơn 0'
//                 }));
//                 break;
//             case 'areaNumber':
//                 setErrorMessages(prev => ({
//                     ...prev,
//                     areaNumber: value > 0 ? '' : 'Diện tích không được để trống và phải lớn hơn 0'
//                 }));
//                 break;
//             case 'target':
//                 setErrorMessages(prev => ({
//                     ...prev,
//                     target: value ? '' : 'Chưa chọn chuyên mục'
//                 }));
//                 break;
//             default:
//                 break;
//         }
//     };

//     const handleFiles = async (e) => {
//         e.stopPropagation();
//         setIsLoading(true);
//         let images = [];
//         let files = e.target.files;
//         const filetypes = /jpeg|jpg|png|gif/;
//         let valid = true;

//         for (let i of files) {
//             const mimetype = filetypes.test(i.type);
//             const extname = filetypes.test(i.name.split('.').pop().toLowerCase());

//             if (!mimetype || !extname) {
//                 valid = false;
//                 setErrorMessages(prev => ({ ...prev, images: 'Chỉ cho phép các tệp hình ảnh (jpeg, jpg, png, gif)' }));
//                 break;
//             }
//             const imageURL = URL.createObjectURL(i);  // Tạo URL tạm thời từ file ảnh
//             images.push(imageURL);
//         }

//         if (valid) {
//             setIsLoading(false);
//             setImagesPreview(prev => [...prev, ...images]); // Cập nhật danh sách preview ảnh
//             setPayload(prev => ({
//                 ...prev,
//                 images: [...prev.images, ...images]
//             }));
//             setErrorMessages(prev => ({ ...prev, images: '' })); // Clear error message if valid
//         } else {
//             setIsLoading(false);
//         }
//     };

//     const handleDeleteImage = (image) => {
//         setImagesPreview(prev => prev?.filter(item => item !== image));
//         setPayload(prev => ({
//             ...prev,
//             images: prev.images?.filter(item => item !== image)
//         }));
//     };

//     const handleSubmit = async () => {
//         setIsLoading(true);

//         // Validate address fields
//         const isAddressValid = addressRef.current.validateFields();

//         // Ensure all required fields are filled out before submitting
//         if (
//             !isAddressValid ||
//             !payload.title ||
//             payload.title.length < 20 ||
//             !payload.description ||
//             payload.description.length < 100 ||
//             payload.price <= 0 ||
//             payload.areaNumber <= 0 ||
//             !payload.target ||
//             payload.images.length === 0
//         ) {
//             setErrorMessages(prev => ({
//                 ...prev,
//                 title: payload.title.length < 20 ? 'Tiêu đề yêu cầu ít nhất 20 ký tự' : prev.title,
//                 description: payload.description.length < 100 ? 'Mô tả yêu cầu ít nhất 100 ký tự' : prev.description,
//                 price: payload.price <= 0 ? 'Giá cho thuê không được để trống và phải lớn hơn 0' : prev.price,
//                 areaNumber: payload.areaNumber <= 0 ? 'Diện tích không được để trống và phải lớn hơn 0' : prev.areaNumber,
//                 target: !payload.target ? 'Chưa chọn chuyên mục' : prev.target,
//                 images: payload.images.length === 0 ? 'Chưa cập nhật ảnh' : prev.images
//             }));
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const response = await axios.post('http://localhost:5000/api/v1/user/createPost', {
//                 contentPost: JSON.stringify(payload),
//                 imageUrls: payload.images
//             }, {
//                 headers: {
//                     'token': `${token}`
//                 }
//             });

//             if (response.status === 200) {
//                 console.log('Post created successfully:', response.data);
//                 // Handle success (e.g., redirect or success message)
//                 // Reset form nếu cần
//                 setPayload({
//                     category_id: '',
//                     title: '',
//                     price: 0,
//                     areaNumber: 0,
//                     images: '',
//                     address: '',
//                     priceCode: '',
//                     areaCode: '',
//                     description: '',
//                     target: '',
//                     province: '',
//                     district: '',
//                     ward: '',
//                     houseNumber: ''
//                 });
//                 setImagesPreview([]);
//                 setErrorMessages({
//                     title: '',
//                     description: '',
//                     price: '',
//                     areaNumber: '',
//                     target: '',
//                     images: '',
//                 });
//             }
//         } catch (error) {
//             console.error('Error creating post:', error);
//             if (error.response.status === 403 && error.response.data.err === 1 && error.response.data.msg === 'You are not ladnlord') {
//                 Swal.fire('Error', 'Đây là chức năng của chủ cho thuê, hãy đăng kí tài khoản người cho thuê để sử dụng dịch vụ này !', 'error');
//                 //chèn thêm đường link đến trang đăng kí người cho thuê
//             }
//             // Handle error (e.g., show an error message)
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className='px-6 h-min-screen'>
//             <h1 className='text-3xl font-medium py-4 border-b border-gray-200'>Đăng tin mới</h1>
//             <div className='flex gap-4'>
//                 <div className='py-4 flex flex-col gap-8 flex-auto'>
//                     <Address ref={addressRef} payload={payload} setPayload={setPayload} handleInputChange={handleInputChange} />
//                     <Overview payload={payload} setPayload={setPayload} handleInputChange={handleInputChange} errorMessages={errorMessages} />

//                     <div className='w-full mb-5'>
//                         <h2 className='font-semibold text-xl py-4'>Hình ảnh</h2>
//                         <small>Cập nhật hình ảnh rõ ràng sẽ cho thuê nhanh hơn</small>
//                         <div className='w-full'>
//                             <label className='w-full border-2 h-[200px] mt-4 mb-1 gap-4 flex flex-col items-center justify-center border-gray-400 border-dashed rounded-md' htmlFor="file">
//                                 {isLoading
//                                     ? <Loading />
//                                     : <div className='flex flex-col items-center justify-center'>
//                                         <BsCameraFill color='blue' size={50} />
//                                         Thêm ảnh
//                                     </div>}
//                             </label>
//                             {errorMessages.images && <p className='text-red-500 text-sm'>{errorMessages.images}</p>} {/* Conditionally render error message */}
//                             <input onChange={handleFiles} hidden type="file" id='file' multiple />
//                             <div className='w-full mt-5'>
//                                 <h3 className='font-medium py-4 text-xl'>Ảnh đã chọn</h3>
//                                 <div className='flex gap-4 items-center'>
//                                     {imagesPreview?.map(item => {
//                                         return (
//                                             <div key={item} className='relative w-1/3 h-1/3 '>
//                                                 <img src={item} alt="preview" className='w-full h-full object-cover rounded-md' />
//                                                 <span
//                                                     title='Xóa'
//                                                     onClick={() => handleDeleteImage(item)}
//                                                     className='absolute top-0 right-0 p-2 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-full'
//                                                 >
//                                                     <ImBin />
//                                                 </span>
//                                             </div>
//                                         )
//                                     })}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <Button onClick={handleSubmit} text='Tạo mới' bgColor='bg-green-600' textColor='text-white' />
//                     <div className='h-[500px]'>
//                     </div>
//                 </div>
//                 {/* <div className='w-[30%] flex-none'>
//                     maps
//                     <Loading />
//                 </div> */}
//             </div>
//         </div>
//     );
// };

// export default CreatePost;


import React, { useState, useContext, useRef } from 'react';
import { Overview, Address, Loading, Button } from '../../components';
import icons from '../../ultils/icons';
import axios from 'axios';
import { AuthContext } from '../../../src/Context/AuthContext';
import Swal from 'sweetalert2';

const { BsCameraFill, ImBin } = icons;

const CreatePost = () => {
    const [payload, setPayload] = useState({
        category_id: '',
        title: '',
        price: 0,
        areaNumber: 0,
        images: '',
        address: '',
        priceCode: '',
        areaCode: '',
        description: '',
        target: '',
        province: '',
        district: '',
        ward: '',
        houseNumber: ''
    });
    const [imagesPreview, setImagesPreview] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useContext(AuthContext);

    const [errorMessages, setErrorMessages] = useState({
        title: '',
        description: '',
        price: '',
        areaNumber: '',
        target: '',
        images: '',
    });

    const addressRef = useRef();
    const overviewRef = useRef();

    const handleInputChange = (name, value) => {
        setPayload(prev => ({ ...prev, [name]: value }));
    };

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
    //hehe

    const handleSubmit = async () => {
        setIsLoading(true);

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
            const user = localStorage.getItem('user'); // Retrieve userID from localStorage

            const response = await axios.post('http://localhost:5000/api/v1/user/createPost', {
                contentPost: JSON.stringify(payload),
                imageUrls: payload.images,
                user: user
            }, {
                headers: {
                    'token': `${token}`
                }
            });

            if (response.status === 200) {
                console.log('Post created successfully:', response.data);
                // Handle success (e.g., redirect or success message)
                // Reset form nếu cần
                setPayload({
                    category_id: '',
                    title: '',
                    price: 0,
                    areaNumber: 0,
                    images: '',
                    address: '',
                    priceCode: '',
                    areaCode: '',
                    description: '',
                    target: '',
                    province: '',
                    district: '',
                    ward: '',
                    houseNumber: ''
                });
                setImagesPreview([]);
                setErrorMessages({
                    title: '',
                    description: '',
                    price: '',
                    areaNumber: '',
                    target: '',
                    images: '',
                });
            }
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.response.status === 403 && error.response.data.err === 1 && error.response.data.msg === 'You are not ladnlord') {
                Swal.fire('Error', 'Đây là chức năng của chủ cho thuê, hãy đăng kí tài khoản người cho thuê để sử dụng dịch vụ này !', 'error');
                //chèn thêm đường link đến trang đăng kí người cho thuê
            }
            // Handle error (e.g., show an error message)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='px-6 h-min-screen' >
            <h1 className='text-3xl font-medium py-4 border-b border-gray-200'>Đăng tin mới</h1>
            <div className='flex gap-4'>
                <div className='py-4 flex flex-col gap-8 flex-auto'>
                    <Address ref={addressRef} payload={payload} setPayload={setPayload} handleInputChange={handleInputChange} />
                    <Overview ref={overviewRef} payload={payload} setPayload={setPayload} handleInputChange={handleInputChange} />

                    <div className='w-full mb-5'>
                        <h2 className='font-semibold text-xl py-4'>Hình ảnh</h2>
                        <small>Cập nhật hình ảnh rõ ràng sẽ cho thuê nhanh hơn</small>
                        <div className='w-full'>
                            <label className='w-full border-2 h-[200px] mt-4 mb-1 gap-4 flex flex-col items-center justify-center border-gray-400 border-dashed rounded-md' htmlFor="file">
                                {isLoading
                                    ? <Loading />
                                    : <div className='flex flex-col items-center justify-center'>
                                        <BsCameraFill color='blue' size={50} />
                                        Thêm ảnh
                                    </div>}
                            </label>
                            {errorMessages.images && <p className='text-red-500 text-sm'>{errorMessages.images}</p>} {/* Conditionally render error message */}
                            <input onChange={handleFiles} hidden type="file" id='file' multiple />
                            <div className='w-full mt-5'>
                                <h3 className='font-medium py-4 text-xl'>Ảnh đã chọn</h3>
                                <div className='flex gap-4 items-center'>
                                    {imagesPreview?.map(item => {
                                        return (
                                            <div key={item} className='relative w-1/3 h-1/3 '>
                                                <img src={item} alt="preview" className='w-full h-full object-cover rounded-md' />
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
                    <div className='h-[500px]'>
                    </div>
                </div>
                {/* <div className='w-[30%] flex-none'>
                    maps
                    <Loading />
                </div> */}
            </div>
        </div >
    );
};

export default CreatePost;