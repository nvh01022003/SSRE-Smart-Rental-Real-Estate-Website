import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Breadcrumb } from '../../../components';

const Momo = () => {
  const [selectedAmount, setSelectedAmount] = useState(50000);
  const [customAmount, setCustomAmount] = useState('');
  const token = useSelector(state => state.auth.token);
  const breadcrumbItems = []

  const handleAmountChange = (event) => {
    const amount = Number(event.target.value);
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomAmountChange = (event) => {
    setSelectedAmount(null);
    setCustomAmount(event.target.value);
  };

  const convertToWords = (amount) => {
    if (!amount) return '';
    const number = Number(amount);
    // Format the number as currency
    return number.toLocaleString('vi-VN') + ' đồng'; // {{ edit_1 }}
  };

  const renderAmountMessage = () => {
    const amountToDisplay = customAmount || selectedAmount;
    if (amountToDisplay) {
      return (
        <p className="text-green-600 mt-2">
          Số tiền nạp: {convertToWords(amountToDisplay)}
        </p>
      );
    }
    return null;
  };

  const handleSubmitPayment = async () => {
    try {
      const amount = customAmount || selectedAmount;
      const paymentMethod = 'MoMo';

      const response = await axios.post('http://localhost:5000/api/v1/user/payment', { amount, paymentMethod }, {
        headers: {
          'token': `${token}`,
        }
      });

      if (response.status === 200) {
        // Điều hướng người dùng tới trang thanh toán MoMo
        window.location.href = response.data.payUrl;
      } else {
        console.log("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Failed to create payment:", error);
    }
  };

  return (
    <div><Breadcrumb items={breadcrumbItems} />
      <div>
        <h1 className="text-2xl font-bold mb-4">Chọn số tiền cần nạp</h1>

        <p className="font-medium mb-3">Chọn nhanh số tiền cần nạp</p>
        <div className="flex flex-wrap mb-4">
          {[50000, 100000, 200000, 500000, 1000000, 2000000, 5000000].map((amount) => (
            <label key={amount} className="flex items-center mr-4 mb-2">
              <input
                type="radio"
                value={amount}
                checked={selectedAmount === amount}
                onChange={handleAmountChange}
                className="form-radio text-blue-600 h-4 w-4 mr-2"
              />
              {amount.toLocaleString('vi-VN')} đ
            </label>
          ))}
        </div>

        <p className="font-medium mb-3">Hoặc nhập số tiền cần nạp</p>
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Nhập số tiền cần nạp"
            value={customAmount}
            onChange={handleCustomAmountChange}
            className="border border-gray-300 rounded-md p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-2 text-gray-500">vnd</span>
        </div>

        {renderAmountMessage()}
        <button className="bg-blue-500 text-white px-2 py-1 rounded-lg w-1/2 hover:bg-blue-600" onClick={handleSubmitPayment}>
          Tiếp tục
        </button>

        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6">
          <p className="font-bold">Lưu ý quan trọng:</p>
          <p>Trong quá trình thanh toán, bạn vui lòng <strong>KHÔNG ĐÓNG TRÌNH DUYỆT</strong>.</p>
          <p>
            Nếu gặp khó khăn trong quá trình thanh toán, xin liên hệ <strong>0917686101</strong> để chúng tôi hỗ trợ bạn.
          </p>
        </div>
      </div>
    </div>
  );
};


export default Momo;
