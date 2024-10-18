// // // Địa chỉ cho thuê, 1 phần trên của đăng tin cho thuê

// import React, { memo, useEffect, useState } from 'react'
// import { Select, InputReadOnly } from '../components'
// import { apiGetPublicProvinces, apiGetPublicDistrict, apiGetPublicWard } from '../services'
// import InputFormNumberHouse from './InputFormNumberHouse'

// const Address = ({ setPayload, handleInputChange, errorMessages }) => {

//     const [provinces, setProvinces] = useState([])
//     const [districts, setDistricts] = useState([])
//     const [wards, setWards] = useState([])

//     const [province, setProvince] = useState('')
//     const [district, setDistrict] = useState('')
//     const [ward, setWard] = useState('')
//     const [houseNumber, setHouseNumber] = useState('')

//     const [resetDistrict, setResetDistrict] = useState(false)
//     const [resetWard, setResetWard] = useState(false)

//     useEffect(() => {
//         const fetchPublicProvince = async () => {
//             const response = await apiGetPublicProvinces()
//             if (response.status === 200) {
//                 setProvinces(response?.data.results)
//             }
//         }
//         fetchPublicProvince()
//     }, [])

//     // useEffect(() => {
//     //     setDistrict(null)
//     //     const fetchPublicDistrict = async () => {
//     //         const response = await apiGetPublicDistrict(province)
//     //         if (response.status === 200) {
//     //             setDistricts(response.data?.results)
//     //         }
//     //     }
//     //     province && fetchPublicDistrict()
//     //     !province ? setResetDistrict(true) : setResetDistrict(false)
//     //     !province && setDistricts([])
//     // }, [province])

//     // useEffect(() => {
//     //     setWard(null)
//     //     const fetchPublicWard = async () => {
//     //         const response = await apiGetPublicWard(district)
//     //         if (response.status === 200) {
//     //             setWards(response.data?.results)
//     //         }
//     //     }
//     //     district && fetchPublicWard()
//     //     !district ? setResetWard(true) : setResetWard(false)
//     //     !district && setWards([])
//     // }, [district])


//     useEffect(() => {
//         const fetchPublicDistrict = async () => {
//             if (!province) {
//                 setDistrict(''); // Đặt lại huyện khi không có tỉnh
//                 setDistricts([]); // Xóa danh sách huyện
//                 return;
//             }
//             const response = await apiGetPublicDistrict(province);
//             if (response.status === 200) {
//                 setDistricts(response.data?.results);
//             }
//         };
//         fetchPublicDistrict();
//     }, [province]);

//     useEffect(() => {
//         const fetchPublicWard = async () => {
//             if (!district) {
//                 setWard(''); // Đặt lại phường khi không có huyện
//                 setWards([]); // Xóa danh sách phường
//                 return;
//             }
//             const response = await apiGetPublicWard(district);
//             if (response.status === 200) {
//                 setWards(response.data?.results);
//             }
//         };
//         fetchPublicWard();
//     }, [district]);

//     useEffect(() => {
//         setPayload(prev => ({
//             ...prev,
//             address: `${houseNumber ? `${houseNumber}, ` : ''}${ward ? `${wards?.find(item => item.ward_id === ward)?.ward_name}, ` : ''}${district ? `${districts?.find(item => item.district_id === district)?.district_name}, ` : ''}${province ? provinces?.find(item => item.province_id === province)?.province_name : ''}`,
//             province: province ? provinces?.find(item => item.province_id === province)?.province_name : ''
//         }))
//     }, [province, district, ward, houseNumber])

