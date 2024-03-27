const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PostSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports=mongoose.model('Post', PostSchema)