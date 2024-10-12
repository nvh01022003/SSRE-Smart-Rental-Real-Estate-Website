import React from 'react';
import { useNavigate } from 'react-router-dom';
import bankTransfer from '../../assets/bankTransfer.png';
import momoImage from '../../assets/momo.png';
import MomoModal from '../../components/MomoModal';
import Momo from '../../components/Momo'; // Ensure this import is correct

const Payment = () => {
    const navigate = useNavigate();
    const [showMomoModal, setShowMomoModal] = React.useState(false);

    const handleMomoClick = () => {
        setShowMomoModal(true);
    };

    return (
        <div className='px-6'>
            <h1 className='text-3xl font-medium py-4 border-b border-gray-200'>
                Nạp tiền vào tài khoản
            </h1>
            <div className='flex gap-4'>
                <div className="py-4 flex flex-col gap-8 flex-auto">
                    <div className="bg-green-100 p-4 rounded mb-6">
                        <p>Nạp từ 50.000 đến dưới 1.000.000 tặng 10%</p>
                        <p>Nạp từ 1.000.000 đến dưới 2.000.000 tặng 20%</p>
                        <p>Nạp từ 2.000.000 trở lên tặng 25%</p>
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1 bg-white p-6 rounded shadow mb-6 col-md-4">
                            <h2 className="text-xl font-semibold mb-4">
                                Mời bạn chọn phương thức nạp tiền
                            </h2>
                            <div className="flex space-x-4">
                                <div className="bg-gray-100 p-4 rounded-lg shadow text-center method-item group flex-1 hover:ring-2 hover:ring-blue-500">
                                    <button className="flex flex-col items-center w-full">
                                        <div className="method-item-icon mb-2">
                                            <img
                                                alt="Bank Transfer Icon"
                                                className="mx-auto"
                                                height="100"
                                                src={bankTransfer}
                                                width="100"
                                            />
                                        </div>
                                        <div className="bg-gray-200 w-full py-2 group-hover:border-2 group-hover:border-blue-500">
                                            <p className="font-semibold text-black">
                                                Chuyển khoản
                                            </p>
                                        </div>
                                    </button>
                                </div>

                                <div className="bg-gray-100 p-4 rounded-lg shadow text-center method-item group flex-1">
                                    <button onClick={handleMomoClick} className="flex flex-col items-center w-full">
                                        <div className="method-item-icon mb-2">
                                            <img
                                                alt="MOMO Icon"
                                                className="mx-auto"
                                                height="100"
                                                src={momoImage}
                                                width="100"
                                            />
                                        </div>
                                        <div className="bg-gray-200 w-full py-2">
                                            <p className="font-semibold text-black">
                                                MOMO
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/3 bg-white p-6 rounded shadow mb-6 col-md-3">
                            <div className="bg-white p-4 rounded shadow text-center mb-6">
                                <p className="text-lg font-semibold">
                                    Số dư tài khoản
                                </p>
                                <p className="text-2xl text-green-600 font-bold">
                                    0đ
                                </p>
                            </div>
                            <div className="space-y-2">
                                <button
                                    className="w-full bg-gray-500 text-white py-2 rounded btn-secondary"
                                    onClick={() => navigate('/he-thong/lich-su-nap-tien')}
                                >
                                    Lịch sử nạp tiền
                                </button>
                                <button 
                                className="w-full bg-gray-500 text-white py-2 rounded btn-secondary"
                                onClick={() => navigate('/he-thong/lich-su-thanh-toan')}
                                >
                                    Lịch sử thanh toán
                                </button>
                                <button className="w-full bg-gray-500 text-white py-2 rounded btn-secondary">
                                    Bảng giá dịch vụ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Momo /> {/* Use Momo component if needed */}
            {showMomoModal && <MomoModal />}
           
        </div>
    );
}

export default Payment;
