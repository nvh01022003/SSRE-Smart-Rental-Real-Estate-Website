import icons from './icons'
import { FaDollarSign } from 'react-icons/fa'; // Importing relevant icons

const { ImPencil2, MdOutlineLibraryBooks, BiUserPin, AiOutlineLock, BiRocket, AiOutlineDollar } = icons

const memuSidebar = [
    {
        id: 1,
        text: 'Đăng tin cho thuê',
        path: '/he-thong/tao-moi-bai-dang',
        icon: <ImPencil2 />
    },
    {
        id: 2,
        text: 'Quản lý tin đăng',
        path: '/he-thong/quan-ly-bai-dang',
        icon: <MdOutlineLibraryBooks />
    },
    {
        id: 3,
        text: 'Thông tin tài khoản',
        path: '/he-thong/thong-tin-ca-nhan',
        icon: <BiUserPin />
    },
    {
        id: 4,
        text: 'Đổi mật khẩu',
        path: '/he-thong/doi-mat-khau',
        icon: <AiOutlineLock />
    },
    {
        id: 5,
        text: 'Nạp tiền',
        path: '/he-thong/nap-tien',
        icon: <AiOutlineDollar />
    },
    {
        id: 6,
        text: 'Nâng cấp tài khoản',
        path: '/he-thong/nang-cap-tai-khoan',
        icon: <BiRocket />
    },
]

export default memuSidebar