//     return (
//         <div>
//             <h2 className='font-semibold text-xl py-4'>Địa chỉ cho thuê</h2>
//             <div className='flex flex-col gap-4'>
//                 <div className='flex items-center gap-4'>
//                     <div className='w-[28%] relative'> {/* Add relative positioning */}
//                         <Select
//                             type='province'
//                             value={province || ''}
//                             setValue={setProvince}
//                             options={provinces}
//                             label='Tỉnh/Thành phố'
//                             onChange={(value) => {
//                                 setProvince(value);
//                                 handleInputChange('province', value);
//                             }}
//                         />
//                         {errorMessages.province && (
//                             <p className='text-red-500 absolute -bottom-6 text-sm'>
//                                 {errorMessages.province}
//                             </p>
//                         )} {/* Position the error message absolutely */}
//                     </div>
//                     <div className='w-[24%] relative'> {/* Add relative positioning */}
//                         <Select
//                             reset={resetDistrict}
//                             type='district'
//                             value={district || ''}
//                             setValue={setDistrict}
//                             options={districts}
//                             label='Quận/Huyện'
//                             onChange={(value) => {
//                                 setDistrict(value);
//                                 handleInputChange('district', value);
//                             }}
//                         />
//                         {errorMessages.district && (
//                             <p className='text-red-500 absolute -bottom-6 text-sm'>
//                                 {errorMessages.district}
//                             </p>
//                         )}
//                     </div>
//                     <div className='w-[23%] relative'> {/* Add relative positioning */}
//                         <Select
//                             reset={resetWard}
//                             type='ward'
//                             value={ward || ''}
//                             setValue={setWard}
//                             options={wards}
//                             label='Phường/Xã'
//                             onChange={(value) => {
//                                 setWard(value);
//                                 handleInputChange('ward', value);
//                             }}
//                         />
//                         {errorMessages.ward && (
//                             <p className='text-red-500 absolute -bottom-6 text-sm'>
//                                 {errorMessages.ward}
//                             </p>
//                         )}
//                     </div>
//                 </div>

//                 <div className='w-[28%] pt-5'>
//                     <InputFormNumberHouse
//                         label={<span className="text-base font-medium text-gray-800">Số nhà, tên đường</span>}
//                         value={houseNumber}
//                         setValue={setHouseNumber}
//                         onChange={(e) => {
//                             setHouseNumber(e.target.value);
//                             handleInputChange('houseNumber', e.target.value);
//                         }}
//                     />
//                     {errorMessages.houseNumber && <p className='text-red-500 text-sm'>{errorMessages.houseNumber}</p>}
//                 </div>

//                 <InputReadOnly
//                     label='Địa chỉ chính xác'
//                     value={`${houseNumber ? `${houseNumber}, ` : ''}${ward ? `${wards?.find(item => item.ward_id === ward)?.ward_name}, ` : ''}${district ? `${districts?.find(item => item.district_id === district)?.district_name}, ` : ''}${province ? provinces?.find(item => item.province_id === province)?.province_name : ''}`}
//                 />
//             </div>
//         </div>
//     )
// }

// export default memo(Address)



import React, { memo, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Select, InputReadOnly } from '../components';
import { apiGetPublicProvinces, apiGetPublicDistrict, apiGetPublicWard } from '../services';
import InputFormNumberHouse from './InputFormNumberHouse';

