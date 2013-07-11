/**
* 戦略ボードオブジェクト
**/
// プレイヤータイプ
const PLAYER_HOME = 0;
const PLAYER_AWAY = 1;


/**
* Boardコンストラクタ
* {canvas context} ctx : 処理対象のcontext
* {int} w : 表示領域の幅
* {object} player : 
**/

var Board = function(ctx, w, h, cvdivx, cvdivy, $cvdiv) {
	this.ctx = ctx; // 処理対象context
	this.$cvdiv = $cvdiv;
	this.grSep = 30;  // グリッド間隔(px)
	this.grSephf = this.grSep / 2;  // グリッド間隔の半分
	this.grWidth = 1; // グリッド線の太さ
	this.grXAr = []; // グリッドのX座標を格納した配列
	this.grRcv = false; // canvasの右端がグリッドと重なるならtrue
	this.grYAr = []; // グリッドのY座標を格納した配列
	this.grBcv = false; // canvasの下端がグリッドと重なるならtrue

	this.area = {w:w, h:h};  // 表示エリア
	var players = []; // 駒(player)格納配列

	// ドラッグ状態を保持するオブジェクト
	this.drag = {
		now: false,		// ドラッグ状態ならtrue
		player: null		// ドラッグしている駒のplayersのindex
	};

	// プレイヤータイプ
	this.PLAYER_HOME = 0;
	this.PLAYER_AWAY = 1;

	/* ブラウザ上のCanvas左上座標を求める */
	this.cvpos = {x:0, y:0};  // ブラウザ上のCanvas左上座標
	this.cvpos.x = cvdivx;
	this.cvpos.y = cvdivy;

	/* グリッド座標計算 */
	var gcntx = 0;  // 縦線本数
	if (this.area.w % this.grSep) {
		gcntx = Math.floor(this.area.w / this.grSep);

	} else {
		// canvasの右端がグリッドと重なる場合
		gcntx = this.area.w / this.grSep - 1;
		this.grRcv = true;
	}
	for (var i = 0; i < gcntx; i++) {
		this.grXAr[i] = this.grSep * (i + 1);
	}

	var gcnty = 0;  // 横線本数
	if (this.area.h % this.grSep) {
		gcnty = Math.floor(area.h / this.grSep);
	} else {
		// canvasの下端がグリッドと重なる場合
		gcnty = this.area.h / this.grSep - 1;
		this.grBcv = true;
	}
	for (var i = 0; i < gcnty; i++) {
		this.grYAr[i] = this.grSep * (i + 1);
	}

	// プレイヤーを初期化する 
	Board.prototype.initPlayers = function() {
		players = [];
		players[0] = new Player(this.grSephf, this.grSephf, this.PLAYER_HOME);
		console.log(players);
	}


	/**
	* プレイヤーの追加
	*
	**/
	Board.prototype.addPlayers = function(type) {
		players.push(new Player(this.grSephf * 2, this.grSephf * 2, type));
		this.drawField();
	}

	/**
	* ボードをクリアする
	* return なし
	**/
	Board.prototype.clearField = function() {
		// 画面をクリア
		this.ctx.clearRect(0, 0, this.area.w, this.area.h);
		// グリッド表示
		this.ctx.save();
		this.ctx.globalAlpha = 0.5;
		this.ctx.strokeStyle = "#000033";
		this.ctx.lineWidth = this.grWidth;
		for (var i = 0; i < this.grXAr.length; i++) {
			this.ctx.beginPath();
			this.ctx.moveTo(this.grXAr[i], 0);
			this.ctx.lineTo(this.grXAr[i], this.area.h);
			this.ctx.stroke();
		}
		for (var i = 0; i < this.grYAr.length; i++) {
			this.ctx.beginPath();
			this.ctx.moveTo(0,this.grYAr[i]);
			this.ctx.lineTo(this.area.w, this.grYAr[i]);
			this.ctx.stroke();
		}
		this.ctx.restore();
	};

	/* 毎回計算しないように外に記述 */
	this.linelng = this.grSep / 2 - 1;  // よく使う長さ
	this.PI2 = Math.PI * 2; // 2π

	/**
	* ボードを初期化
	* return なし
	*/
	Board.prototype.drawField = function() {
		// 画面を初期化
		this.clearField();
		// player配置
		for (var i = 0; i < players.length; i++) {
			switch (players[i].type) {
				case this.PLAYER_HOME: {
					this.drawHome(players[i].x, players[i].y);
					break;
				}
			case this.PLAYER_AWAY: {
				this.drawAWAY(players[i].x, players[i].y);
				break;
			}
			}
		}
	};

	/**
	* アイテムの座標をグリッドの中央にセット
	* {int} index 対象アイテムのthis.itemArのindex
	* {int} x 現在の中心x座標
	* {int} y 現在の中心y座標
	* return なし
	**/
	Board.prototype.setCenter = function(index, x, y) {
		// 現在の座標がCanvas外の場合は、端のグリッドにセット
		var gidx = Math.floor(x / board.grSep);  // グリッド配列のindex
		if (gidx < 0 ) {
			gidx = 0;
		} else if (gidx >= board.grXAr.length && !board.grRcv) {
			gidx = board.grXAr.length - 1;
		}
		if (gidx < board.grXAr.length) {
			players[index].x = board.grXAr[gidx] - board.grSephf;
		} else {
			// canvasの右端がグリッドと重なる場合
			players[index].x = board.grXAr[board.grXAr.length - 1] + board.grSephf;
		}

 
		gidx = Math.floor(y / board.grSep);
		if (gidx < 0 ) {
			gidx = 0;
		} else if (gidx >= board.grYAr.length && !board.grBcv) {
			gidx = board.grYAr.length - 1;
		}
		if (gidx < board.grYAr.length) {
			players[index].y = board.grYAr[gidx] - board.grSephf;
		} else {
			// canvasの下端がグリッドと重なる場合
			plyaers[index].y = board.grYAr[board.grYAr.length - 1] + board.grSephf;
		}
	};

	/** 
	* ホーム側の駒 this.grSep - 2 の円を描く
	* {int} x 中心のx座標
	* {int} y 中心のy座標
	* return なし
	**/
	Board.prototype.drawHome = function(x,y) {
		this.ctx.save();
		this.ctx.fillStyle = 'green';
		this.ctx.beginPath();
		this.ctx.arc(x, y, this.linelng, 0, this.PI2, false);
		this.ctx.fill();
		this.ctx.restore();
	};

	/** 
	* AWAY側の駒 this.grSep - 2 の円を描く
	* {int} x 中心のx座標
	* {int} y 中心のy座標
	* return なし
	**/
	Board.prototype.drawAWAY = function(x,y) {
		this.ctx.save();
		this.ctx.fillStyle = 'blue';
		this.ctx.beginPath();
		this.ctx.arc(x, y, this.linelng, 0, this.PI2, false);
		this.ctx.fill();
		this.ctx.restore();
	};

	/**
	* アイテムが指定した座標内にあるか判定
	* {int} x x座標
	* {int} y y座標
	* return アイテムがあればplayersのindex アイテムが無ければnull
	**/
	Board.prototype.checkItem = function(x, y) {
		var rtn = null;
		for (var i = 0; i < players.length; i++) {
			if (x >= players[i].x - this.grSephf && x <= players[i].x + this.grSephf) {
				if (y >= players[i].y - this.grSephf && y <= players[i].y + this.grSephf) {
					rtn = i;
					break;
				}
			}
		}
		return rtn;
	};

	Board.prototype.setEvents = function() {
		// Boardオブジェクトを保持
		var self = this;
		console.log(self);
		this.$cvdiv.mousedown(function(e){
			return self.mouseDown(e, self);
		});
		this.$cvdiv.mouseup(function(e) {
			return self.mouseUp(e, self);
		});
		this.$cvdiv.mousemove(function(e) {
			return self.mouseMove(e, self);
		});
	}

	/**
	 * キャンバス上のマウス押下時の処理
	 * 押下時にアイテムが存在するかチェック
	 * 存在するならばdragを変更
	 **/
	Board.prototype.mouseDown = function(event, self) {
		if (!self.drag.now) {
			// ポインタ座標をCanvas座標へ変換
			var cx = event.pageX - self.cvpos.x;
			var cy = event.pageY - self.cvpos.y;
			// ポインタ座標内にドラッグ可能なアイテムがあるかチェック
			var playerIdx = self.checkItem(cx, cy);

			if (playerIdx != null) {
				self.drag.now = true;
				self.drag.player = playerIdx;
			}
		}
		return false;
	};

	/**
	 * マウスアップ時の処理
	 * 駒を中心に持ってくる
	 **/
	Board.prototype.mouseUp = function(event, self) {
		if (self.drag.now) {
			// ポインタ座標をCanvas座標へ変換
			var cx = event.pageX - self.cvpos.x;
			var cy = event.pageY - self.cvpos.y;
			if (cx < 0) cx = 0;
			if (cx > self.area.w) cx = self.area.w;
			if (cy < 0) cy = 0;
			if (cy > self.area.h) cy = self.area.h;
			// アイテムの座標をグリッドの中央にセット
			board.setCenter(self.drag.player, cx, cy);
			// 画面更新
			self.drawField();
			self.drag.now = false;
			self.drag.player = null;
		}
	}
	
	/**
	 * マウス移動時時の処理、駒が1px動いたら再描画
	 **/
	Board.prototype.mouseMove = function(event, self) {
		if (self.drag.now) {
			// ポインタ座標をCanvas座標へ変換
			var cx = event.pageX - self.cvpos.x;
			var cy = event.pageY - self.cvpos.y;
			// 画面更新するか判定
			var updSep = 1; // 何px動いたら画面更新するか
			if (Math.abs(cx - players[self.drag.player].x) >= updSep || Math.abs(cy - players[self.drag.player].y) >= updSep) {
				// アイテムの座標更新
				players[self.drag.player].x = cx;
				players[self.drag.player].y = cy;
				// 画面更新
				self.drawField();
			}
		}
		return false;
	};

	/**
	 * socketコネクションの設定
	 *
	 */
	Board.prototype.setConnection = function() {
		//console.log(io.connect);
		this.socket = io.connect('http://localhost');

		console.log(this.socket);
		//console.log(this.socket);
	};
}
