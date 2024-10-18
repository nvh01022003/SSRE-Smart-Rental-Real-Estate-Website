const { Post } = require('../../models/index');
// show all post in system
const showAllPost = async () => {
    const post = await Post.findAll()
    return post
}
module.exports = {
    showAllPost
}