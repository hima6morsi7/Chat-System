module.exports = function(mongoose) {
    var message_schema = mongoose.Schema({
        text: String
    }, {
        timestamps: true
    });
    return message_schema;
}
