var express = require('express');
var router = express.Router();
var path = require('path');
var os = require("os");
var user_controller = require('../controllers/user_controller');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        res.render('index', {
            title: 'Demo Chat App',
            number_connected: req.userCount,
            host: os.hostname()
        });
    }
});

/* POST home page. */
router.post('/', function (req, res, next) {
    user = req.body.user;
    console.log('User: ' + user + " LOGIN");
    user_controller.get_user(user, function (foundUser) {
        console.log(foundUser.name);
        req.session.user = foundUser;
        res.redirect('/');
    });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('login', {
            title: 'SocketIO Chat Demo',
            host: os.hostname()
        });
    }
});

/* GET logout page. */
router.get('/logout', function (req, res, next) {
    delete req.session.user;
    res.redirect('/');
});

module.exports = router;