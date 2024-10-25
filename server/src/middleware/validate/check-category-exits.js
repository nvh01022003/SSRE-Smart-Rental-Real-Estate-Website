const { Category } = require('../../models');
const Sequelize = require('sequelize');

const checkCategoryExits = async (req, res, next) => {
    const { category_name } = req.body;
    const { categoryId } = req.params;

    if (!category_name || !category_name.trim()) {
        return res.status(400).json({
            err: 1,
            msg: 'category_name is required'
        });
    }

    try {
        const trimmedCategoryName = category_name.trim();

        // Tạo điều kiện where động
        const whereCondition = { category_name: trimmedCategoryName };

        // Thêm điều kiện exclude id nếu categoryId tồn tại
        if (categoryId) {
            whereCondition.id = { [Sequelize.Op.ne]: categoryId };
        }

        const category = await Category.findOne({ where: whereCondition });

        if (category) {
            return res.status(400).json({
                err: 1,
                msg: 'category_name already exists'
            });
        }

        next();
    } catch (error) {
        console.error('Error checking category:', error);
        return res.status(500).json({
            err: 1,
            msg: 'Internal server error'
        });
    }
};

module.exports = { checkCategoryExits };
