const { userSearches, sequelize } = require('../../models/index');
// save user searches
const saveUserSearches = async (user_id, minPrice, maxPrice, location, minAcreage, maxAcreage, categoryCode) => {
    console.log('Save user searches 2')
    try {
        const userSearch = await userSearches.create({
            minPrice: minPrice,
            maxPrice: maxPrice,
            location: location,
            minAcreage: minAcreage,
            maxAcreage: maxAcreage,
            category_id: categoryCode,
            user_id: user_id
        })
        console.log('Save user searches 3')
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