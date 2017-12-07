var app = require('../server');
var http = require('http');
var mongoose = require('mongoose');
var debug = require('debug')('server:server');
var port = normalizePort(process.env.PORT || '9090')
var mongodbUrl = 'mongodb://root:adminpwd@localhost:9000/project?authSource=admin';
app.set('port', port);
var server = http.createServer(app);
mongoose.connect(mongodbUrl, function(err) {
    if (err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
        console.log('started on port ' + port);

    }
});
//var User = require('../models/adminuser');
// var user = new User({
//     username: 'adminuser',
//     password: 'adminpassword'
// });
// user.save();
//对port进行一些处理，使之能用
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }
    return false;
}



function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe' + port :
        'Port' + port

    switch (error.code) {
        case 'EACCES':
            console.log(bind + 'requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + 'is already use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'Pipe ' + addr :
        'port ' + addr.port;
}