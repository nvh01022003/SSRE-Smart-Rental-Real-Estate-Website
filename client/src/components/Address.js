// // // Địa chỉ cho thuê, 1 phần trên của đăng tin cho thuê

// import React, { memo, useEffect, useState } from 'react'
// import { Select, InputReadOnly } from '../components'
// import { apiGetPubliccitys, apiGetPublicDistrict, apiGetPublicWard } from '../services'
// import InputFormNumberHouse from './InputFormNumberHouse'

// const Address = ({ setPayload, handleInputChange, errorMessages }) => {

//     const [citys, setcitys] = useState([])
//     const [districts, setDistricts] = useState([])
//     const [wards, setWards] = useState([])

//     const [city, setcity] = useState('')
//     const [district, setDistrict] = useState('')
//     const [ward, setWard] = useState('')
//     const [detail_address, setdetail_address] = useState('')

//     const [resetDistrict, setResetDistrict] = useState(false)
//     const [resetWard, setResetWard] = useState(false)

//     useEffect(() => {
//         const fetchPubliccity = async () => {
//             const response = await apiGetPubliccitys()
//             if (response.status === 200) {
//                 setcitys(response?.data.results)
//             }
//         }
//         fetchPubliccity()
//     }, [])

//     // useEffect(() => {
//     //     setDistrict(null)
//     //     const fetchPublicDistrict = async () => {
//     //         const response = await apiGetPublicDistrict(city)
//     //         if (response.status === 200) {
//     //             setDistricts(response.data?.results)
//     //         }
//     //     }
//     //     city && fetchPublicDistrict()
//     //     !city ? setResetDistrict(true) : setResetDistrict(false)
//     //     !city && setDistricts([])
//     // }, [city])

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
//             if (!city) {
//                 setDistrict(''); // Đặt lại huyện khi không có tỉnh
//                 setDistricts([]); // Xóa danh sách huyện
//                 return;
//             }
//             const response = await apiGetPublicDistrict(city);
//             if (response.status === 200) {
//                 setDistricts(response.data?.results);
//             }
//         };
//         fetchPublicDistrict();
//     }, [city]);

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
//             address: `${detail_address ? `${detail_address}, ` : ''}${ward ? `${wards?.find(item => item.ward_id === ward)?.ward_name}, ` : ''}${district ? `${districts?.find(item => item.district_id === district)?.district_name}, ` : ''}${city ? citys?.find(item => item.city_id === city)?.city_name : ''}`,
//             city: city ? citys?.find(item => item.city_id === city)?.city_name : ''
//         }))
//     }, [city, district, ward, detail_address])

//     return (
//         <div>
//             <h2 className='font-semibold text-xl py-4'>Địa chỉ cho thuê</h2>
//             <div className='flex flex-col gap-4'>
//                 <div className='flex items-center gap-4'>
//                     <div className='w-[28%] relative'> {/* Add relative positioning */}
//                         <Select
//                             type='city'
//                             value={city || ''}
//                             setValue={setcity}
//                             options={citys}
//                             label='Tỉnh/Thành phố'
//                             onChange={(value) => {
//                                 setcity(value);
//                                 handleInputChange('city', value);
//                             }}
//                         />
//                         {errorMessages.city && (
//                             <p className='text-red-500 absolute -bottom-6 text-sm'>
//                                 {errorMessages.city}
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
//                         value={detail_address}
//                         setValue={setdetail_address}
//                         onChange={(e) => {
//                             setdetail_address(e.target.value);
//                             handleInputChange('detail_address', e.target.value);
//                         }}
//                     />
//                     {errorMessages.detail_address && <p className='text-red-500 text-sm'>{errorMessages.detail_address}</p>}
//                 </div>

//                 <InputReadOnly
//                     label='Địa chỉ chính xác'
//                     value={`${detail_address ? `${detail_address}, ` : ''}${ward ? `${wards?.find(item => item.ward_id === ward)?.ward_name}, ` : ''}${district ? `${districts?.find(item => item.district_id === district)?.district_name}, ` : ''}${city ? citys?.find(item => item.city_id === city)?.city_name : ''}`}
//                 />
//             </div>
//         </div>
//     )
// }

// export default memo(Address)



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
        <div>
            <h2 className='font-semibold text-xl py-4'>Địa chỉ cho thuê</h2>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-6'>
                    <div className='w-[28%] relative'>
                        <Select
                            type='city'
                            value={city || ''}
                            setValue={(value) => {
                                setcity(value);
                                handleInputChange('city', value);
                                setcityError(''); // Xóa lỗi khi người dùng chọn giá trị hợp lệ
                            }}

                            options={citys.map(city => ({
                                code: city.province_id, // ID của chuyên mục
                                value: city.province_name // Tên hiển thị của chuyên mục
                            }))}
                            label='Tỉnh/Thành phố'
                        />
                        {cityError && (
                            <p className='text-red-500 absolute -bottom-6 text-sm'>
                                {cityError}
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
                            options={districts.map(district => ({
                                code: district.district_id, // ID của chuyên mục
                                value: district.district_name // Tên hiển thị của chuyên mục
                            }))}
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
                            options={wards.map(ward => ({
                                code: ward.ward_id, // ID của chuyên mục
                                value: ward.ward_name // Tên hiển thị của chuyên mục
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

                <div className='w-[28%] pt-5'>
                    <InputFormNumberHouse
                        label={<span className="text-base font-medium text-gray-800">Số nhà, tên đường</span>}
                        value={detail_address || ''}
                        setValue={(e) => {
                            setdetail_address(e.target.value);
                            handleInputChange('detail_address', e.target.value);
                            setdetail_addressError(''); // Xóa lỗi khi người dùng nhập giá trị hợp lệ
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
