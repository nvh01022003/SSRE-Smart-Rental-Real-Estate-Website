import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './PersonalInfo.css';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { Loading } from '../../../components';
import * as actions from '../../../store/actions';
import { Breadcrumb } from '../../../components';

const PersonalInfo = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    console.log(user);
    const { token } = useSelector(state => state.auth);
    const breadcrumbItems = [];

    const [isLoading, setIsLoading] = useState(false);

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

    const fetchPersonalInfo = async () => {
        if (!user) {
            return;
        }

        initialFormData.current = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            img_avt: user.img_avt
        };
        setFormData(initialFormData.current);
    };

    useEffect(() => {
        fetchPersonalInfo();
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        let formattedValue = value;

        if (name === 'firstName' || name === 'lastName') {
            // Remove special characters
            formattedValue = formattedValue.replace(/[-~!@#$%^&*()_+<>?:"Ơ}/*+=ơ\]';,./\\|]/g, '');
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
        const vietnameseRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơưƯĂăÊêÔôƠơƯưẠ-ỹ\s]+$/;

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Tên không được để trống';
        } else if (!vietnameseRegex.test(formData.firstName)) {
            newErrors.firstName = 'Tên không được chứa ký tự số';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Họ không được để trống';
        } else if (!vietnameseRegex.test(formData.lastName)) {
            newErrors.lastName = 'Họ không được chứa ký tự số';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không đúng định dạng';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Số điện thoại không được để trống';
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
            const response = await axios.post('http://localhost:5000/api/v1/user/tenants/changeInfo', formData, {
                headers: {
                    'token': `${token}`
                }
            });

            console.log('API Response:', response); // Debug log

            if (response.data.err === 0) {
                Swal.fire('Success', 'Cập nhật thành công!', 'success');

                // Update the Redux store with the new user information
                dispatch(actions.setUserInfo(token));
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
        setIsLoading(true);
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

                // Update the Redux store with the new user information
                dispatch(actions.setUserInfo(token));

            } else {
                Swal.fire('Error', response.data.msg || 'Failed to upload image', 'error');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Swal.fire('Error', 'Error uploading image', 'error');
        }
        finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !user) {
        return <Loading />;
    }

    return (
        <div className="px-4 md:px-6 max-w-4xl mx-auto">
            <Breadcrumb items={breadcrumbItems} />
            <div className="bg-white shadow-lg rounded-lg p-8 mb-6 max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center py-4 border-b border-gray-200">
                    Thông tin cá nhân
                </h1>

                <div className="flex flex-col md:flex-row justify-between pt-6">
                    <div className="flex-1 space-y-6 md:space-y-4">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-full md:w-1/2 relative">
                                <label className="text-sm text-gray-700 font-medium">HỌ, TÊN ĐỆM:</label>
                                <input
                                    className="input-firstName w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                />
                                {errors.firstName && (
                                    <small className="text-red-500 italic absolute top-full left-0">{errors.firstName}</small>
                                )}
                            </div>

                            <div className="w-full md:w-1/2 relative">
                                <label className="text-sm text-gray-700 font-medium">TÊN:</label>
                                <input
                                    className="input-lastName w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                />
                                {errors.lastName && (
                                    <small className="text-red-500 italic absolute top-full left-0">{errors.lastName}</small>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-sm text-gray-700 font-medium">EMAIL:</label>
                            <input
                                className="input-email w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />
                            {errors.email && <small className="text-red-500 italic absolute top-full left-0">{errors.email}</small>}
                        </div>

                        <div className="relative">
                            <label className="text-sm text-gray-700 font-medium">SỐ ĐIỆN THOẠI:</label>
                            <input
                                className="input-phone w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                            />
                            {errors.phone && <small className="text-red-500 italic absolute top-full left-0">{errors.phone}</small>}
                        </div>
                        <div className="flex justify-center items-center mt-4">
                            <button
                                className="btn-update w-full md:w-auto bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-200"
                                onClick={handleUpdate}
                            >
                                Cập Nhật
                            </button>
                        </div>


                    </div>


                    <div className="flex flex-col items-center mt-6 md:mt-0 md:ml-8">
                        <img
                            src={formData.img_avt}
                            alt="Avatar"
                            className="avatar w-32 h-32 rounded-full shadow-lg mb-4 md:mb-6"
                        />
                        <div className="upload-section">
                            <button
                                type="button"
                                className="btn-upload bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg"
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

