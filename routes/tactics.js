/* 
 * 戦術ボードのルート
 */

exports.index = function(req, res) {
	res.render('tactics/index', {title: 'FootballNode -tactics'});
}


