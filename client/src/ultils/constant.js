import hcm from '../assets/hcm.jpg'
import hn from '../assets/hn.jpg'
import dn from '../assets/dn.jpg'

export const path = {
    HOME: '/*',
    HOME__PAGE: ':page',
    REGISTER: 'register',
    LOGIN: 'login',
    FORGOT_PASS: 'login/quen-mat-khau',
    VALIDATE_CODE: 'login/quen-mat-khau/verify',
    RESET_PASS: 'login/quen-mat-khau/verify/dat-lai-mat-khau',
    CONTACT: 'lien-he',
    ABOUT_US: 'gioi-thieu',
    TERM_OF_USE: 'dieu-khoan-su-dung',
    CHO_THUE_CAN_HO: 'cho-thue-can-ho',
    CHO_THUE_MAT_BANG: 'cho-thue-mat-bang',
    NHA_CHO_THUE: 'nha-cho-thue',
    CHO_THUE_PHONG_TRO: 'cho-thue-phong-tro',
    DETAL_POST__TITLE__POSTID: 'chi-tiet/:title/:id',
    SEARCH: 'tim-kiem',
    SYSTEM: '/he-thong/*',
    CREATE_POST: 'tao-moi-bai-dang',
    PERSONAL_INFO: 'thong-tin-ca-nhan',
    MANAGE_POST: 'quan-ly-bai-dang',
    CHANGE_PASS: 'doi-mat-khau',
    LIST_POSTS_SAVED: 'tin-da-luu',
    UPGRADE_ACCOUNT: 'nang-cap-tai-khoan',
    PAYMENT: 'nap-tien/*',
    HISTORY_PAYMENT: 'lich-su-thanh-toan',
    DEPOSITE_HISTORY: 'lich-su-nap-tien',
    MOMO: 'momo',
    SAVE_POST: 'tin-da-luu',
    BANK_TRANSFER: 'chuyen-khoan',

}

export const text = {
    HOME_TITLE: 'Cho Thuê Bất Động Sản Giá Rẻ, Tiện Nghi, Mới Nhất 2024',
    HOME_DESCRIPTION: "Cho thuê bất động sản - Nền tảng số 1 về bất động sản giá phải chăng mới nhất vào năm 2024. Tất cả bất động sản cho thuê với giá tốt nhất. Tìm bất động sản cho thuê tốt nhất với giá tốt nhất.",
}

export const location = [
    {
        id: 'hcm',
        name: 'Hồ Chí Minh',
        image: hcm,
        path: 'http://localhost:3000/tim-kiem?provinceCode=79',
    },
    {
        name: 'Hà Nội',
        image: hn,
        id: 'hn',
        path: 'http://localhost:3000/tim-kiem?provinceCode=01',
    },
    {
        name: 'Đà nẵng',
        image: dn,
        id: 'dn',
        path: 'http://localhost:3000/tim-kiem?provinceCode=48',
    },
]
