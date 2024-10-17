const checkEmptyUser = async (req, res, next) => {
    const { firstName, lastName, phone, email, password } = req.body
    if (!firstName || !lastName || !phone || !email || !password) {
        res.status(400).send("Enter all fields!")
    }
    else {
        next();
    }
}

module.exports = { checkEmptyUser }