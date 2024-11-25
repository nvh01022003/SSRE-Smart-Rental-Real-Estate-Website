import React, { useEffect, useState } from 'react';
import { ProvinceBtn } from './index';
import { location } from '../ultils/constant';
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getPostsLimit } from '../store/actions/post';
import { apiGetPubliccitys } from '../services/app';
import Loading from '../components/Loading';
import { path } from '../ultils/constant';
import { useSelector } from 'react-redux';

const Province = ({ searchClicked }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [provinces, setProvinces] = useState([]); // State cho danh sách tỉnh
    const [loading, setLoading] = useState(false); // State for loading
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        // Filter the locations for the three provinces
        const defaultLocations = location.filter(item =>
            ['Thành phố Hồ Chí Minh', 'Thành phố Hà Nội', 'Thành phố Đà Nẵng'].includes(item.id)
        );
        setFilteredLocations(defaultLocations);

        // Fetch danh sách tỉnh từ API
        const fetchProvinces = async () => {
            try {
                const response = await apiGetPubliccitys();
                if (response.status === 200) {
                    setProvinces(response.data.results); // Lưu danh sách tỉnh vào state
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tỉnh:', error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (searchClicked) return; // Skip API call if search button was clicked

        let params = [];
        for (let entry of searchParams.entries()) {
            params.push(entry);
        }
        let searchParamsObject = {};
        params?.forEach(i => {
            if (Object.keys(searchParamsObject)?.some(item => item === i[0])) {
                searchParamsObject[i[0]] = [...searchParamsObject[i[0]], i[1]];
            } else {
                searchParamsObject = { ...searchParamsObject, [i[0]]: [i[1]] };
            }
        });

        // Map provinceCode to location
        if (searchParamsObject.provinceCode) {
            const selectedProvince = provinces.find(province => province.province_id === searchParamsObject.provinceCode[0]);
            if (selectedProvince) {
                searchParamsObject.location = selectedProvince.province_name;
            }
            delete searchParamsObject.provinceCode;
        }

        // Ensure all required parameters are included
        if (!searchParamsObject.page) searchParamsObject.page = 1; // Default to page 1 if not provided

        dispatch(getPostsLimit(searchParamsObject, token));
        //console.log('searchParamsObject', searchParamsObject);
    }, [dispatch, searchParams, searchClicked, provinces]);

    const handleProvinceClick = (province) => {
        setLoading(true); // Set loading to true when search starts

        const searchParamsObject = {
            location: province.id,
            page: 1
        };

        let titleSearch = `${searchParamsObject.category
            ? searchParamsObject.category
            : 'Cho thuê tất cả'} ${searchParamsObject.location
                ? `tỉnh ${searchParamsObject.location}`
                : ''} `;

        navigate({
            pathname: path.SEARCH,
            search: createSearchParams(searchParamsObject).toString(),
        }, { state: { titleSearch } });

        setLoading(false); // Set loading to false when search completes
    };

    if (loading) return <Loading />; // Display loading indicator

    return (
        <div className='flex items-center gap-5 justify-center py-5'>
            {filteredLocations.map(item => (
                <ProvinceBtn
                    key={item.id}
                    image={item.image}
                    name={item.name}
                    onClick={() => handleProvinceClick(item)}
                />
            ))}
        </div>
    );
};

export default Province;