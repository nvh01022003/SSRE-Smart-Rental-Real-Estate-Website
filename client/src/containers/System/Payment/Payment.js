import React, { useState, useEffect } from 'react';
import bankTransfer from '../../../assets/bankTransfer.png';
import momo_icon from '../../../assets/momo_icon.svg'
import { path } from '../../../ultils/constant'; // Thêm import cho path
import { useNavigate, Route, Routes } from 'react-router-dom';
import DepositeHistory from './DepositeHistory';
import HistoryPayment from './HistoryPayment';
import Momo from './Momo';
import BankTransfer from './BankTransfer';
import { useSelector } from 'react-redux';
import axios from 'axios';
import styled from 'styled-components';
import momo from '../../../assets/momo.png'
import credit from '../../../assets/credit.svg';
import ServicePrice from './ServicePrice';
import { Breadcrumb } from '../../../components';
const ButtonBase = styled.button`
  display: inline-block;
  width: 90px;
  height: 90px;
  background: #f1f1f1;
  margin: 10px;
  border-radius: 30%;
  box-shadow: 0 5px 15px -5px #00000070;
  color: #3498db;
  overflow: hidden;
  position: relative;
  transition: 0.2s linear;

  img {
    line-height: 90px;
    font-size: 26px;
    transition: 0.2s linear;
    position: relative;
    z-index: 1;
  }

  &:hover {
    color: #f1f1f1;
  }

  &::before {
    content: "";
    position: absolute;
    width: 120%;
    height: 120%;
    background: #3498db;
    transform: rotate(45deg);
    left: -110%;
    top: 90%;
    z-index: 0;
  }

  &:hover::before {
    animation: slideAnimation 0.7s 1;
    top: -10%;
    left: -10%;
  }

  @keyframes slideAnimation {
    0% {
      left: -110%;
      top: 90%;
    }
    50% {
      left: 10%;
      top: -30%;
    }
    100% {
      top: -10%;
      left: -10%;
    }
  }
`;

const MomoButton = styled(ButtonBase)`
  &::after {
    content: "";
    background-image: url(${momo});
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const BankTransferButton = styled(ButtonBase)`
  &::after {
    content: "";
    background-image: url(${bankTransfer});
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const Payment = () => {
    const breadcrumbItems = [];
    const navigate = useNavigate();
    const [showMomoModal, setShowMomoModal] = useState(false);
    const token = useSelector(state => state.auth.token);
    const [balance, setBalance] = useState(null);

    const convertToWords = (amount) => {
        if (!amount) return '';
        const number = Number(amount);
        // Format the number as currency
        return number.toLocaleString('vi-VN') + ' đồng';
    };
    const handleMomoClick = () => {
        setShowMomoModal(true);
    };

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/user/showBalance', {
                    headers: {
                        'token': `${token}`,
                    }
                });
                //console.log(res)
                if (res.data.err === 0) {
                    setBalance(res.data.balance)
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
        fetchBalance();
    }, [token]);

    return (
        <Routes>
            <Route path={path.DEPOSITE_HISTORY} element={<DepositeHistory />} />
            <Route path={path.HISTORY_PAYMENT} element={<HistoryPayment />} />
            <Route path={path.MOMO} element={<Momo />} />
            <Route path={path.BANK_TRANSFER} element={<BankTransfer />} />
            <Route path={path.SERVICE_PRICE} element={<ServicePrice />} />
            <Route path="*" element={
                <div className="container mx-auto p-4 md:p-6">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center py-4 border-b border-gray-200">
                            Nạp tiền vào tài khoản
                        </h1>
                        <div className="flex flex-col md:flex-row gap-6 mt-6">
                            {/* Phần Chọn Phương Thức Nạp Tiền */}
                            <div className="flex-auto flex flex-col gap-8 bg-white p-6 rounded-lg shadow-lg items-center">
                                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                                    Mời bạn chọn phương thức nạp tiền
                                </h2>
                                <div className="flex flex-col md:flex-row space-x-0 md:space-x-28">
                                    <BankTransferButton onClick={() => navigate(path.BANK_TRANSFER)} style={{ width: '150px', height: '150px' }}>
                                        <img
                                            alt="Bank Transfer Icon"
                                            className="mx-auto mb-2"
                                            height="100"
                                            src={credit}
                                            width="100"
                                        />
                                        <div className="bg-gray-200 w-full py-2">
                                            <p className="font-semibold text-black">
                                                Chuyển khoản
                                            </p>
                                        </div>
                                    </BankTransferButton>

                                    <MomoButton onClick={() => navigate(path.MOMO)} style={{ width: '150px', height: '150px' }}>
                                        <img
                                            alt="MOMO Icon"
                                            className="mx-auto mb-2"
                                            height="100"
                                            src={momo_icon}
                                            width="100"
                                        />
                                        <div className="bg-gray-200 w-full py-2">
                                            <p className="font-semibold text-black">
                                                MOMO
                                            </p>
                                        </div>
                                    </MomoButton>
                                </div>
                            </div>

                            {/* Phần Thông Tin Số Dư và Tùy Chọn */}
                            <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg flex flex-col">
                                <div className="bg-gray-50 p-4 rounded-lg shadow-md text-center mb-6">
                                    <p className="text-lg font-semibold text-gray-700">
                                        Số dư tài khoản
                                    </p>
                                    <p className="text-2xl text-green-600 font-bold">
                                        {convertToWords(balance)}
                                    </p>
                                </div>
                                <div className="space-y-3 px-4 py-6 bg-gray-50 rounded-lg shadow-md">
                                    <button
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200 ease-in-out"
                                        onClick={() => navigate(path.DEPOSITE_HISTORY)}
                                    >
                                        Lịch sử nạp tiền
                                    </button>
                                    <button
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200 ease-in-out"
                                        onClick={() => navigate(path.HISTORY_PAYMENT)}
                                    >
                                        Lịch sử thanh toán
                                    </button>
                                    <button
                                        onClick={() => navigate(path.SERVICE_PRICE)}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200 ease-in-out">
                                        Bảng giá dịch vụ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            } />
        </Routes>

    );
}

export default Payment;
