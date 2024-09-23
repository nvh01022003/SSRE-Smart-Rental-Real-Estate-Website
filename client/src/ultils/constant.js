import hcm from '../assets/hcm.jpg'
import hn from '../assets/hn.jpg'
import dn from '../assets/dn.jpg'

export const path = {
    HOME: '/*',
    HOME__PAGE: ':page',
    LOGIN: 'login',
    CHO_THUE_CAN_HO: 'cho-thue-can-ho',
    CHO_THUE_MAT_BANG: 'cho-thue-mat-bang',
    NHA_CHO_THUE: 'nha-cho-thue',
    CHO_THUE_PHONG_TRO: 'cho-thue-phong-tro',
    DETAL_POST__TITLE__POSTID: 'chi-tiet/:title/:postId',
    SEARCH: 'tim-kiem',
    SYSTEM: '/he-thong/*',
    CREATE_POST: 'tao-moi-bai-dang'
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
    },
    {
        name: 'Hà Nội',
        image: hn,
        id: 'hn',
    },
    {
        name: 'Đà nẵng',
        image: dn,
        id: 'dn',
    },
]
