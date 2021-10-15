const User = require('./auth-model')

const checkUsernameExists = async (req, res, next) => {
    try {
        const [user] = await User.findBy({ username: req.body.username })
        if (!user) {
            next()
        } else {
            next({ status: 401, message: 'username taken' })
        }
    }
    catch (err) {
        next(err)
    }
}

const validateUser = (req, res, next) => {
    const { username, password } = req.body
    if ( username === undefined || password === undefined ){
        next({ status: 401, message: 'username and password required' })
    }
    next()
}


module.exports = {
    validateUser,
    checkUsernameExists,
}