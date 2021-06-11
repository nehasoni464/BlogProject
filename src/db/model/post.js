const mongoose = require('mongoose')

const blog = new mongoose.Schema({
    topic: {
        required: true,
        type: String
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    title: {
        type: String,
        required: true,
        unique:true
    },
    description: {
        required: true,
        type: String
    },
    comment: {
        type: Array
    },
    like: {
        type: Number,
        default: 0
    },
    dislike: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})
const blogPost = mongoose.model('blogPost', blog)

module.exports = blogPost

