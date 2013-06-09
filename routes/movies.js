var mysql = require('mysql')
 
//Youtubeの一覧表示
exports.index = function(req, res) {
	
	// mysqlのコネクション設定
	var dbconn = mysql.createConnection({
		user: 'root',
		password: 'yarebadekiru',
		database: 'football_node'
	});
	
	//POST時の動画登録処理
	if(req.method == 'POST') {
		var value = { 
			youtube_id: req.body.youtube_id || '',
			url: req.body.youtube_url || ''
		};
		dbconn.query('INSERT INTO movies SET ?', value);
	}
	 
	var query = dbconn.query('SELECT * FROM movies;', function(err, results, fields) {
		console.log(results);
		res.render('movies', {title: 'FootballNode -movies', movies: results});
	});

}

//新規に動画を追加画面
exports.newMovie = function(req, res) {
	
		res.render('movies/new', {title: 'FootballNode -add_movie'});
}

