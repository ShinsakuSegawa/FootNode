
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , room = require('./routes/room.js')
  , board = require('./routes/board')
	, paint = require('./routes/paint.js')
	, videos = require('./routes/videos.js')
  , http = require('http')
  , path = require('path')
  , roomsockets = require('./sockets/room.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/room', room.entrance);
app.get('/videos', videos.index);
app.post('/videos', videos.index);
app.get('/videos/new', videos.newMovie);   
app.post('/room/enter', room.enter);
app.get('/paint', paint.index);


var server = http.createServer(app);
var io = require('socket.io').listen(server, {log:false});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// socket.ioのコネクション設定
io.sockets.on('connection', roomsockets.onConnection);


