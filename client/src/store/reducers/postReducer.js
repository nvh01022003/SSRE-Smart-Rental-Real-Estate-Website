import actionTypes from "../actions/actionTypes";

const initState = {
    posts: [],
    msg: '',
    count: 0,
    newPosts: [],
    savedPosts: [], // Thêm savedPosts để lưu bài viết đã lưu
    error: null     // Thêm error để lưu lỗi nếu có
};

const postReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_POSTS:
        case actionTypes.GET_POSTS_LIMIT:
            return {
                ...state,
                posts: action.posts || [],
                msg: action.msg || '',
                count: action.count || 0
            };
        case actionTypes.GET_NEW_POST:
            return {
                ...state,
                msg: action.msg || '',
                newPosts: action.newPosts || []
            };

        // Xử lý lưu bài viết thành công
        case actionTypes.SAVE_POST_SUCCESS:
            return {
                ...state,
                savedPosts: [...state.savedPosts, action.data],  // Thêm bài viết mới vào danh sách đã lưu
                error: null,  // Xóa lỗi (nếu có) sau khi thành công
            };

        // Xử lý lỗi khi lưu bài viết thất bại
        case actionTypes.SAVE_POST_FAIL:
            return {
                ...state,
                error: action.data  // Cập nhật thông báo lỗi
            };

        default:
            return state;
    }
};

export default postReducer;