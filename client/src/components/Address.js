// // Địa chỉ cho thuê, 1 phần trên của đăng tin cho thuê

import React, { memo, useEffect, useState } from 'react'
import { Select, InputReadOnly } from '../components'
import { apiGetPublicProvinces, apiGetPublicDistrict, apiGetPublicWard } from '../services'
import InputFormNumberHouse from './InputFormNumberHouse'

const Address = ({ setPayload }) => {

    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [ward, setWard] = useState('')
    const [houseNumber, setHouseNumber] = useState('')

    const [resetDistrict, setResetDistrict] = useState(false)
    const [resetWard, setResetWard] = useState(false)

    useEffect(() => {
        const fetchPublicProvince = async () => {
            const response = await apiGetPublicProvinces()
            if (response.status === 200) {
                setProvinces(response?.data.results)
            }
        }
        fetchPublicProvince()
    }, [])

    useEffect(() => {
        setDistrict(null)
        const fetchPublicDistrict = async () => {
            const response = await apiGetPublicDistrict(province)
            if (response.status === 200) {
                setDistricts(response.data?.results)
            }
        }
        province && fetchPublicDistrict()
        !province ? setResetDistrict(true) : setResetDistrict(false)
        !province && setDistricts([])
    }, [province])

    useEffect(() => {
        setWard(null)
        const fetchPublicWard = async () => {
            const response = await apiGetPublicWard(district)
            if (response.status === 200) {
                setWards(response.data?.results)
            }
        }
        district && fetchPublicWard()
        !district ? setResetWard(true) : setResetWard(false)
        !district && setWards([])
    }, [district])

    useEffect(() => {
        setPayload(prev => ({
            ...prev,
            address: `${houseNumber ? `${houseNumber}, ` : ''}${ward ? `${wards?.find(item => item.ward_id === ward)?.ward_name}, ` : ''}${district ? `${districts?.find(item => item.district_id === district)?.district_name}, ` : ''}${province ? provinces?.find(item => item.province_id === province)?.province_name : ''}`,
            province: province ? provinces?.find(item => item.province_id === province)?.province_name : ''
        }))
    }, [province, district, ward, houseNumber])

    return (
        <div>
            <h2 className='font-semibold text-xl py-4'>Địa chỉ cho thuê</h2>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-4'>
                    <Select type='province' value={province || ''} setValue={setProvince} options={provinces} label='Tỉnh/Thành phố' />
                    <Select reset={resetDistrict} type='district' value={district || ''} setValue={setDistrict} options={districts} label='Quận/Huyện' />
                </div>
                <div className='flex items-center gap-4'>
                    <Select reset={resetWard} type='ward' value={ward || ''} setValue={setWard} options={wards} label='Phường/Xã' />
                </div>
                <InputFormNumberHouse
                    label={<span className="text-base font-medium text-gray-800">Số nhà, tên đường</span>}
                    value={houseNumber}
                    setValue={setHouseNumber}
                />
                <InputReadOnly
                    label='Địa chỉ chính xác'
                    value={`${houseNumber ? `${houseNumber}, ` : ''}${ward ? `${wards?.find(item => item.ward_id === ward)?.ward_name}, ` : ''}${district ? `${districts?.find(item => item.district_id === district)?.district_name}, ` : ''}${province ? provinces?.find(item => item.province_id === province)?.province_name : ''}`}
                />
            </div>
        </div>
    )
}

export default memo(Address)
