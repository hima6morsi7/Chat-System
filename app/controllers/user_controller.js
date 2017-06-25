var models = require('../models');


exports.get_user = function(username, cb) {
    models.User.findByName(username, function(err, user) {
        if (user) {
            //console.log(user.messages);
            // take only the last 5 
            if (user.messages.length > 5) {
                user.messages.splice(0,user.messages.length - 5);
            }

            cb(user);
        } else {
            add_user(username, cb);
        }
    });
};

exports.add_msg = function(username, msg, cb) {
    //console.log("add_msg: " + JSON.stringify(msg));
    models.User.findByName(username, function(err, user) {
        if (user) {
            var message = new models.Message({
                text: msg.text,
                createdAt: new Date(msg.createdAt)
            });
            user.add_msg(message, function(err, user) {
                cb(message);
            });
        }
    });
};

var add_user = function(userName,cb) {
    var newUser = new models.User({
        name: userName,
        messages: []
    });

    newUser.save(function(err, user) {
        if (err) return console.error(err);
        console.log(user.name + " -> SAVED");
        cb(user);
    });
};

exports.upload_photo = function (req, res) {
    models.User.findByName(username, function (err, user) {
        if (user) {
            //console.log(user.messages);

            // take only the last 5 
            if (user.messages.length > 5) {
                user.messages.splice(0, user.messages.length - 5);
            }
            cb(user.messages);
        } else {
            add_user(username);
        }
    });
};
