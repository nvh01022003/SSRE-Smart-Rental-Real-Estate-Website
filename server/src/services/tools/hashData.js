const bcryptjs = require("bcryptjs");
const hashData = (data) => {
    const salt = bcryptjs.genSaltSync(10);
    return bcryptjs.hashSync(data, salt);
}
module.exports = { hashData };