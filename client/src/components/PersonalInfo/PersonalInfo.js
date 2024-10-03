import React, { useEffect, useState } from 'react';
import { getPersonalInfo } from '../../services/userService';
import axios from 'axios';
import './PersonalInfo.css';
import Swal from 'sweetalert2';

const PersonalInfo = () => {
    const [personalInfo, setPersonalInfo] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        img_avt: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const data = await getPersonalInfo();
                if (data.err === 0) {
                    setPersonalInfo(data.info_user);
                    setFormData({
                        firstName: data.info_user.firstName,
                        lastName: data.info_user.lastName,
                        email: data.info_user.email,
                        phone: data.info_user.phone,
                        img_avt: data.info_user.img_avt
                    });
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
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/v1/user/changeInfo', formData, {
                headers: {
                    'token': `${token}`
                }
            });
            if (response.data.err === 0) {
                Swal.fire('Success', 'Cập nhật thành công !', 'success');
            }
        } catch (error) {
            console.error('Error updating personal information:', error);
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
        </div>

    );
};

export default PersonalInfo;