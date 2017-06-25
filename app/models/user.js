module.exports = function(mongoose) {
  var message_schema = require('./message')(mongoose);

    var user_schema = mongoose.Schema({
        name: String,
        messages: [message_schema]
    }, {
        timestamps: true
    });
    return user_schema;
}
