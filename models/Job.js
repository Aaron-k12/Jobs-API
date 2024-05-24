const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide position'],
        maxlength: 100
    },
    status: {
        type:String,
        enum:['interview', 'declined', 'pending'],
        default: 'pending'
    },
    /** The type is set so that any time a job is created
     * it will be associated with a user
     * ref -  reference to the User model created
     */
    createdBy: {
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true, 'Please provide user']
    },
}, {timestamps:true})

module.exports = mongoose.model('Job', JobSchema)