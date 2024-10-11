import React, { useEffect, useContext, useState, useRef } from 'react';
import { getPersonalInfo } from '../../../services/userService';
import axios from 'axios';
import './PersonalInfo.css';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';

const PersonalInfo = () => {
    const [personalInfo, setPersonalInfo] = useState(null);
    const { token } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        img_avt: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    const initialFormData = useRef(formData);

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                console.log('Token on fetch:', token); // Debug log

                const data = await getPersonalInfo(token);
                if (data.err === 0) {
                    setPersonalInfo(data.info_user);
                    initialFormData.current = {
                        id: data.info_user.id,
                        firstName: data.info_user.firstName,
                        lastName: data.info_user.lastName,
                        email: data.info_user.email,
                        phone: data.info_user.phone,
                        img_avt: data.info_user.img_avt
                    };
                    setFormData(initialFormData.current);
                    console.log('Personal information:', data.info_user);
                } else {
                    console.error('Error fetching personal information:', data.msg);
                    Swal.fire('Error', data.msg || 'Error fetching personal information', 'error');
                }
            } catch (error) {
                console.error('Error fetching personal information:', error);
                Swal.fire('Error', 'Error fetching personal information', 'error');
            }
        };

        if (token) { // Ensure token is available
            fetchPersonalInfo();
        }
    }, [token]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        let formattedValue = value;

        if (name === 'firstName' || name === 'lastName') {
            // Automatically capitalize the first letter of each word
            formattedValue = value.replace(/\b\w/g, char => char.toUpperCase());

            // Remove special characters
            formattedValue = formattedValue.replace(/[^a-zA-Z\s]/g, '');
        }

        setFormData({ ...formData, [name]: formattedValue });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await handleFileUpload(file);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Không để trống';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Không để trống';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không đúng định dạng';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Không được để trống';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async () => {
        if (!validate()) {
            return;
        }
        try {
            console.log('Token on update:', token); // Debug log
            console.log('Sending data:', formData); // Debug log

            const response = await axios.post('http://localhost:5000/api/v1/user/changeInfo', formData, {
                headers: {
                    'token': `${token}`
                }
            });

            console.log('API Response:', response); // Debug log

            if (response.data.err === 0) {
                Swal.fire('Success', 'Cập nhật thành công!', 'success');
                // Optionally, refetch personal info to ensure data consistency
                // fetchPersonalInfo();
            }
        } catch (error) {
            if (error.response.data.err === 1) {
                Swal.fire('Error', 'Email đã được sử dụng !', 'error');

                // đặt lại email ban đầu khi báo lỗi
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    email: initialFormData.current.email
                }));
            }
            else if (error.response.data.err === 2) {
                Swal.fire('Error', 'Số điện thoại đã được sử dụng !', 'error');

                // đặt lại phone ban đầu khi báo lỗi
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    phone: initialFormData.current.phone
                }));
            }
            else {
                Swal.fire('Error', 'Lỗi khi cập nhật thông tin người dùng !', 'error');
            }
        }
    };

    const handleFileUpload = async (file) => {
        const uploadData = new FormData();
        uploadData.append('avatar', file); // Ensure the field name matches what the server expects

        try {
            console.log('Token on upload:', token); // Debug log
            const response = await axios.post('http://localhost:5000/api/v1/auth/upload', uploadData, {
                headers: {
                    'token': `${token}`,
                }
            });

            console.log('Upload API Response:', response); // Debug log

            if (response.data.err === 0) {
                Swal.fire('Success', 'Cập nhật ảnh mới thành công!', 'success');

                // If the server returns the URL of the uploaded image, use it.
                // Assuming response.data.url contains the image URL
                const newImgUrl = response.data.url;

                // To prevent caching issues, append a timestamp
                const timestamp = new Date().getTime();
                const finalImgUrl = newImgUrl ? `${newImgUrl}?t=${timestamp}` : URL.createObjectURL(file);

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    img_avt: finalImgUrl
                }));
            } else {
                Swal.fire('Error', response.data.msg || 'Failed to upload image', 'error');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Swal.fire('Error', 'Error uploading image', 'error');
        }
    };

    if (!personalInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="px-6">
            <h1 className='text-3xl font-medium py-4 border-b border-gray-200'>Thông tin cá nhân</h1>

            <div className='flex pt-8'>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                            <label className='text-sm text-gray-700 font-medium'>HỌ, TÊN ĐỆM :</label>
                            <input
                                className='input-firstName'
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                style={{ marginRight: '8px' }}
                            />
                            {errors.firstName && <small className='text-red-500 italic'>{errors.firstName}</small>}
                        </div>

                        <div>
                            <label className='text-sm text-gray-700 font-medium'>TÊN :</label>
                            <input
                                className='input-lastName'
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                            />
                            {errors.lastName && <small className='text-red-500 italic'>{errors.lastName}</small>}
                        </div>
                    </div>

                    <div className='mt-3'>
                        <label className='text-sm text-gray-700 font-medium'>EMAIL :</label>
                        <input
                            className='input-email'
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                        {errors.email && <small className='text-red-500 italic'>{errors.email}</small>}
                    </div>
                    <div className='mt-3'>
                        <label className='text-sm text-gray-700 font-medium'>SỐ ĐIỆN THOẠI :</label>
                        <input
                            className='input-phone'
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                        />
                        {errors.phone && <small className='text-red-500 italic '>{errors.phone}</small>}
                    </div>
                    <button
                        className='btn-update'
                        onClick={handleUpdate}
                    >
                        Cập Nhật
                    </button>
                </div>

                <div className="center-container">
                    <div className='center-content'>
                        <img src={formData.img_avt} alt="Avatar" className="avatar" />
                        <div className="upload-section">
                            <button
                                type="button"
                                className="btn-upload"
                                onClick={() => document.getElementById('avatar').click()}
                            >
                                Chọn Ảnh
                            </button>
                            <input
                                hidden
                                type="file"
                                id="avatar"
                                name="avatar"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;

