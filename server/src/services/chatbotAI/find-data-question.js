const { where } = require("sequelize");
const { Op } = require('sequelize');
const { User, Post, Address, Image, Favourite, Report, Category, Overview, Coordinates, UpgradeRequest, sequelize } = require("../../models/index");
const findByQueston = async (city, district, category) => {
    const categoryFind = await Category.findOne({
        where: {
            category_name: {
                [Op.like]: `%${category}%`
            }
        }
    });
    const addressFind = await Address.findAll({
        where: {
            city: {
                [Op.like]: `%${city}%`
            },
            district: {
                [Op.like]: `%${district}%`
            }
        }
    });
    let addressId = [];
    addressFind.forEach(element => {
        addressId.push(element.id);
    });
    // tìm kiếm post theo categoryFind, addressId
    console.log(addressId);
    const postFind = await Post.findAll({
        where: {
            category_id: categoryFind.id,
            address_id: {
                [Op.in]: addressId
            }
        }
        , include: [
            {
                model: Coordinates,
                attributes: ['lat', 'lon']
            }
        ]
    });
    // lặp qua từng post để lấy thông tin cần thiết lưu vào mảng postInfo mỗi phần tử có các đối tượng { id: id, title: title, lat: lat, lon: lon }
    let postInfo = [];
    postFind.forEach(element => {
        postInfo.push({ id: element.id, title: element.title, lat: element.Coordinate.lat, lon: element.Coordinate.lon, resultFind: null, amountFind: 0 });
    });
    return postInfo;
};
module.exports = { findByQueston };