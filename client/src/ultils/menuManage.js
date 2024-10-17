import icons from './icons'

const { ImPencil2, MdOutlineLibraryBooks, BiUserPin, BiMoney, FcLike } = icons

const menuManage = [
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
        id: 4,
        text: 'Thông tin tài khoản',
        path: '/he-thong/thong-tin-ca-nhan',
        icon: <BiUserPin />
    },
    {
        id: 6,
        text: 'Nạp tiền',
        path: '/he-thong/nap-tien',
        icon: <BiMoney />
    },
    {
        id: 7,
        text: 'Tin đã lưu',
        path: '/tin-da-luu',
        icon: <FcLike />
    }
]

export default menuManage