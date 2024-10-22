import axiosConfig from '../axiosConfig'
import axios from 'axios'

export const apiGetPosts = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/post/all',
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})
export const apiGetPostsLimit = (query) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/post/limit`,
            params: query
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})
export const apiGetNewPosts = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/post/new-post`,
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})
export const apiUploadImages = (images) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'post',
            url: `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload/`,
            data: images,
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})
export const apiSavePost = async (postId, token) => {
    try {
        // Gửi yêu cầu POST tới BE với `postId` và thêm `token` vào header để xác thực
        const response = await axiosConfig.post(`/api/v1/user/savePost/${postId}`, {}, {
            headers: {
                token: token // Token để xác thực
            }
        });
        
        // Kiểm tra phản hồi từ BE
        console.log('API Save Post Response:', response);
        return response.data;  // Trả về dữ liệu từ BE (nếu thành công)
    } catch (error) {
        // Nếu BE trả về lỗi
        if (error.response) {
            console.error('API Save Post Error:', error.response.data);
            throw error.response.data;  // Trả lỗi ra FE để xử lý
        } else {
            throw new Error('Something went wrong while saving the post');
        }
    }
}