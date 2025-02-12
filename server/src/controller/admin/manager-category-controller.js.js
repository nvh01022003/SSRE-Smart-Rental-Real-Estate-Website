const managerCategory = require("../../services/admin/manager-category")


// show all category
const showAllCategory = async (req, res) => {
    try {
        const response = await managerCategory.showAllCategory()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showAllCategory: ' + error
        })
    }
}
// create category
const createCategory = async (req, res) => {
    const categoryName = req.body.category_name

    try {
        const response = await managerCategory.createCategory(categoryName)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller createCategory: ' + error
        })
    }
}
// update category by id
const updateCategory = async (req, res) => {
    const categoryId = req.params.categoryId
    const categoryName = req.body.category_name
    try {
        const response = await managerCategory.updateCategory(categoryId, categoryName)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller updateCategory: ' + error
        })
    }
}
// delete category by id
const deleteCategory = async (req, res) => {
    const categoryId = req.params.categoryId
    try {
        const response = await managerCategory.deleteCategory(categoryId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller deleteCategory: ' + error
        })
    }
}
module.exports = {
    showAllCategory,
    createCategory,
    updateCategory,
    deleteCategory
}