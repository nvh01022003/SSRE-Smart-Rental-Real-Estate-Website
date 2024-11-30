const tenanstService = require("../../services/user-service/tenants-services")
const helperService = require("../../services/tools/userSearches-service")
const Decimal = require('decimal.js');
const jwt = require("jsonwebtoken");
const authentication = require("../auth/auth")
const { json } = require("sequelize");
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
    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice) : null;
    const location = req.query.location || null;
    const minAcreage = req.query.minAcreage ? parseInt(req.query.minAcreage) : null;
    const maxAcreage = req.query.maxAcreage ? parseInt(req.query.maxAcreage) : null;
    const categoryCode = req.query.category ? parseInt(req.query.category) : null;
    const page = parseInt(req.query.page)
    const userId = req.user ? req.user.id : null;
    console.log(userId, minPrice, maxPrice, location, minAcreage, maxAcreage, categoryCode, page)
    try {
        const response = await tenanstService.findPostByAll(minPrice, maxPrice, location, minAcreage, maxAcreage, categoryCode, page, userId)
        if (response.msg.listPost.length === 0) {
            try {
                console.log('Save user searches')
                const token = req.headers["token"];
                console.log('Token', token)
                // authentication.authenticateToken(req, res, next)
                // console.log('Save user searches 11')
                await helperService.saveUserSearches(userId, minPrice, maxPrice, location, minAcreage, maxAcreage, categoryCode)
            } catch (error) {
                return res.status(500).json({
                    err: -1,
                    msg: 'Fail at auth controller saveUserSearches: ' + error
                })
            }
        }
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
    console.log("id post", postId)
    const userId = req.user ? req.user.id : null; // Lấy ID người dùng nếu đã đăng nhập
    try {
        const response = await tenanstService.showDetailPost(userId, postId)
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
// req upgrade to landlord
const reqUpdateToLandlord = async (req, res) => {
    const userId = req.user.id
    const info = req.body.info;
    const imgKYC = req.body.imageUrls;
    console.log(imgKYC)
    console.log(info)
    console.log(userId)
    try {
        const response = await tenanstService.reqUpdateToLandlord(userId, info, imgKYC)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller upgradeToLandlord: ' + error
        })
    }
}

const totalPostSaved = async (req, res) => {
    const userId = req.user.id
    try {
        const response = await tenanstService.totalPostSaved(userId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller totalPostSaved: ' + error
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
    showCategory,
    reqUpdateToLandlord,
    totalPostSaved

}