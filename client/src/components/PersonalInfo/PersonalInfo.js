import React, { useEffect, useContext, useState, useRef } from 'react';
import { getPersonalInfo } from '../../services/userService';
import axios from 'axios';
import './PersonalInfo.css';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';

const PersonalInfo = () => {
    const [personalInfo, setPersonalInfo] = useState(null);
    const { token } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        img_avt: '',
        password: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);

    const [errors, setErrors] = useState({});

    const initialFormData = useRef(formData);

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                // Extract token from localStorage
                //const authData = JSON.parse(localStorage.getItem('persist:auth'));
                //const token = JSON.parse(authData.token);

                //const token = localStorage.getItem('token'); // Pass the token to the service
                console.log('Token on fetch:', token); // Debug log

                const data = await getPersonalInfo(token);
                if (data.err === 0) {
                    setPersonalInfo(data.info_user);
                    initialFormData.current = {
                        firstName: data.info_user.firstName,
                        lastName: data.info_user.lastName,
                        email: data.info_user.email,
                        phone: data.info_user.phone,
                        img_avt: data.info_user.img_avt
                    };
                    setFormData(initialFormData.current);
                    console.log('Personal information:', data.info_user);
                    console.log('Form data:', formData);
                } else {
                    console.error('Error fetching personal information:', data.msg);
                }
            } catch (error) {
                console.error('Error fetching personal information:', error);
            }
        };

        fetchPersonalInfo();
    }, []);

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

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
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
            console.log('Token on fetch:', token); // Debug log
            //const token = localStorage.getItem('token');
            //console.log('Token on update:', token); // Debug log
            console.log('Sending data:', formData); // Debug log

            const response = await axios.post('http://localhost:5000/api/v1/user/changeInfo', formData, {
                headers: {
                    'token': `${token}`
                }

            });

            console.log('API Response:', response); // Debug log

            if (response.data.err === 0) {
                Swal.fire('Success', 'Cập nhật thành công !', 'success');
            } else if (response.data.err === 1) {
                Swal.fire('Error', 'Email đã tồn tại', 'error');
            } else if (response.data.err === 2) {
                Swal.fire('Error', 'Số điện thoại đã tồn tại', 'error');
            } else {
                Swal.fire('Error', 'Cập nhật thất bại', 'error');
            }
        } catch (error) {
            console.error('Error updating personal information:', error);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            //const token = localStorage.getItem('token');
            console.log('Token on upload:', token); // Debug log
            const response = await axios.post('http://localhost:5000/api/v1/auth/upload', formData, {
                headers: {
                    'token': `${token}`
                }
            });
            if (response.data.err === 0) {
                Swal.fire('Success', 'Cập nhật ảnh mới thành công !', 'success');
            }
        } catch (error) {
            alert('Error uploading image');
        }
    };

    if (!personalInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="personal-info">
            <img src={formData.img_avt} alt="Avatar" className="avatar" />
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div >
                    <label className='lable'>HỌ, TÊN ĐỆM :</label>

                    <input className='input-firstName'
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
                    <label className='lable'>TÊN :</label>

                    <input className='input-lastName'
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                    />
                    {errors.lastName && <small className='text-red-500 italic'>{errors.lastName}</small>}
                </div>

            </div>
            <div>
                <label className='lable'>EMAIL :</label>
                <input className='input-email'
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                {errors.email && <small className='text-red-500 italic'>{errors.email}</small>}
            </div>
            <div>
                <label className='lable'>SỐ ĐIỆN THOẠI :</label>
                <input className='input-phone'
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                />
                {errors.phone && <small className='text-red-500 italic'>{errors.phone}</small>}
            </div>
            <button className='btn-update'
                onClick={handleUpdate}
            >
                CẬP NHẬT
            </button>



            <div className="upload-section">
                <form onSubmit={handleFileUpload}>
                    <label htmlFor="avatar" className="label">Upload Avatar</label>
                    <input type="file" id="avatar" name="avatar" onChange={handleFileChange} />
                    <button type="submit" className="btn-upload">Upload</button>
                </form>
            </div>


        </div>


    );
};

export default PersonalInfo;