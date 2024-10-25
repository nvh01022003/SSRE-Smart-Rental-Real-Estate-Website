import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Navigation from './Navigation';
import Contact from '../../components/Contact';
import Footer from './Footer';
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
                console.log(response); // Debug log
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

    const handleToggleStar = async (isStarred, id) => {
        if (isStarred) {
            // If starred, remove the post
            try {
                await axios.delete(`http://localhost:5000/api/v1/user/tenants/deletePostSaved/${id}`, {
                    headers: { 'token': `${token}` }
                });
                // Remove the post from the savedPosts state
                setSavedPosts((prevPosts) => prevPosts.filter(post => post.Post.id !== id));
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        } else {
            // If unstarred, add your logic to save the post again if needed
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Thông báo đang tải
    }

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
                                address={`${post.Post.Address?.detail_address}, ${post.Post.Address?.district}, ${post.Post.Address?.city}`} // Correctly accessing the nested Address object
                                attributes={{
                                    price: post.Post.price, // Access price directly from post
                                    acreage: post.Post.acreage // Access acreage directly from post
                                }}
                                description={post.Post.description} // Access description directly from post
                                images={post.Post.Images[0].img_url_list} // Access Images array from post
                                title={post.Post.title} // Access title directly from post
                                user={{
                                    name: `${post.Post.User?.firstName} ${post.Post.User?.lastName}`, // Access User object for name
                                    phone: post.Post.User?.phone, // Access phone from User object
                                    img_avt: post.Post.User?.img_avt // Access avatar image from User object
                                }}
                                id={post.Post.id} // Access id directly from post
                                starred={true} // Set starred to true by default
                                onToggleStar={(newStarredState) => handleToggleStar(newStarredState, post.Post.id)} // Pass the toggle function
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
