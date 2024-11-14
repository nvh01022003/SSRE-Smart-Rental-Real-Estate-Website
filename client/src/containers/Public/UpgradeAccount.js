import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Loading from '../../components/Loading'; // Import the Loading component

const UpgradeAccount = () => {
    const { token } = useSelector(state => state.auth);
    const [formData, setFormData] = useState({
        full_name: '',
        date_of_birth: '',
        address: '',
        contact: '',
        citizen_id: '',
        id_card_image_url: null,
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false); // State to manage loading

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        const validFileTypes = /jpeg|jpg|png|gif/;
        const newErrors = { ...errors };

        for (let file of files) {
            const fileType = file.type.split('/')[1];
            if (!validFileTypes.test(fileType)) {
                newErrors.id_card_image_url = 'Định dạng hình ảnh không hợp lệ. Vui lòng chọn tệp jpeg, jpg, png hoặc gif.';
                setErrors(newErrors);
                return;
            }
        }

        setFormData({ ...formData, id_card_image_url: files });
        newErrors.id_card_image_url = ''; // Clear any previous errors
        setErrors(newErrors);
    };

    const validateForm = () => {
        const newErrors = {};

        // Kiểm tra full_name không để trống và không chứa ký tự đặc biệt
        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Tên không được để trống';
        } else if (/[^a-zA-ZÀ-ỹ\s]/.test(formData.full_name)) { // Cho phép ký tự tiếng Việt
            newErrors.full_name = 'Tên không được chứa ký tự đặc biệt';
        }

        // Kiểm tra date_of_birth không để trống
        if (!formData.date_of_birth.trim()) {
            newErrors.date_of_birth = 'Ngày sinh không được để trống';
        }

        // Kiểm tra address không để trống và không chứa ký tự đặc biệt (trừ dấu -, ., và ,)
        if (!formData.address.trim()) {
            newErrors.address = 'Địa chỉ không được để trống';
        } else if (/[^a-zA-Z0-9À-ỹ\s.,-]/.test(formData.address)) { // Cho phép ký tự tiếng Việt và các dấu
            newErrors.address = 'Địa chỉ không được chứa ký tự đặc biệt';
        }

        // Kiểm tra contact không để trống và đúng định dạng 10 số
        if (!formData.contact.trim()) {
            newErrors.contact = 'Số điện thoại không được để trống';
        } else if (!/^\d{10}$/.test(formData.contact)) {
            newErrors.contact = 'Số điện thoại phải là 10 số';
        }

        // Kiểm tra citizen_id không để trống và đúng định dạng 12 số
        if (!formData.citizen_id.trim()) {
            newErrors.citizen_id = 'Số CMND/CCCD không được để trống';
        } else if (!/^\d{12}$/.test(formData.citizen_id)) {
            newErrors.citizen_id = 'Số CMND/CCCD phải là 12 số';
        }

        // Kiểm tra id_card_image_url không để trống
        if (!formData.id_card_image_url) {
            newErrors.id_card_image_url = 'Ảnh CMND/CCCD không được để trống';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true); // Set loading to true

        const formDataToSend = new FormData();
        formDataToSend.append('info', JSON.stringify({
            full_name: formData.full_name,
            date_of_birth: formData.date_of_birth,
            address: formData.address,
            contact: formData.contact,
            citizen_id: formData.citizen_id,
        }));
        Array.from(formData.id_card_image_url).forEach(file => {
            formDataToSend.append('imgKYC', file);
        });

        try {
            const response = await axios.post('http://localhost:5000/api/v1/user/tenants/reqUpdateToLandlord', formDataToSend, {
                headers: { 'token': token, 'Content-Type': 'multipart/form-data' },
            });
            setIsLoading(false); // Set loading to false
            if (response.data.err === 0) {
                Swal.fire('Thành công', 'Yêu cầu nâng cấp tài khoản thành công !', 'success');
            } else {
                Swal.fire('Lỗi', 'Bạn chỉ được phép gửi yêu cầu nâng cấp 1 lần !', 'error');
            }
        } catch (error) {
            setIsLoading(false); // Set loading to false
            console.error('Error submitting upgrade request:', error);
            Swal.fire('Lỗi', 'Đã xảy ra lỗi khi gửi yêu cầu nâng cấp tài khoản', 'error');
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="px-6">
            <h1 className='text-3xl font-medium py-4 border-b border-gray-200'>Nâng cấp tài khoản</h1>
            <form className='flex flex-col pt-8' onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Tên đầy đủ</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                    />
                    {errors.full_name && <small className='text-red-500'>{errors.full_name}</small>}
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Ngày sinh</label>
                    <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                    />
                    {errors.date_of_birth && <small className='text-red-500'>{errors.date_of_birth}</small>}
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Địa chỉ</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                    />
                    {errors.address && <small className='text-red-500'>{errors.address}</small>}
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Số điện thoại</label>
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                    />
                    {errors.contact && <small className='text-red-500'>{errors.contact}</small>}
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Số CMND/CCCD</label>
                    <input
                        type="text"
                        name="citizen_id"
                        value={formData.citizen_id}
                        onChange={handleInputChange}
                        className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                    />
                    {errors.citizen_id && <small className='text-red-500'>{errors.citizen_id}</small>}
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Ảnh CMND/CCCD</label>
                    <input
                        type="file"
                        name="id_card_image_url"
                        onChange={handleFileChange}
                        className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                        multiple
                        accept="image/jpeg, image/jpg, image/png, image/gif"
                    />
                    {errors.id_card_image_url && <small className='text-red-500'>{errors.id_card_image_url}</small>}
                </div>
                <button
                    type="submit"
                    className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                >
                    Gửi yêu cầu
                </button>
            </form>
        </div>
    );
};

export default UpgradeAccount;