const Address = forwardRef(({ setPayload, handleInputChange }, ref) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [houseNumber, setHouseNumber] = useState('');

    const [resetDistrict, setResetDistrict] = useState(false);
    const [resetWard, setResetWard] = useState(false);

    // State quản lý lỗi
    const [provinceError, setProvinceError] = useState('');
    const [districtError, setDistrictError] = useState('');
    const [wardError, setWardError] = useState('');
    const [houseNumberError, setHouseNumberError] = useState('');

    useEffect(() => {
        const fetchPublicProvince = async () => {
            const response = await apiGetPublicProvinces();
            if (response.status === 200) {
                setProvinces(response?.data.results);
            }
        };
        fetchPublicProvince();
    }, []);

    useEffect(() => {
        const fetchPublicDistrict = async () => {
            if (!province) {
                setDistrict(''); // Đặt lại huyện khi không có tỉnh
                setDistricts([]); // Xóa danh sách huyện
                return;
            }
            const response = await apiGetPublicDistrict(province);
            if (response.status === 200) {
                setDistricts(response.data?.results);
            }
        };
        fetchPublicDistrict();
    }, [province]);

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

    useEffect(() => {
        setPayload(prev => ({
            ...prev,
            address: `${houseNumber ? `${houseNumber}, ` : ''}${ward ? `${wards?.find(item => item.ward_id === ward)?.ward_name}, ` : ''}${district ? `${districts?.find(item => item.district_id === district)?.district_name}, ` : ''}${province ? provinces?.find(item => item.province_id === province)?.province_name : ''}`,
            province: province ? provinces?.find(item => item.province_id === province)?.province_name : ''
        }));
    }, [province, district, ward, houseNumber]);

    // Hàm kiểm tra và cập nhật lỗi
    const validateFields = () => {
        setProvinceError(!province ? 'Vui lòng chọn tỉnh/thành phố' : '');
        setDistrictError(!district ? 'Vui lòng chọn quận/huyện' : '');
        setWardError(!ward ? 'Vui lòng chọn phường/xã' : '');
        setHouseNumberError(!houseNumber ? 'Vui lòng nhập số nhà, tên đường' : '');

        return !provinceError && !districtError && !wardError && !houseNumberError;
    };

    // Expose validateFields function to parent component
    useImperativeHandle(ref, () => ({
        validateFields
    }));

    return (
        <div>
            <h2 className='font-semibold text-xl py-4'>Địa chỉ cho thuê</h2>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-6'>
                    <div className='w-[28%] relative'>
                        <Select
                            type='province'
                            value={province || ''}
                            setValue={(value) => {
                                setProvince(value);
                                handleInputChange('province', value);
                                setProvinceError(''); // Xóa lỗi khi người dùng chọn giá trị hợp lệ
                            }}
                            options={provinces}
                            label='Tỉnh/Thành phố'
                        />
                        {provinceError && (
                            <p className='text-red-500 absolute -bottom-6 text-sm'>
                                {provinceError}
                            </p>
                        )}
                    </div>
                    <div className='w-[24%] relative'>
                        <Select
                            reset={resetDistrict}
                            type='district'
                            value={district || ''}
                            setValue={(value) => {
                                setDistrict(value);
                                handleInputChange('district', value);
                                setDistrictError(''); // Xóa lỗi khi người dùng chọn giá trị hợp lệ
                            }}
                            options={districts}
                            label='Quận/Huyện'
                        />
                        {districtError && (
                            <p className='text-red-500 absolute -bottom-6 text-sm'>
                                {districtError}
                            </p>
                        )}
                    </div>
                    <div className='w-[23%] relative'>
                        <Select
                            reset={resetWard}
                            type='ward'
                            value={ward || ''}
                            setValue={(value) => {
                                setWard(value);
                                handleInputChange('ward', value);
                                setWardError(''); // Xóa lỗi khi người dùng chọn giá trị hợp lệ
                            }}
                            options={wards}
                            label='Phường/Xã'
                        />
                        {wardError && (
                            <p className='text-red-500 absolute -bottom-6 text-sm'>
                                {wardError}
                            </p>
                        )}
                    </div>
                </div>

                <div className='w-[28%] pt-5'>
                    <InputFormNumberHouse
                        label={<span className="text-base font-medium text-gray-800">Số nhà, tên đường</span>}
                        value={houseNumber}
                        setValue={(e) => {
                            setHouseNumber(e.target.value);
                            handleInputChange('houseNumber', e.target.value);
                            setHouseNumberError(''); // Xóa lỗi khi người dùng nhập giá trị hợp lệ
                        }}
                    />
                    {houseNumberError && <p className='text-red-500 text-sm'>{houseNumberError}</p>}
                </div>

                <InputReadOnly
                    label='Địa chỉ chính xác'
                    value={`${houseNumber ? `${houseNumber}, ` : ''}${ward ? `${wards?.find(item => item.ward_id === ward)?.ward_name}, ` : ''}${district ? `${districts?.find(item => item.district_id === district)?.district_name}, ` : ''}${province ? provinces?.find(item => item.province_id === province)?.province_name : ''}`}
                />
            </div>
        </div>
    );
});

export default memo(Address);
