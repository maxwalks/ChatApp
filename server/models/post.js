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
    },
    author: {
        type: String,
        ref: "user"
    }
})

module.exports=mongoose.model('Post', PostSchema)