const express = require("express");
const router = express.Router();
const axios = require("axios");
const crawlData = require("../../testcode/test");

// hàm cào dữ liệu từ trang web batdongsan.com.vn
const crawlDataFromBatDongSanFull = async () => {
    try {
        const url = "https://batdongsan.com.vn/nha-dat-ban";
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, như Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });
        const $ = cheerio.load(data);

        const posts = [];

        $('.search-productItem').each((index, element) => {
            const title = $(element).find('.p-title a').text().trim();
            const price = $(element).find('.product-price').text().trim();
            const location = $(element).find('.product-city-dist').text().trim();
            const description = $(element).find('.p-main-text').text().trim();
            const postUrl = $(element).find('.p-title a').attr('href');

            posts.push({ title, price, location, description, url: postUrl });
        });

        for (const post of posts) {
            // Tạo Address
            const address = await Address.create({ location: post.location });

            // Tạo Category (giả định một danh mục mặc định)
            const category = await Category.create({ name: 'Default Category' });

            // Tạo Post với ID của Address và Category đã tạo
            await Post.create({
                title: post.title,
                price: post.price,
                description: post.description,
                url: post.url,
                address_id: address.id,
                category_id: category.id
            });
        }

        return { message: 'Dữ liệu đã được cào và chèn thành công' };
    } catch (error) {
        console.log('Lỗi tại crawlData.crawlData')
    }
};

module.exports = {
    crawlDataFromBatDongSanFull
};