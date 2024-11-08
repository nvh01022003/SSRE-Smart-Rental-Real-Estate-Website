import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const FormLayout = ({ children, title }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/your/background-image.jpg)' }}>
            <div className="bg-white w-full max-w-md p-8 rounded-md shadow-lg">
                <div className="text-center mb-6">
                    <img src={logo} alt="Smart Rental Real Estate" className="mx-auto h-16" />
                    <h2 className="text-2xl font-semibold mt-2">{title}</h2>
                </div>
                {children}
                <div className="mt-6 text-center">
                    <small>
                        {title === 'Đăng kí tài khoản' ? (
                            <>
                                Bạn đã có tài khoản?{' '}
                                <span onClick={() => navigate('/login')} className="text-blue-500 hover:underline cursor-pointer">
                                    Đăng nhập ngay
                                </span>
                            </>
                        ) : (
                            <>
                                Bạn chưa có tài khoản?{' '}
                                <span onClick={() => navigate('/register')} className="text-blue-500 hover:underline cursor-pointer">
                                    Đăng kí ngay
                                </span>
                            </>
                        )}
                    </small>
                </div>
            </div>
        </div>
    );
};

export default FormLayout;