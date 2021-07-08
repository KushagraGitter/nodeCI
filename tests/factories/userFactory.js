const momgoose = require('mongoose');
const User = momgoose.model('User');

module.exports = () => {
    return new User({}).save();
}