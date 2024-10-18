const { userSearches, sequelize } = require('../../models/index');
// save user searches
const saveUserSearches = async (data, user_id) => {
    const { minPrice, maxPrice, location, minAcreage, maxAcreage, category_id } = data;
    try {
        const userSearch = await userSearches.create({
            minPrice: minPrice,
            maxPrice: maxPrice,
            location: location,
            minAcreage: minAcreage,
            maxAcreage: maxAcreage,
            category_id: category_id,
            user_id
        })
        return {
            err: 0,
            msg: userSearch
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }

}
module.exports = {
    saveUserSearches
}