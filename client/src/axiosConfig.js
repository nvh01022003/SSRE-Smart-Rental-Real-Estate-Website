import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL
})

const getTokenFromPersistAuth = () => {
    const persistAuth = localStorage.getItem('persist:auth');
    if (persistAuth) {
        const authState = JSON.parse(persistAuth);
        const token = authState?.token?.slice(1, -1); // Xóa dấu ngoặc kép khỏi chuỗi mã thông báo
        return token;
    }
    return null;
};

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    const token = getTokenFromPersistAuth();
    //let token = window.localStorage.getItem('persist:auth') && JSON.parse(window.localStorage.getItem('persist:auth'))?.token?.slice(1, -1)
    config.headers = {
        authorization: token ? `Bearer ${token}` : null
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // refresh token
    return response;
}, function (error) {
    return Promise.reject(error);
});


export default instance