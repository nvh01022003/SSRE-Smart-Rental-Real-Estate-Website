// import React, { useState } from 'react';
// const BankTransfer = () => {
//     const copyToClipboard = (text) => {
//         navigator.clipboard.writeText(text).then(() => {
//             alert('Đã sao chép: ' + text);
//         }, (err) => {
//             console.error('Không thể sao chép: ', err);
//         });
//     };
//     return (
//         <div className="p-8">
//             <h1 className="text-3xl font-bold border-b border-gray-200 mb-4 py-4">Chuyển khoản</h1>
//             <div className="mb-4 p-4 bg-red-100">
//                 <h2 className="font-bold text-2x1">Đối với tài khoản mới đăng kí</h2>
//                 <p>Tặng thêm + 50% cho lần đầu tiên tới thiểu 100.000đ trong vòng 5 ngày sau khi đăng ký tài khoản</p>
//             </div>
//             <div className="mb-4 p-4 bg-green-100">
//                 <p>Nạp từ 50.000 đến dưới 1.000.000 tặng 10%</p>
//                 <p>Nạp từ 1.000.000 đến dưới 2.000.000 tặng 20%</p>
//                 <p>Nạp từ 2.000.000 trở lên tặng 25%</p>
//             </div>
//             <div className="mb-4 p-4 bg-yellow-100">
//                 <h2 className="font-bold text-2x1">Lưu ý quan trọng:</h2>
//                 <p>Nội dung chuyển tiền bạn vui lòng ghi đúng thông tin sau:</p>
//                 <p className="font-bold text-red-600">"SRRE - 311202 - 0766718469"</p>
//                 <p>Trong đó 311202 là mã thành viên, 0766718469 là số điện thoại của bạn đăng ký trên website SRRE.com</p>
//                 <p>Xin cảm ơn!</p>
//             </div>
//             <h2 className="text-xl font-bold mb-4">Vui lòng lựa chọn chuyển vào một trong các tài khoản dưới đây:</h2>
//             <table className="min-w-full bg-white border border-gray-300">
//                 <thead>
//                     <tr>
//                         <th className="border border-gray-300 p-2 text-center">Ngân hàng</th>
//                         <th className="border border-gray-300 p-2 text-center">Chủ tài khoản</th>
//                         <th className="border border-gray-300 p-2 text-center">Số tài khoản</th>
//                         <th className="border border-gray-300 p-2 text-center">Chi nhánh</th>
//                         <th className="border border-gray-300 p-2 text-center">Nội dung chuyển khoản</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td className="border border-gray-300 p-2 text-center text-red-600">VIETCOMBANK - NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN NGOẠI THƯƠNG VIỆT NAM</td>
//                         <td className="border border-gray-300 p-2 text-center">Công ty TNHH LBKCORP</td>
//                         <td className="border border-gray-300 p-2 text-center">
//                             0071001050516
//                             <div className="flex justify-center mt-2">
//                                 <button
//                                     className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-400"
//                                     onClick={() => copyToClipboard('0071001050516')}
//                                 >
//                                     Sao chép
//                                 </button>
//                             </div>
//                         </td>
//                         <td className="border border-gray-300 p-2 text-center">CN HỒ CHÍ MINH</td>
//                         <td className="border border-gray-300 p-2 text-center">
//                             Nội dung chuyển khoản, bạn ghi rõ: "PT123 - 146020 - 0774641663"
//                             <div className="flex justify-center mt-2">
//                                 <button
//                                     className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-400"
//                                     onClick={() => copyToClipboard('PT123 - 146020 - 0774641663')}
//                                 >
//                                     Sao chép
//                                 </button>
//                             </div>
//                         </td>
//                     </tr>
//                     <tr>
//                         <td className="border border-gray-300 p-2 text-center text-red-600">ACB - NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN Á CHÂU</td>
//                         <td className="border border-gray-300 p-2 text-center">Công ty TNHH LBKCORP</td>
//                         <td className="border border-gray-300 p-2 text-center">
//                             150590888
//                             <div className="flex justify-center mt-2">
//                                 <button
//                                     className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-400"
//                                     onClick={() => copyToClipboard('150590888')}
//                                 >
//                                     Sao chép
//                                 </button>
//                             </div>
//                         </td>
//                         <td className="border border-gray-300 p-2 text-center">Đông Sài Gòn</td>
//                         <td className="border border-gray-300 p-2 text-center">
//                             Nội dung chuyển khoản, bạn ghi rõ: "PT123 - 146020 - 0774641663"
//                             <div className="flex justify-center mt-2">
//                                 <button
//                                     className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-400"
//                                     onClick={() => copyToClipboard('PT123 - 146020 - 0774641663')}
//                                 >
//                                     Sao chép
//                                 </button>
//                             </div>
//                         </td>
//                     </tr>
//                 </tbody>

//             </table>
//         </div>
//     );
// }
// export default BankTransfer;


import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const BankTransfer = () => {
    const [selectedAmount, setSelectedAmount] = useState(50000);
    const [customAmount, setCustomAmount] = useState('');
    const token = useSelector(state => state.auth.token);

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
            const paymentMethod = 'payOS';

            const response = await axios.post('http://localhost:5000/api/v1/user/payment', { amount, paymentMethod }, {
                headers: {
                    'token': `${token}`,
                }
            });

            if (response.status === 200) {
                // Điều hướng người dùng tới trang thanh toán payOS
                window.location.href = response.data.payUrl;
            } else {
                console.log("Error:", response.data.message);
            }
        } catch (error) {
            console.error("Failed to create payment:", error);
        }
    };

    return (
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
    );
};


export default BankTransfer;
