import React, { useCallback, useEffect, useState } from 'react'
import { SearchItem, Modal } from '../../components'
import icons from '../../ultils/icons'
import { useSelector } from 'react-redux'
import { useNavigate, createSearchParams } from 'react-router-dom'
import { path } from '../../ultils/constant'
import { apiGetPubliccitys } from '../../services/app';

const { BsChevronRight, HiOutlineLocationMarker, TbReportMoney, RiCrop2Line, MdOutlineHouseSiding, FiSearch } = icons

const Search = () => {
    const navigate = useNavigate()
    const [isShowModal, setIsShowModal] = useState(false)
    const [content, setContent] = useState([])
    const [name, setName] = useState('')
    const [queries, setQueries] = useState({})
    const [arrMinMax, setArrMinMax] = useState({})
    const [defaultText, setDefaultText] = useState('')
    const [provinces, setProvinces] = useState([])  // State cho danh sách tỉnh

    const { areas, prices, categories } = useSelector(state => state.app)

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

    const handleShowModal = (content, name, defaultText) => {
        if (name === 'category') {
            content = categories.map(category => ({
                code: category.id,
                value: category.category_name
            }));
        } else if (name === 'province') {
            content = provinces.map(province => ({
                code: province.province_id,
                value: province.province_name
            }));
        } else if (name === 'price') {
            content = prices.map(price => ({
                code: price.id,
                value: price.price_range
            }));
        } else if (name === 'area') {
            content = areas.map(area => ({
                code: area.id,
                value: area.area_range
            }));
        }
        console.log('content', content)
        setContent(content)
        setName(name)
        setDefaultText(defaultText)
        setIsShowModal(true)
    }

    const handleSubmit = useCallback((e, query, arrMaxMin) => {
        e.stopPropagation()
        setQueries(prev => ({ ...prev, ...query }))
        setIsShowModal(false)
        arrMaxMin && setArrMinMax(prev => ({ ...prev, ...arrMaxMin }))
    }, [isShowModal, queries])

    const handleSearch = () => {
        const queryCodes = Object.entries(queries).filter(item => item[0].includes('Number') || item[0].includes('Code')).filter(item => item[1]);
        let queryCodesObj = {};
        queryCodes.forEach(item => { queryCodesObj[item[0]] = item[1] });

        const queryText = Object.entries(queries).filter(item => !item[0].includes('Code') && !item[0].includes('Number'));
        let queryTextObj = {};
        queryText.forEach(item => { queryTextObj[item[0]] = item[1] });

        // Map priceNumber to minPrice and maxPrice
        if (queries.priceNumber) {
            const [minPrice, maxPrice] = queries.priceNumber;
            queryCodesObj.minPrice = minPrice !== undefined ? minPrice : 0; // Default minPrice to 0 if not provided
            queryCodesObj.maxPrice = maxPrice;
        }

        // Map areaNumber to minAcreage and maxAcreage
        if (queries.areaNumber) {
            const [minAcreage, maxAcreage] = queries.areaNumber;
            queryCodesObj.minAcreage = minAcreage !== undefined ? minAcreage : 0; // Default minAcreage to 0 if not provided
            queryCodesObj.maxAcreage = maxAcreage;
        }

        // Map provinceCode to location
        if (queries.provinceCode) {
            const selectedProvince = provinces.find(province => province.province_id === queries.provinceCode[0]);
            if (selectedProvince) {
                queryCodesObj.location = selectedProvince.province_name;
            }
        }

        // Map categoryCode to category ID
        if (queries.categoryCode && categories.length > 0) {
            const selectedCategory = categories.find(category => category.id === parseInt(queries.categoryCode[0]));
            if (selectedCategory) {
                queryCodesObj.category = selectedCategory.id.toString(); // Ensure categoryCode is a string
            }
        }

        if (queries.page) queryCodesObj.page = queries.page;

        let titleSearch = `${queryTextObj.category
            ? queryTextObj.category
            : 'Cho thuê tất cả'} ${queryTextObj.province
                ? `tỉnh ${queryTextObj.province}`
                : ''} ${queryTextObj.price
                    ? `giá ${queryTextObj.price}`
                    : ''} ${queryTextObj.area
                        ? `diện tích ${queryTextObj.area}` : ''} `;

        navigate({
            pathname: path.SEARCH,
            search: createSearchParams(queryCodesObj).toString(),
        }, { state: { titleSearch } });
    };

    return (
        <>
            <div className='p-[10px] w-full my-5 bg-[#febb02] rounded-lg flex-col lg:flex-row flex items-center justify-around gap-2' >
                <span onClick={() => handleShowModal(categories, 'category', 'Tìm tất cả')} className='cursor-pointer flex-1 '>
                    <SearchItem IconBefore={<MdOutlineHouseSiding />} fontWeight IconAfter={<BsChevronRight color='rgb(156, 163, 175)' />} text={queries.category} defaultText={'Tìm tất cả'} />
                </span>
                <span onClick={() => handleShowModal(provinces, 'province', 'Toàn quốc')} className='cursor-pointer flex-1'>
                    <SearchItem IconBefore={<HiOutlineLocationMarker />} IconAfter={<BsChevronRight color='rgb(156, 163, 175)' />} text={queries.province} defaultText={'Toàn quốc'} />
                </span>
                <span onClick={() => handleShowModal(prices, 'price', 'Chọn giá')} className='cursor-pointer flex-1'>
                    <SearchItem IconBefore={<TbReportMoney />} IconAfter={<BsChevronRight color='rgb(156, 163, 175)' />} text={queries.price} defaultText={'Chọn giá'} />
                </span>
                <span onClick={() => handleShowModal(areas, 'area', 'Chọn diện tích')} className='cursor-pointer flex-1'>
                    <SearchItem IconBefore={<RiCrop2Line />} IconAfter={<BsChevronRight color='rgb(156, 163, 175)' />} text={queries.area} defaultText={'Chọn diện tích'} />
                </span>
                <button
                    type='button'
                    onClick={handleSearch}
                    className='outline-none py-2 px-4 flex-1 bg-secondary1 text-[13.3px] flex items-center justify-center gap-2 text-white font-medium'
                >
                    <FiSearch />
                    Tìm kiếm
                </button>
            </div>
            {isShowModal && <Modal
                handleSubmit={handleSubmit}
                queries={queries}
                arrMinMax={arrMinMax}
                content={content}
                name={name}
                setIsShowModal={setIsShowModal}
                defaultText={defaultText}
            />}
        </>
    )
}

export default Search
