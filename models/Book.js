const mongoose = require('mongoose')
const slugify = require('slug')
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    publishedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    pageCount: {
        type: Number,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        // type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    imgName: {
        type: String,
    },
})

bookSchema.pre('validate', function () {
    if (this.title) {
        this.slug = slugify(this.title, { strict: true, lower: true })
    }
})
module.exports = mongoose.model('Book', bookSchema)
