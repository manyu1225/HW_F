const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'name must have value.']
        },
        password: {
            type: String,
            required: [true, 'password must have value.'],
            select: false,
        },
        email: {
            type: String,
            lowercase: true,
            required: [true, 'email must have value.'],

        },
        photo: {
            type: String,
            default: '',
        },
        createdAt: {
            type: Date,
            default: Date.now,
            select: false
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const posts = mongoose.model(
    'users', usersSchema
);

module.exports = User;
