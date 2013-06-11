var database = require('./database');
var db = database.createClient(); 
var videos = exports;

// 全てのvideoを取得する
videos.getAll = function(callback) {
	db.query('SELECT * FROM videos;', function(err, results, fields) {
		db.end();
		if(err) {
			callback(err);
			return;
		}
		callback(err, results);
	});
};

// 最新n件のvideoを取得する
videos.getLatest = function(count, skip, callback) {
	// skip引数はオプションなので、省略可能
	if('function' === typeof skip) {
		callback = skip;
		skip = undifined;
	}
	skip = skip | 0;
	db.query('SELECT * FROM videos ORDER BY created_at DESC LIMIT ?, ?;', [skip, count], function(err, results, fields) {
		db.end();
		if(err) {
			callback(err);
			return;
		}
		callback(null, results);
	});
};

// videoの新規追加
// params = {"youtube_id": "", "youtube_url":""}
videos.postNew = function(params, callback) {
	db.query('INSERT INTO videos SET ?', params, function(err, results, fields) {
		db.end()
		if(err) {
			callback(err);
			return;
		}
		callback(null, results);
	});
};

