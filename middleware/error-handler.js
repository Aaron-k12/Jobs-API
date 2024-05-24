// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  /** Object set default status codes and messages */
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later'
  }
  /** CustomAPI Error can be removed since the customErro object handles it errors too */
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.msg })
  // }
// Handling validation error
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = 400
  }

  // Handling Duplicate Error
  if (err.code && err.code == 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose
    another value`
    customError.statusCode = 400
  }

  // Handling Cast Error
  if(err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`,
    customError.statusCode = 404
  }
  //  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ err: customError.msg })
}

module.exports = errorHandlerMiddleware
