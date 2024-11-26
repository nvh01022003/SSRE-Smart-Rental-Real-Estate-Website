import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import Navigation from './Navigation';
import Contact from '../../components/Contact';
import Footer from './Footer';
import Pagination from './Pagination';
import Item from '../../components/Item';
import Loading from '../../components/Loading';
import { fetchSavedPosts } from '../../store/actions/post';
import { useSearchParams } from 'react-router-dom';

const ListPostsSaved = () => {
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);
    const initialSavedPosts = useSelector(state => state.post.savedPosts);
    const [savedPosts, setSavedPosts] = useState(initialSavedPosts);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    // Cập nhật savedPosts khi initialSavedPosts thay đổi
    useEffect(() => {
        setSavedPosts(initialSavedPosts);
    }, [initialSavedPosts]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            await dispatch(fetchSavedPosts(token, page));
            setLoading(false);
        };
        fetchPosts();
    }, [dispatch, token, page]);

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

        // Ensure all required parameters are included
        if (!searchParamsObject.page) searchParamsObject.page = 1; // Default to page 1 if not provided

        //console.log(searchParamsObject);
    }, [searchParams, dispatch, token]);

    if (loading) {
        return <Loading />; // Hiện loading indicator
    }
    //console.log(savedPosts);
    return (
        <div className="w-full flex flex-col items-center h-full mx-auto">
            <Header />
            <Navigation />
            <h1 className="text-3xl font-medium py-4 w-4/5 ml-7 container mt-5 ">
                Tin đã lưu
            </h1>
            <div className="w-4/5 container flex flex-row items-start justify-start mx-auto pb-6">
                <div className="w-2/3 p-4 ">
                    {/* Render saved posts */}
                    {savedPosts.length > 0 ? (
                        savedPosts.map((post) => (
                            <Item
                                key={post.Post.id}
                                address={`${post.Post.Address?.detail_address}, ${post.Post.Address?.district}, ${post.Post.Address?.city}`}
                                attributes={{
                                    price: post.Post.price,
                                    acreage: post.Post.acreage
                                }}
                                description={post.Post.description}
                                images={post.Post.Image?.img_url_list}
                                title={post.Post.title}
                                user={{
                                    //name: `${post.Post.User?.firstName} ${post.Post.User?.lastName}`,
                                    name: `${post.Post.User?.lastName}`,
                                    phone: post.Post.User?.phone,
                                    img_avt: post.Post.User?.img_avt
                                }}
                                id={post.Post.id}
                                isSaved={post.Post.statusSave}
                                updatedAt={post.Post.updatedAt}
                            />
                        ))
                    ) : (
                        <p>Không có tin nào đã lưu.</p>
                    )}
                    <Pagination page={page} setPage={setPage} type="saved" />
                </div>
                <div className="w-1/3 p-4">
                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <h2 className="text-xl font-bold mb-2">Bài viết đã lưu</h2>
                        <ul className="list-none text-gray-700">
                            {savedPosts.length > 0 ? (
                                savedPosts.map((post) => (
                                    <li key={post.Post.id} className="flex items-center mb-2">
                                        <i className="fas fa-newspaper text-2xl mr-2"></i>
                                        <a href={`/post/${post.Post.id}`} className="hover:text-blue-500">
                                            {post.Post.title}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <p>Không có tin nào đã lưu.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <div className='my-6 w-full'>
                <Contact />
            </div>
            <br />
            <hr className='w-4/5 h-[2px] bg-gray-300 container mx-auto' />
            <div className='w-3/5 container pt-6'>
                <Footer />
            </div>
        </div>
    );
}

export default ListPostsSaved;