const tenanstService = require("../../services/user-service/tenants-services")
const helperService = require("../../services/tools/userSearches-service")
const jwt = require("jsonwebtoken");
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
    const page = parseInt(req.query.page)
    try {
        const response = await tenanstService.listPostSaved(userId, page)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller listPostSaved: ' + error
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
// find post by all condition
const findPostByAll = async (req, res) => {
    const minPrice = req.body.minPrice
    const maxPrice = req.body.maxPrice
    const location = req.body.location
    const minAcreage = req.body.minAcreage
    const maxAcreage = req.body.maxAcreage
    const categoryCode = req.body.category
    const page = parseInt(req.query.page)
    const token = req.headers["token"];
    try {
        const response = await tenanstService.findPostByAll(minPrice, maxPrice, location, minAcreage, maxAcreage, categoryCode, page)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller findPostByAll: ' + error
        })
    }
}
// show list post by page pagination
const listPostByPage = async (req, res) => {
    const page = req.params.page
    try {
        const response = await tenanstService.listPostByPage(page)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller listPostByPage: ' + error
        })
    }
}
// total Page
const totalPage = async (req, res) => {
    try {
        const response = await tenanstService.totalPage()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller totalPage: ' + error
        })
    }
}
// show dateil post
const showDetailPost = async (req, res) => {
    const postId = req.params.id
    try {
        const response = await tenanstService.showDetailPost(postId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showDetailPost: ' + error
        })
    }
}
// show category
const showCategory = async (req, res) => {
    try {
        const response = await tenanstService.showCategory()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showCategory: ' + error
        })
    }
}

module.exports = {
    showInfoUser,
    changeInfo,
    savaPost,
    reportPost,
    listPostSaved,
    deletePostSaved,
    findPostByAll,
    listPostByPage,
    totalPage,
    showDetailPost,
    showCategory
}