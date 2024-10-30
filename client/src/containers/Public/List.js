import React, { useEffect, useState } from 'react';
import { Item } from '../../components';
import { getPostsLimit } from '../../store/actions/post';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { apiGetPubliccitys } from '../../services/app';

const List = ({ categoryCode }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { posts } = useSelector(state => state.post);
    console.log(posts);
    const [provinces, setProvinces] = useState([]);  // State cho danh sách tỉnh

    const { categories } = useSelector(state => state.app);

    // Fetch danh sách tỉnh từ API
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await apiGetPubliccitys();
                if (response.status === 200) {
                    setProvinces(response.data.results);  // Lưu danh sách tỉnh vào state
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tỉnh:', error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
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

        // Map priceNumber to minPrice and maxPrice
        if (searchParamsObject.priceNumber) {
            const [minPrice, maxPrice] = searchParamsObject.priceNumber;
            searchParamsObject.minPrice = minPrice !== undefined ? minPrice : 0; // Default minPrice to 0 if not provided
            searchParamsObject.maxPrice = maxPrice;
            delete searchParamsObject.priceNumber;
        }

        // Map areaNumber to minAcreage and maxAcreage
        if (searchParamsObject.areaNumber) {
            const [minAcreage, maxAcreage] = searchParamsObject.areaNumber;
            searchParamsObject.minAcreage = minAcreage !== undefined ? minAcreage : 0; // Default minAcreage to 0 if not provided
            searchParamsObject.maxAcreage = maxAcreage;
            delete searchParamsObject.areaNumber;
        }

        // Map provinceCode to location
        if (searchParamsObject.provinceCode) {
            const selectedProvince = provinces.find(province => province.province_id === searchParamsObject.provinceCode[0]);
            if (selectedProvince) {
                searchParamsObject.location = selectedProvince.province_name;
            }
            delete searchParamsObject.provinceCode;
        }

        // Map categoryCode to category ID
        if (searchParamsObject.categoryCode) {
            const selectedCategory = categories.find(category => category.id === parseInt(searchParamsObject.categoryCode[0]));
            if (selectedCategory) {
                searchParamsObject.category = selectedCategory.id.toString(); // Ensure categoryCode is a string
            }
            delete searchParamsObject.categoryCode;
        }

        // Ensure all required parameters are included
        if (!searchParamsObject.page) searchParamsObject.page = 1; // Default to page 1 if not provided

        dispatch(getPostsLimit(searchParamsObject));
        console.log(searchParamsObject);
    }, [searchParams, categoryCode, dispatch, provinces, categories]);

    return (
        <div className='w-full bg-white shadow-md rounded-md'>
            <div className='flex items-center justify-between my-3'>
                <h4 className='text-xl font-semibold px-3 pl-3 pt-3'>Danh sách tin đăng</h4>
            </div>
            <div className='flex items-center gap-2 my-2 px-3 mb-5'>
                <span>Sắp xếp:</span>
                <button className="hover:text-blue-500 outline-none rounded-md hover:underline flex items-center justify-center gap-1 bg-gray-200 w-30 h-7 px-1">Mặc định</button>
                <button className="hover:text-blue-500 outline-none rounded-md hover:underline flex items-center justify-center gap-1 bg-gray-200 w-30 h-7 px-1">Mới nhất</button>
            </div>

            <div className='items'>
                {posts?.length > 0 ? (
                    posts.map(item => (
                        <Item
                            key={item?.id}
                            address={`${item?.Address?.detail_address}, ${item?.Address?.district}, ${item?.Address?.city}`}
                            attributes={{
                                price: item?.price,
                                acreage: item?.acreage
                            }}
                            description={item?.description}
                            images={item?.Image.img_url_list}
                            title={item?.title}
                            user={{
                                name: `${item?.User?.firstName} ${item?.User?.lastName}`,
                                phone: item?.User?.phone,
                                img_avt: item?.User?.img_avt
                            }}
                            id={item?.id}
                        />
                    ))
                ) : (
                    <div className='flex items-center justify-center h-20'>
                        <h4 className='text-xl font-semibold'>Không có bài đăng theo yêu cầu của bạn</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default List;