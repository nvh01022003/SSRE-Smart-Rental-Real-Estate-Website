import icons from './icons'

const { ImPencil2, MdOutlineLibraryBooks, BiUserPin, BiMoney} = icons

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
        id: 4,
        text: 'Thông tin cá nhân',
        path: '/he-thong/thong-tin-ca-nhan',
        icon: <BiUserPin />
    },
    {
        id: 6,
        text: 'Ví tiền tài khoản',
        path: '/he-thong/vi-tien',
        icon: <BiMoney/>
    },
    {
        id: 5,
        text: 'Đổi mật khẩu',
        path: '/he-thong/doi-mat-khau',
        icon: <BiUserPin />
    }
]

export default memuSidebar