const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')


/** Funciton to retrieve all jobs available in the database 
 * This search is done to find jobs by a particular user
*/
const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')

    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}
/** Funciton to retrieve a single job */
const getJob = async (req, res) => {
    // nested destructuring to get the userId from the auth middleware and id from express params
    const {
        user: { userId },
        params: { id: jobId }
    } = req

    const job = await Job.findOne({
        _id: jobId, createdBy: userId
    })
    // handling error case where wrong job id is provided
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({ job })
}
/** Funciton used to create a job 
 * A new property is created in req.body and set ot req.user.userId
 * createdBy is created because the Job model requires it
*/
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json(job)
}
/** Function used to update job */
const updateJob = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId }
    } = req

    if (company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty')
    }
    // find paticular job, update, run validators and return updates
    const job = await Job.findByIdAndUpdate({ _id: jobId, createdBy: userId }, req.body, {
        new: true,
        runValidators: true
    })

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({ job })

}

/** Function for deleting jobs */
const deleteJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId }
    } = req

    const job = await Job.findOneAndRemove({
        _id: jobId,
        createdBy: userId
    })

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).send()
}



module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}