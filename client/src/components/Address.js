import React, { memo, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Select, InputReadOnly } from '../components';
import { apiGetPubliccitys, apiGetPublicDistrict, apiGetPublicWard } from '../services';
import InputFormNumberHouse from './InputFormNumberHouse';

const Address = forwardRef(({ setPayload, handleInputChange, resetForm }, ref) => {
    const [citys, setcitys] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [city, setcity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [detail_address, setdetail_address] = useState('');

    const [resetDistrict, setResetDistrict] = useState(false);
    const [resetWard, setResetWard] = useState(false);

    // State quản lý lỗi
    const [cityError, setcityError] = useState('');
    const [districtError, setDistrictError] = useState('');
    const [wardError, setWardError] = useState('');
    const [detail_addressError, setdetail_addressError] = useState('');



    useEffect(() => {
        const fetchPubliccity = async () => {
            const response = await apiGetPubliccitys();
            if (response.status === 200) {
                setcitys(response?.data.results);
            }
        };
        fetchPubliccity();
    }, []);

    useEffect(() => {
        const fetchPublicDistrict = async () => {
            if (!city) {
                setDistrict(''); // Đặt lại huyện khi không có tỉnh
                setDistricts([]); // Xóa danh sách huyện
                return;
            }
            const response = await apiGetPublicDistrict(city);
            if (response.status === 200) {
                setDistricts(response.data?.results);
            }
        };
        fetchPublicDistrict();
    }, [city]);

    useEffect(() => {
        const fetchPublicWard = async () => {
            if (!district) {
                setWard(''); // Đặt lại phường khi không có huyện
                setWards([]); // Xóa danh sách phường
                return;
            }
            const response = await apiGetPublicWard(district);
            if (response.status === 200) {
                setWards(response.data?.results);
            }
        };
        fetchPublicWard();
    }, [district]);

    // useEffect(() => {
    //     setPayload(prev => ({
    //         ...prev,
    //         address: `${detail_address ? `${detail_address}, ` : ''}${ward ? `${wards?.find(item => item.ward_id === ward)?.ward_name}, ` : ''}${district ? `${districts?.find(item => item.district_id === district)?.district_name}, ` : ''}${city ? citys?.find(item => item.province_id === city)?.province_name : ''}`,
    //         city: city ? citys?.find(item => item.province_id === city)?.province_name : ''
    //     }));
    // }, [city, district, ward, detail_address]);

    useEffect(() => {
        setPayload(prev => ({
            ...prev,
            address: {
                detail_address: detail_address, // Thêm detail_address vào đây
                district: district, // Thêm district vào đây
                city: city, // Thêm city vào đây
                ward: ward // Thêm ward vào đây
            },
            city: city ? citys?.find(item => item.province_id === city)?.province_name : '',
            district: district ? districts?.find(item => item.district_id === district)?.district_name : '',
            ward: ward ? wards?.find(item => item.ward_id === ward)?.ward_name : '',

        }));
    }, [city, district, ward, detail_address, setPayload, citys, districts, wards]);


    // Hàm kiểm tra và cập nhật lỗi
    const validateFields = () => {
        setcityError(!city ? 'Vui lòng chọn tỉnh/thành phố' : '');
        setDistrictError(!district ? 'Vui lòng chọn quận/huyện' : '');
        setWardError(!ward ? 'Vui lòng chọn phường/xã' : '');
        setdetail_addressError(!detail_address ? 'Vui lòng nhập số nhà, tên đường' : '');

        return !cityError && !districtError && !wardError && !detail_addressError;
    };

    // Expose validateFields function to parent component
    useImperativeHandle(ref, () => ({
        validateFields
    }));

    // Reset the address fields when resetForm changes
    useEffect(() => {
        if (resetForm) {
            setcity('');
            setDistrict('');
            setWard('');
            setdetail_address('');
        }
    }, [resetForm]);

    return (
        <div className="p-4 md:p-6">
            <h2 className='font-semibold text-2xl md:text-xl py-4'>Địa chỉ cho thuê</h2>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='w-full md:w-[28%] relative'>
                        <Select
                            type='city'
                            value={city || ''}
                            setValue={(value) => {
                                setcity(value);
                                handleInputChange('city', value);
                                setcityError('');
                            }}
                            options={citys.map(city => ({
                                code: city.province_id,
                                value: city.province_name
                            }))}
                            label='Tỉnh/Thành phố'
                        />
                        {cityError && (
                            <p className='text-red-500 absolute -bottom-6 text-sm'>
                                {cityError}
                            </p>
                        )}
                    </div>
                    <div className='w-full md:w-[24%] relative'>
                        <Select
                            reset={resetDistrict}
                            type='district'
                            value={district || ''}
                            setValue={(value) => {
                                setDistrict(value);
                                handleInputChange('district', value);
                                setDistrictError('');
                            }}
                            options={districts.map(district => ({
                                code: district.district_id,
                                value: district.district_name
                            }))}
                            label='Quận/Huyện'
                        />
                        {districtError && (
                            <p className='text-red-500 absolute -bottom-6 text-sm'>
                                {districtError}
                            </p>
                        )}
                    </div>
                    <div className='w-full md:w-[23%] relative'>
                        <Select
                            reset={resetWard}
                            type='ward'
                            value={ward || ''}
                            setValue={(value) => {
                                setWard(value);
                                handleInputChange('ward', value);
                                setWardError('');
                            }}
                            options={wards.map(ward => ({
                                code: ward.ward_id,
                                value: ward.ward_name
                            }))}
                            label='Phường/Xã'
                        />
                        {wardError && (
                            <p className='text-red-500 absolute -bottom-6 text-sm'>
                                {wardError}
                            </p>
                        )}
                    </div>
                </div>

                <div className='w-full md:w-[28%] pt-5'>
                    <InputFormNumberHouse
                        label={<span className="text-base font-medium text-gray-800">Số nhà, tên đường <span className='text-red-500'>*</span></span>}
                        value={detail_address || ''}
                        setValue={(e) => {
                            setdetail_address(e.target.value);
                            handleInputChange('detail_address', e.target.value);
                            setdetail_addressError('');
                        }}
                    />
                    {detail_addressError && <p className='text-red-500 text-sm'>{detail_addressError}</p>}
                </div>

                <InputReadOnly
                    label='Địa chỉ chính xác'
                    value={`${detail_address ? `${detail_address}, ` : ''}${ward ? `${wards?.find(item => item.ward_id === ward)?.ward_name}, ` : ''}${district ? `${districts?.find(item => item.district_id === district)?.district_name}, ` : ''}${city ? citys?.find(item => item.province_id === city)?.province_name : ''}`}
                />
            </div>
        </div>
    );
});

export default memo(Address);
