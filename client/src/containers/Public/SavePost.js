import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Heart from '../../assets/Heart.jpg'
import { path } from '../../ultils/constant';
import Header from './Header';
import { Contact } from '../../components';
import Footer from './Footer';
import Navigation from './Navigation';

const SavePost = () => {
    const navigate = useNavigate();
    const [likedPosts, setLikedPosts] = useState([]); // State to manage liked posts

    const handleLikePost = (post) => {
        setLikedPosts((prevLikedPosts) => [...prevLikedPosts, post]); // Add post to liked posts
    };

    return (
        <div className='w-full flex flex-col items-center h-full mx-auto'>
            <Header />
            <Navigation />
            <h1 className='text-3xl font-medium py-4 w-full ml-7 container mt-5 '>
                        Tin đã lưu
                    </h1>
            <div className="w-full container flex flex-row items-start justify-start mx-auto pb-6">
                <div className="w-2/3 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
                        <img src={Heart} alt="Heart Icon" className="w-24 h-24 mb-4" />
                        {likedPosts.length === 0 ? ( // Check if there are liked posts
                            <p className="text-red-500 text-lg">Danh sách rỗng.</p>
                        ) : (
                            <ul className="list-none">
                                {likedPosts.map((post, index) => ( // Display liked posts
                                    <li key={index} className="text-lg">{post}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="w-1/3 p-4">
                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <h2 className="text-xl font-bold mb-2">Danh mục cho thuê</h2>
                        <ul className="list-none text-gray-700">
                            <li className="flex items-center justify-between mb-2">
                                <i className="fas fa-home text-2xl mr-2"></i>
                                <a href="#" className="flex-1 hover:text-blue-500">Cho thuê phòng trọ</a>
                                <span>(78.106)</span>
                            </li>
                            <li className="flex items-center justify-between mb-2">
                                <i className="fas fa-building text-2xl mr-2"></i>
                                <a href="#" className="flex-1 hover:text-blue-500">Cho thuê nhà nguyên căn</a>
                                <span>(11.938)</span>
                            </li>
                            <li className="flex items-center justify-between mb-2">
                                <i className="fas fa-city text-2xl mr-2"></i>
                                <a href="#" className="flex-1 hover:text-blue-500">Cho thuê căn hộ</a>
                                <span>(13.807)</span>
                            </li>
                            <li className="flex items-center justify-between mb-2">
                                <i className="fas fa-store text-2xl mr-2"></i>
                                <a href="#" className="flex-1 hover:text-blue-500">Cho thuê mặt bằng</a>
                                <span>(3.356)</span>
                            </li>
                            <li className="flex items-center justify-between mb-2">
                                <i className="fas fa-user-friends text-2xl mr-2"></i>
                                <a href="#" className="flex-1 hover:text-blue-500">Tìm người ở ghép</a>
                                <span>(15.871)</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-2">Bài viết mới</h2>
                        <ul className="list-none text-gray-700">
                            <li className="flex items-center mb-2">
                                <i className="fas fa-newspaper text-2xl mr-2"></i>
                                <a href="#" className="hover:text-blue-500">Vấn nạn an toàn phòng cháy chữa cháy tại các nhà trọ cho thuê</a>
                            </li>
                            <li className="flex items-center mb-2">
                                <i className="fas fa-newspaper text-2xl mr-2"></i>
                                <a href="#" className="hover:text-blue-500">Tiền đặt cọc thuê phòng trọ có lấy lại được không?</a>
                            </li>
                            <li className="flex items-center mb-2">
                                <i className="fas fa-newspaper text-2xl mr-2"></i>
                                <a href="#" className="hover:text-blue-500">Đóng tiền thuê phòng trọ đầu tháng hay cuối tháng?</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='my-6 w-full '>
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

export default SavePost;
