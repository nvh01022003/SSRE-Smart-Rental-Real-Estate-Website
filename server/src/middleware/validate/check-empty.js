const checkEmptyUser = async (req, res, next) => {
    const { firstName, lastName, phone, email, password } = req.body
    if (!firstName || !lastName || !phone || !email || !password) {
        res.status(400).send("Enter all fields!")
    }
    else {
        next();
    }
}
const checkEmptyEmail = async (req, res, next) => {
    const { email } = req.body
    if (!email) {
        res.status(400).send("Enter email!")
    }
    else {
        next();
    }
}
module.exports = { checkEmptyUser, checkEmptyEmail }