var mongoose = require('mongoose');

var user_schema = require('./user')(mongoose);
var message_schema = require('./message')(mongoose);

// find user by name
user_schema.statics.findByName = function(name, cb) {
    return this.findOne({
        name: name
    }, cb);
};
// find user by name
user_schema.methods.addMsg = function(msg, cb) {
    this.messages.push(msg);
    return this.save(cb)
};

var User = mongoose.model('User', user_schema);
var Message = mongoose.model('Message', message_schema);

exports.User = User;
exports.Message = Message;