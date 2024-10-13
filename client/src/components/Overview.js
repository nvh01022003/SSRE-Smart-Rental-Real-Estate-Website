//Trang đăng tin cho thuê bắt đầu từ thông tin mô tả tới đối tượng cho thuê

import React, { useContext, useState, useEffect } from 'react'
import { Select, InputReadOnly, InputFormV2 } from './'
import { useSelector } from 'react-redux'
import { AuthContext } from '../Context/AuthContext'
import { getPersonalInfo } from '../services/userService'

const targets = [
    { code: 'Nam', value: 'Nam' },
    { code: 'Nữ', value: 'Nữ' },
]

const Overview = ({ payload, setPayload }) => {
    const { categories } = useSelector(state => state.app)

    const { token } = useContext(AuthContext);

    const [personalInfo, setPersonalInfo] = useState(null);

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
    }, []);

    const fullName = personalInfo ? `${personalInfo.firstName} ${personalInfo.lastName}`.trim() : '';

    return (
        <div>
            <h2 className='font-semibold text-xl py-4'>Thông tin mô tả</h2>
            <div className='w-full flex flex-col gap-4'>
                <div className='w-1/2'><Select value={payload.categoryCode} setValue={setPayload} name='categoryCode' options={categories} label='Loại chuyên mục' /></div>
                <InputFormV2 value={payload.title} setValue={setPayload} name='title' label='Tiêu đề' />
                <div className='flex flex-col gap-2'>
                    <label htmlFor="desc">Nội dung mô tả</label>
                    <textarea
                        id="desc"
                        cols="30" rows="10"
                        className='w-full rounded-md outline-none border border-gray-300 p-2'
                        value={payload.description}
                        onChange={(e) => setPayload(prev => ({ ...prev, description: e.target.value }))}
                    ></textarea>
                </div>
                <div className='w-1/2 flex flex-col gap-4'>
                    <InputReadOnly label='Thông tin liên hệ' value={fullName} />
                    <InputReadOnly label='Điện thoại' value={personalInfo?.phone} />
                    <InputFormV2 value={payload.priceNumber} setValue={setPayload} small='Nhập đầy đủ số, ví dụ 1 triệu thì nhập là 1000000' label='Giá cho thuê' unit='đồng' name='priceNumber' />
                    <InputFormV2 value={payload.areaNumber} setValue={setPayload} name='areaNumber' label='Diện tích' unit='m2' />
                    <Select value={payload.target} setValue={setPayload} name='target' options={targets} label='Đối tượng cho thuê' />
                </div>
            </div>


        </div>
    )
}

export default Overview