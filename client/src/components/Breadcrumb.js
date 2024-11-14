import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x && x !== 'he-thong');

    // Đối tượng ánh xạ đường dẫn tới tên hiển thị
    const breadcrumbNames = {
        'tao-moi-bai-dang': 'Đăng tin cho thuê',
        'quan-ly-bai-dang': 'Quản lý tin đăng',
        'quan-ly-bai-dang/tin-da-xoa': 'Tin đã xóa',
        'thong-tin-ca-nhan': 'Thông tin cá nhân',
        'doi-mat-khau': 'Đổi mật khẩu',
        'nap-tien': 'Nạp tiền',
        'nap-tien/lich-su-nap-tien': 'Lịch sử nạp tiền',
        'nap-tien/lich-su-thanh-toan': 'Lịch sử thanh toán',
        'nap-tien/momo': 'Thanh toán qua MoMo',
        'nap-tien/chuyen-khoan': 'Thanh toán qua chuyển khoản',
    };

    return (
        <nav
            className="breadcrumb"
            style={{
                fontSize: '16px',
            }}
        >
            <Link 
                to="/" 
                replace 
                style={{ 
                    color: '#007bff', 
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => e.target.style.color = '#FFA500'}
                onMouseLeave={(e) => e.target.style.color = '#007bff'}
            >
                Trang chủ
            </Link>
            {pathnames.map((value, index) => {
                let to;

                // Kiểm tra giá trị của `value` và gán `to` tương ứng
                if (value === 'nap-tien') {
                    to = '/he-thong/nap-tien';
                } else if (value === 'quan-ly-bai-dang') {
                    to = '/he-thong/quan-ly-bai-dang';
                } else {
                    to = `/${pathnames.slice(0, index + 1).join('/')}`;
                }
            
                const fullPath = pathnames.slice(0, index + 1).join('/');
            

                // Sử dụng đối tượng ánh xạ để lấy tên hiển thị
                const name = breadcrumbNames[fullPath] || value;

                // Kiểm tra nếu đang ở trang hiện tại thì đổi màu và không cho click
                const isCurrentPage = (index === pathnames.length - 1);

                return (
                    <span key={to} style={{ color: isCurrentPage ? '#000' : '#007bff' }}>
                        {' / '}
                        {isCurrentPage ? (
                            <span style={{ cursor: 'default' }}>{name}</span>
                        ) : (
                            <Link 
                                to={to} 
                                replace 
                                style={{ 
                                    color: '#007bff', 
                                    textDecoration: 'none',
                                    transition: 'color 0.3s',
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#FFA500'}
                                onMouseLeave={(e) => e.target.style.color = '#007bff'}
                            >
                                {name}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;
