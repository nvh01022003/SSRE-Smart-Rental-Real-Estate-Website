import React, { useState } from 'react';
const BankTransfer = () => {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Đã sao chép: ' + text);
        }, (err) => {
            console.error('Không thể sao chép: ', err);
        });
    };
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold border-b border-gray-200 mb-4 py-4">Chuyển khoản</h1>
            <div className="mb-4 p-4 bg-red-100">
                <h2 className="font-bold text-2x1">Đối với tài khoản mới đăng kí</h2>
                <p>Tặng thêm + 50% cho lần đầu tiên tới thiểu 100.000đ trong vòng 5 ngày sau khi đăng ký tài khoản</p>
            </div>
            <div className="mb-4 p-4 bg-green-100">
                <p>Nạp từ 50.000 đến dưới 1.000.000 tặng 10%</p>
                <p>Nạp từ 1.000.000 đến dưới 2.000.000 tặng 20%</p>
                <p>Nạp từ 2.000.000 trở lên tặng 25%</p>
            </div>
            <div className="mb-4 p-4 bg-yellow-100">
                <h2 className="font-bold text-2x1">Lưu ý quan trọng:</h2>
                <p>Nội dung chuyển tiền bạn vui lòng ghi đúng thông tin sau:</p>
                <p className="font-bold text-red-600">"SRRE - 311202 - 0766718469"</p>
                <p>Trong đó 311202 là mã thành viên, 0766718469 là số điện thoại của bạn đăng ký trên website SRRE.com</p>
                <p>Xin cảm ơn!</p>
            </div>
            <h2 className="text-xl font-bold mb-4">Vui lòng lựa chọn chuyển vào một trong các tài khoản dưới đây:</h2>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2 text-center">Ngân hàng</th>
                        <th className="border border-gray-300 p-2 text-center">Chủ tài khoản</th>
                        <th className="border border-gray-300 p-2 text-center">Số tài khoản</th>
                        <th className="border border-gray-300 p-2 text-center">Chi nhánh</th>
                        <th className="border border-gray-300 p-2 text-center">Nội dung chuyển khoản</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300 p-2 text-center text-red-600">VIETCOMBANK - NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN NGOẠI THƯƠNG VIỆT NAM</td>
                        <td className="border border-gray-300 p-2 text-center">Công ty TNHH LBKCORP</td>
                        <td className="border border-gray-300 p-2 text-center">
                            0071001050516
                            <div className="flex justify-center mt-2">
                                <button
                                    className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-400"
                                    onClick={() => copyToClipboard('0071001050516')}
                                >
                                    Sao chép
                                </button>
                            </div>
                        </td>
                        <td className="border border-gray-300 p-2 text-center">CN HỒ CHÍ MINH</td>
                        <td className="border border-gray-300 p-2 text-center">
                            Nội dung chuyển khoản, bạn ghi rõ: "PT123 - 146020 - 0774641663"
                            <div className="flex justify-center mt-2">
                                <button
                                    className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-400"
                                    onClick={() => copyToClipboard('PT123 - 146020 - 0774641663')}
                                >
                                    Sao chép
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 p-2 text-center text-red-600">ACB - NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN Á CHÂU</td>
                        <td className="border border-gray-300 p-2 text-center">Công ty TNHH LBKCORP</td>
                        <td className="border border-gray-300 p-2 text-center">
                            150590888
                            <div className="flex justify-center mt-2">
                                <button
                                    className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-400"
                                    onClick={() => copyToClipboard('150590888')}
                                >
                                    Sao chép
                                </button>
                            </div>
                        </td>
                        <td className="border border-gray-300 p-2 text-center">Đông Sài Gòn</td>
                        <td className="border border-gray-300 p-2 text-center">
                            Nội dung chuyển khoản, bạn ghi rõ: "PT123 - 146020 - 0774641663"
                            <div className="flex justify-center mt-2">
                                <button
                                    className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-400"
                                    onClick={() => copyToClipboard('PT123 - 146020 - 0774641663')}
                                >
                                    Sao chép
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>
    );
}
export default BankTransfer;