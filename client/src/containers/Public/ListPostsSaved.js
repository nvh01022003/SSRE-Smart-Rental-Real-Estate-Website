// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from './Header';
// import Navigation from './Navigation';
// import Contact from '../../components/Contact';
// import Footer from './Footer';
// import Heart from '../../assets/Heart.jpg';
// import { useSelector } from 'react-redux';
// import Pagination from './Pagination';

// const ListPostsSaved = () => {
//     const [savedPosts, setSavedPosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const { token } = useSelector(state => state.auth);
//     const [page, setPage] = useState(1);


//     useEffect(() => {
//         const fetchSavedPosts = async () => {
//             setLoading(true); // Bắt đầu tải dữ liệu
//             try {
//                 const response = await axios.get(`http://localhost:5000/api/v1/user/tenants/listPostSaved?page=${page}`, {
//                     headers: {
//                         'token': `${token}`
//                     }
//                 });
//                 console.log(response);
//                 if (response.data.err === 0) {
//                     setSavedPosts(response.data.msg.listPost); // Cập nhật danh sách bài viết đã lưu
//                 } else {
//                     console.error('Error fetching saved posts:', response.data.msg);
//                 }
//             } catch (error) {
//                 console.error('Error fetching saved posts:', error);
//             } finally {
//                 setLoading(false); // Kết thúc tải dữ liệu
//             }
//         };

//         fetchSavedPosts();
//     }, [page, token]);
//     if (loading) {
//         return <div>Loading...</div>; // Thông báo đang tải
//     }

//     return (
//         <div className="w-full flex flex-col items-center h-full mx-auto">
//             <Header />
//             <Navigation />
//             <h1 className="text-3xl font-medium py-4 w-full ml-7 container mt-5 ">
//                 Tin đã lưu
//             </h1>
//             <div className="w-full container flex flex-row items-start justify-start mx-auto pb-6">
//                 <div className="w-2/3 p-4">
//                     <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
//                         <img src={Heart} alt="Heart Icon" className="w-24 h-24 mb-4" />
//                     </div>
//                     <Pagination />
//                 </div>
//                 <div className="w-1/3 p-4">
//                     <div className="bg-white p-4 rounded-lg shadow-md mb-4">
//                         <h2 className="text-xl font-bold mb-2">Bài viết đã lưu</h2>
//                         <ul className="list-none text-gray-700">
//                             {savedPosts.length > 0 ? (
//                                 savedPosts.map((post) => (
//                                     <li key={post.id} className="flex items-center mb-2">
//                                         <i className="fas fa-newspaper text-2xl mr-2"></i>
//                                         <a href={`/post/${post.id}`} className="hover:text-blue-500">
//                                             {post.title}
//                                         </a>
//                                     </li>
//                                 ))
//                             ) : (
//                                 <p>Không có tin nào đã lưu.</p>
//                             )}
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//             <div className='my-6 w-full'>
//                 <Contact />
//             </div>
//             <br />
//             <hr className='w-4/5 h-[2px] bg-gray-300 container mx-auto' />
//             <div className='w-3/5 container pt-6'>
//                 <Footer />
//             </div>
//         </div>
//     );
// }

// export default ListPostsSaved;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Navigation from './Navigation';
import Contact from '../../components/Contact';
import Footer from './Footer';
import Heart from '../../assets/Heart.jpg';
import Pagination from './Pagination';
import { useSelector } from 'react-redux';
import Item from '../../components/Item'; // Import the Item component

const ListPostsSaved = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useSelector(state => state.auth);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            setLoading(true); // Bắt đầu tải dữ liệu
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/user/tenants/listPostSaved?page=${page}`, {
                    headers: {
                        'token': `${token}`
                    }
                });
                if (response.data.err === 0) {
                    setSavedPosts(response.data.msg.listPost); // Cập nhật danh sách bài viết đã lưu
                } else {
                    console.error('Error fetching saved posts:', response.data.msg);
                }
            } catch (error) {
                console.error('Error fetching saved posts:', error);
            } finally {
                setLoading(false); // Kết thúc tải dữ liệu
            }
        };

        fetchSavedPosts();
    }, [page, token]);

    if (loading) {
        return <div>Loading...</div>; // Thông báo đang tải
    }

    return (
        <div className="w-full flex flex-col items-center h-full mx-auto">
            <Header />
            <Navigation />
            <h1 className="text-3xl font-medium py-4 w-full ml-7 container mt-5 ">
                Tin đã lưu
            </h1>
            <div className="w-full container flex flex-row items-start justify-start mx-auto pb-6">
                <div className="w-2/3 p-4">
                    {/* Render saved posts */}
                    {savedPosts.length > 0 ? (
                        savedPosts.map((post) => (
                            <Item
                                key={post.id}
                                address={`${post.Address?.detail_address}, ${post.Address?.district}, ${post.Address?.city}`}
                                attributes={{
                                    price: post?.price,
                                    acreage: post?.acreage
                                }}
                                description={post?.description}
                                images={post?.images}
                                title={post?.title}
                                user={{
                                    name: `${post?.user?.firstName} ${post?.user?.lastName}`,
                                    phone: post?.user?.phone,
                                    img_avt: post?.user?.img_avt
                                }}
                                id={post?.id}
                            />
                        ))
                    ) : (
                        <p>Không có tin nào đã lưu.</p>
                    )}
                    <Pagination page={page} setPage={setPage} />
                </div>
                <div className="w-1/3 p-4">
                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <h2 className="text-xl font-bold mb-2">Bài viết đã lưu</h2>
                        <ul className="list-none text-gray-700">
                            {savedPosts.length > 0 ? (
                                savedPosts.map((post) => (
                                    <li key={post.id} className="flex items-center mb-2">
                                        <i className="fas fa-newspaper text-2xl mr-2"></i>
                                        <a href={`/post/${post.id}`} className="hover:text-blue-500">
                                            {post.title}
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
