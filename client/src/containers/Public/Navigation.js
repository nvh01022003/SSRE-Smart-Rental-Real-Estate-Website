import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { formatVietnameseToString } from '../../ultils/Common/formatVietnameseToString';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions';
import { useSearchParams } from 'react-router-dom';
import { getPostsLimit } from '../../store/actions/post';

const notActive = 'hover:bg-[#FFE5CC] px-4 h-full flex items-center text-gray-700 transition-colors duration-200';
const active = 'hover:bg-[#FF8C00] px-4 h-full flex items-center bg-[#FF8C00] text-white transition-colors duration-200';

const Navigation = ({ isAdmin, searchClicked }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { categories } = useSelector(state => state.app);
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(actions.getCategories());
    }, [dispatch]);

    useEffect(() => {
        // Set category based on URL parameters
        const pathParts = location.pathname.split('/');
        const categoryName = pathParts[1];
        const selectedCategory = categories.find(cat => formatVietnameseToString(cat.category_name) === categoryName);

        if (selectedCategory) {
            setCategory(selectedCategory.id);
        } else {
            setCategory('');
        }
    }, [location.pathname, categories]); // Depend on `location.pathname`

    //console.log('searchClicked navigation', searchClicked);

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

        // // Map categoryCode to category ID
        if (category) {
            searchParamsObject.category = category;
        }

        delete searchParamsObject.categoryCode;
        delete searchParamsObject.priceNumber;
        delete searchParamsObject.areaNumber;
        delete searchParamsObject.provinceCode;
        delete searchParamsObject.maxAcreage;
        delete searchParamsObject.maxPrice;
        delete searchParamsObject.minAcreage;
        delete searchParamsObject.minPrice;


        // Ensure all required parameters are included
        if (!searchParamsObject.page) searchParamsObject.page = 1; // Default to page 1 if not provided

        dispatch(getPostsLimit(searchParamsObject, token));
        //console.log(searchParamsObject);
    }, [searchParams, category, page, dispatch, categories, searchClicked]);

    const handleCategoryChange = (selectedCategory) => {
        setCategory(selectedCategory);
        setPage(1); // Reset page to 1 when category changes
        navigate(`/${formatVietnameseToString(categories.find(cat => cat.id === selectedCategory).category_name)}`);
    };

    const handleHomeClick = () => {
        setCategory('');
        setPage(1);
        navigate('/');
    };

    return (
        <div className={`w-[81%] flex ${isAdmin ? 'justify-start' : ''} items-center h-[40px] bg-[#FFFAF0] text-[#FF8C00] border-b border-[#FFDAB9] mx-auto container shadow-md`}>
            <div className='w-4/5 flex h-full items-center text-sm font-medium'>
                <NavLink
                    to={`/`}
                    className={({ isActive }) => isActive ? active : notActive}
                    onClick={handleHomeClick}
                >
                    Trang chủ
                </NavLink>
                {categories?.length > 0 && categories.map(item => (
                    <div key={item.id} className='h-full flex justify-center items-center'>
                        <NavLink
                            to={`/${formatVietnameseToString(item.category_name)}`}
                            className={({ isActive }) => isActive ? active : notActive}
                            onClick={() => handleCategoryChange(item.id)}
                        >
                            {item.category_name}
                        </NavLink>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Navigation;