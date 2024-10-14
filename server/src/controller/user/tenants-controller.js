const tenanstService = require("../../services/user-service/tenants-services")

// show info user
const showInfoUser = async (req, res) => {
    const userId = req.user.id
    try {
        const response = await tenanstService.getInfoUser(userId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showInfoUser: ' + error
        })
    }
}
// change info user
const changeInfo = async (req, res) => {
    const userId = req.user.id
    const userUpdate = req.body
    console.log(userUpdate)
    try {
        const response = await tenanstService.changeInfoUser(userId, userUpdate)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller changeInfo: ' + error
        })
    }
}
// save post
const savaPost = async (req, res) => {
    const userId = req.user.id
    const postId = req.params.id
    try {
        const response = await tenanstService.savePost(userId, postId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller savaPost: ' + error
        })
    }
}
// report post
const reportPost = async (req, res) => {
    const userId = req.user.id
    const postId = req.params.id
    const desc = req.body.desc
    try {
        const response = await tenanstService.reportPost(userId, postId, desc)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller reportPost: ' + error
        })
    }
}
// show list post saved
const listPostSaved = async (req, res) => {
    const userId = req.user.id
    try {
        const response = await tenanstService.listPostSaved(userId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller listPostSaved: ' + error
        })
    }
}
// find post by min price and max price
const findPostByPrice = async (req, res) => {
    const minPrice = req.query.minPrice
    const maxPrice = req.query.maxPrice
    try {
        const response = await tenanstService.findPostByPrice(minPrice, maxPrice)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller findPostByPrice: ' + error
        })
    }
}
// find post by location
const findPostByLocation = async (req, res) => {
    const location = req.query.location
    try {
        const response = await tenanstService.findPostByLocation(location)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller findPostByLocation: ' + error
        })
    }
}
// delete post saved
const deletePostSaved = async (req, res) => {
    const userId = req.user.id
    const postId = req.params.id
    try {
        const response = await tenanstService.deletePostSaved(userId, postId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller deletePostSaved: ' + error
        })
    }
}
// find post by acreage
const findPostByAcreage = async (req, res) => {
    const minAcreage = req.query.minAcreage
    const maxAcreage = req.query.maxAcreage
    try {
        const response = await tenanstService.findPostByAcreage(minAcreage, maxAcreage)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller findPostByAcreage: ' + error
        })
    }
}
// pagination post
const paginationPost = async (req, res) => {
    const page = req.query.page
    const limit = req.query.limit
    try {
        const response = await tenanstService.paginationPost(page, limit)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller paginationPost: ' + error
        })
    }
}
// find post by all
const findPostByAll = async (req, res) => {
    const minPrice = req.query.minPrice
    const maxPrice = req.query.maxPrice
    const location = req.query.location
    const minAcreage = req.query.minAcreage
    const maxAcreage = req.query.maxAcreage
    const category = req.query.category
    try {
        const response = await tenanstService.findPostByAll(minPrice, maxPrice, location, minAcreage, maxAcreage, category)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller findPostByAll: ' + error
        })
    }
}
module.exports = {
    showInfoUser,
    changeInfo,
    savaPost,
    reportPost,
    listPostSaved,
    findPostByPrice,
    findPostByLocation,
    deletePostSaved,
    findPostByAcreage,
    paginationPost,
    findPostByAll

}