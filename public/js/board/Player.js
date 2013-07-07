/**
 * 駒(プレイヤー)オブジェクトのコンストラクタ
 * {int} x : 駒の中心x座標
 * {int} y : 駒の中心y座標
 * {int} type : 駒のタイプ(敵 or 味方) TODO:色を自由に変更出来る様にする
 * type :
 **/
var Player = function(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
}

