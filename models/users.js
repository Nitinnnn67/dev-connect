const mongoose = require("mongoose");
const schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', userSchema);