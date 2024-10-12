import icons from './icons'

const { ImPencil2, MdOutlineLibraryBooks, BiUserPin, BiMoney } = icons

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
        id: 6,
        text: 'Ví Tiền',
        path: '/he-thong/vi-tien',
        icon: <BiMoney/>
    },
    {
        id: 4,
        text: 'Thông tin tài khoản',
        path: '/he-thong/thong-tin-ca-nhan',
        icon: <BiUserPin />
    }
]

export default menuManage