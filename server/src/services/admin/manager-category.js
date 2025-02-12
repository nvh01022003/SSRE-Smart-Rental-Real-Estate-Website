const { Category, squelize } = require('../../models');
const { where } = require("sequelize");
const { Op } = require('sequelize');

// show all category
const showAllCategory = async () => {
    try {
        console.log('showAllCategory')
        const category = await Category.findAll({
            attributes: ['id', 'category_name', 'createdAt', 'updatedAt']
        })
        if (category) {
            return {
                err: 0,
                msg: 'get info category success',
                'info_category': category,
            };
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        };
    }
}
// create category
const createCategory = async (data) => {
    try {
        const category = await Category.create({
            category_name: data
        })
        if (category) {
            return {
                err: 0,
                msg: 'create category success',
                'info_category': category,
            };
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        };
    }
}
// update category by id
const updateCategory = async (categoryId, categoryName) => {
    try {
        const category = await Category.update({
            category_name: categoryName
        }, {
            where: {
                id: categoryId
            }
        })
        if (category) {
            return {
                err: 0,
                msg: 'update category success'
            }
        }
    }
    catch (err) {
        return {
            err: 1,
            msg: err
        };
    }

}
// delete category by id
const deleteCategory = async (categoryId) => {
    try {
        const category = await Category.destroy({
            where: {
                id: categoryId
            }
        })
        if (category) {
            return {
                err: 0,
                msg: 'delete category success'
            }
        }
    }
    catch (err) {
        return {
            err: 1,
            msg: err
        };
    }

}

module.exports = {
    showAllCategory,
    createCategory,
    updateCategory,
    deleteCategory
}