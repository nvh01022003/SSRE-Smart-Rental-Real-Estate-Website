const { Category, squelize } = require('../../models/index');
// check exits category
const checkCategoryExits = async (req, res, next) => {
    if (!req.body.category_name) {
        return res.status(400).json({
            err: 1,
            msg: 'category_name is required'
        })
    }
    else {
        const category = await Category.findOne({
            where: {
                category_name: req.body.category_name.trim()
            }
        })
        if (category) {
            return res.status(400).json({
                err: 1,
                msg: 'category_name is exits'
            })
        }
        else {
            next()
        }
    }
}
module.exports = { checkCategoryExits }