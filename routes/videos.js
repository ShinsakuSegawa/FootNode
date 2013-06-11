// videosのモデルモジュールのロード
var videos = require('../models/videos');

// indexページ
exports.index = function(req, res) {
	
	// POST時は動画の登録
	if(req.method == 'POST') {
		var params = {
			youtube_id: req.body.youtube_id || '',
			youtube_url: req.body.youtube_url || ''
		};
		videos.postNew(params, function(err, results) {
			console.log("success");
		});
	}

	// videosのallGetメソッドを利用して全てのビデオを取得する
	videos.getAll(function(err, results) {
		if(err) {
			res.send(500);
			console.log('cannnot recieve videos');
			return;
		}
		res.render('videos', {title: 'FootballNode -videos', videos: results});
	});
};

//新規に動画を追加画面
exports.newMovie = function(req, res) {
	res.render('videos/new', {title: 'FootballNode -add_movie'});
}
