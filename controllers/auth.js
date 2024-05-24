const { BadRequestError, UnauthenticatedError } = require('../errors')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')



/** Controller register contains functions for hashing passwords
 * 
 */
const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

/** login function */
const login = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
// find user using email
    const user = await User.findOne({email})
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    //compare password
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{ name: user.name}, token})
}

module.exports = {
    register, login
}