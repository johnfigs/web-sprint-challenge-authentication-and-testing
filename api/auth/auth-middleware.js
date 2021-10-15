const User = require('./auth-model')

const checkUsernameUnique = async (req, res, next) => {
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

const checkUsernameExists = async (req, res, next) => {
    try {
      const [user] = await User.findBy({ username: req.body.username })
      if (!user) {
        next({ status: 401, message: 'invalid credentials' })
      } else {
        req.user = user
        next()
      }
    } catch (err) {
      next(err)
    }
  }


module.exports = {
    validateUser,
    checkUsernameUnique,
    checkUsernameExists
}