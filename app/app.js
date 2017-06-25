var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes/index');
var mongoose = require('mongoose');

var app = express();

// Set up socket.io in server
app.io = require('socket.io')();
var online_users = []; // Array with connected users
app.socket_map = {}; // Map with connected user and sockets

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    secret: "Socket_io_example",
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));


var port = process.env.DB_PORT || '27017';
var host = process.env.DB_HOST || 'db';
var mongo_pass = process.env.MONGO_PASSWORD || '';
var mongo_user = process.env.MONGO_USERNAME || '';
var mongo_db = process.env.MONGO_DATABASE || '';

var url = 'mongodb://' + mongo_user + ':' + mongo_pass + '@' + host + ':' + port + '/' + mongo_db;
/**
 * Initialize the connection.
 * @method init
 **/
console.log(url)
mongoose.connect(url, {
    server: {
        autoReconnect: true,
        reconnectTries: 30,
        reconnectInterval: 1000
    }
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to MongoDB to: " + url);
});


app.use(function (req, res, next) {
    res.locals.userCount = online_users.length;
    res.locals.session = req.session;
    next();
});
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});




// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// start listen with socket.io
app.io.on('connection', function (socket) {
    var user_controller = require('./controllers/user_controller');
    console.log('Socket Connected');


    socket.on('chat message', function (msg) {
        console.log("message from: " + socket.id + " - " + app.socket_map[socket.id]);
        user_controller.add_msg(app.socket_map[socket.id], msg, function (sendedMessage) {
            // console.log(sendedMessage);
            socket.broadcast.emit('chat message', sendedMessage, app.socket_map[socket.id]);
        });
    });
    socket.on('typing', function (isTyping, name) {
        //console.log('User: ' + name + " is typing " + isTyping);
        socket.broadcast.emit('typing', isTyping, name);
    });

    socket.on('new user', function (user) {
        app.socket_map[socket.id] = user;

        if (online_users.indexOf(user) < 0) {
            online_users.push(user);
            console.log("New User CONNECTED ")

        }
        online_users[online_users.indexOf(user)]
        console.log('User: ' + app.socket_map[socket.id] + " CONNECTED");

        console.log("Number of users: " + online_users.length);
        app.io.emit('connection on off', (online_users.length));
        user_controller.getUser(user, function (foundUser) {
            if (foundUser && foundUser.messages) {
                foundUser.messages.forEach(function (msg) {
                    // send them just to me
                    app.io.to(socket.id).emit('old message', msg, app.socket_map[socket.id]);
                });
            }
        });
    });


    socket.on('disconnect', function () {
        console.log('User ' + app.socket_map[socket.id] + ' DISCONNECTED');
        console.log(online_users.indexOf(app.socket_map[socket.id]) >= 0);
        openned_sessions = 0;
        for (socketId in app.socket_map) {
            if (app.socket_map[socket.id] == app.socket_map[socketId]) {
                openned_sessions++;
            }
            if (openned_sessions >= 2) {
                break;
            }
        }
        if (openned_sessions <= 1){
            online_users.splice(online_users.indexOf(app.socket_map[socket.id]),1);
        }

        delete app.socket_map[socket.id];

        console.log("Number of users: " + online_users.length);
        app.io.emit('connection on off', (online_users.length));
    });
});


module.exports = app;