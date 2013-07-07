/* HTML5 Canvas で drag&drop その1
 * ドラッグ中のみ、1px動くたびにCanvas更新
 */
var dtest1 = {}; // namespace

(function($) {

		/* 定数 */
		dtest1.con = {
			id: { // id名
				cvm: 'cv1',  // main Canvas
				cvdiv: 'cvdiv1',  // main Canvasのdiv
				msgdiv: 'msg1',  // メッセージ表示div
				stbtn: 'stbtn1', // スタートボタン
				ldmsg: 'ldmsg1'  // ロード中メッセージ表示div
			},
			msg: { // 表示メッセージ
				candr: 'ドラッグできます',
				dring: 'ドラッグ中',
				leave: 'ポインタがCanvasから外れたので<br>ドロップしました',
				pushb: 'スタートボタンを押してください'
			},
			btnmsg: { // ボタン表示メッセージ
				start: 'スタート',
				stop: 'ストップ'
			},
			dtype: { // 図形のタイプ
				cir: 'circle', // 円
				tri: 'triangle', // 三角形
				squ: 'square'  // 正方形
			}
		};

		/* グローバル変数 */
		// drag状態
		dtest1.drag = {
			now: false, // ドラッグ状態ならtrue
			item: null  // ドラッグしているアイテムのitemArのindex
		};
		dtest1.gamestart = false;  // 実行中ならtrue

		/* スタートボタンを押した場合の処理
		 * return なし
		 */
		dtest1.start = function() {
			var $cvdiv = $('#' + dtest1.con.id.cvdiv); // main Canvasのdiv
			var $btn = $('#' + dtest1.con.id.stbtn); // スタートボタン
			if (!dtest1.gamestart) { // 停止中の場合
				// canvasにイベント付与
				$cvdiv.mousedown(dtest1.cvmsDown);
				$cvdiv.mouseup(dtest1.cvmsUp);
				$cvdiv.mouseleave(dtest1.cvmsUp);
				$cvdiv.mousemove(dtest1.cvmsMove);
				// canvas初期化
				dtest1.DRAG.init();
				dtest1.DRAG.draw();

				dtest1.gamestart = true;
				dtest1.showmsg(dtest1.con.msg.candr);
				$btn.text(dtest1.con.btnmsg.stop);
			} else { // 実行中の場合
				// イベント削除
				$cvdiv.unbind('mousedown', dtest1.cvmsDown);
				$cvdiv.unbind('mouseup', dtest1.cvmsUp);
				$cvdiv.unbind('mouseleave', dtest1.cvmsUp);
				$cvdiv.unbind('mousemove', dtest1.cvmsMove);

				dtest1.gamestart = false;
				dtest1.showmsg(dtest1.con.msg.pushb);
				$btn.text(dtest1.con.btnmsg.start);
			}
		};

		/* メッセージ表示
		 * {string} msg 表示するメッセージ
		 * return なし
		 */
		dtest1.showmsg = function(msg) {
			$('#' + dtest1.con.id.msgdiv).html(msg);
		};

		/* Canvasでmousedown時に行われる処理
		 * {event} evt イベントオブジェクト
		 * return なし
		 */
		dtest1.cvmsDown = function(evt) {
			if (!dtest1.drag.now) {
				// ポインタ座標をCanvas座標へ変換
				var cx = evt.pageX - dtest1.DRAG.cvpos.x;
				var cy = evt.pageY - dtest1.DRAG.cvpos.y;
				// ポインタ座標内にドラッグ可能なアイテムがあるかチェック
				var itemIdx = dtest1.DRAG.checkItem(cx, cy);
				if (itemIdx != null) {
					dtest1.drag.now = true;
					dtest1.drag.item = itemIdx;
					dtest1.showmsg(dtest1.con.msg.dring);
				}
			}
			return false;
		};
		/* Canvasでmouseup/mouseleave時に行われる処理
		 * {event} evt イベントオブジェクト
		 * return なし
		 */
		dtest1.cvmsUp = function(evt) {
			if (dtest1.drag.now) {
				// ポインタ座標をCanvas座標へ変換
				var cx = evt.pageX - dtest1.DRAG.cvpos.x;
				var cy = evt.pageY - dtest1.DRAG.cvpos.y;
				if (cx < 0) cx = 0;
				if (cx > dtest1.DRAG.area.w) cx = dtest1.DRAG.area.w;
				if (cy < 0) cy = 0;
				if (cy > dtest1.DRAG.area.h) cy = dtest1.DRAG.area.h;
				// アイテムの座標をグリッドの中央にセット
				dtest1.DRAG.setCenter(dtest1.drag.item, cx, cy);
				// 画面更新
				dtest1.DRAG.draw();

				dtest1.drag.now = false;
				dtest1.drag.item = null;
				if (evt.type == 'mouseleave'){
					dtest1.showmsg(dtest1.con.msg.leave);
				} else if (dtest1.gamestart) {
					dtest1.showmsg(dtest1.con.msg.candr);
				}
			}
		};
		/* Canvasでmousemove時に行われる処理
		 * {event} evt イベントオブジェクト
		 * return なし
		 */
		dtest1.cvmsMove = function(evt) {
			if (dtest1.drag.now) {
				// ポインタ座標をCanvas座標へ変換
				var cx = evt.pageX - dtest1.DRAG.cvpos.x;
				var cy = evt.pageY - dtest1.DRAG.cvpos.y;
				// 画面更新するか判定
				var updSep = 1; // 何px動いたら画面更新するか
				if (Math.abs(cx - dtest1.DRAG.itemAr[dtest1.drag.item].x) >= updSep ||
					Math.abs(cy - dtest1.DRAG.itemAr[dtest1.drag.item].y) >= updSep) {
					// アイテムの座標更新
					dtest1.DRAG.itemAr[dtest1.drag.item].x = cx;
					dtest1.DRAG.itemAr[dtest1.drag.item].y = cy;
					// 画面更新
					dtest1.DRAG.draw();
				}
			}
			return false;
		};

		/* body onload時の処理 */
		$(window).load(function() {
				// ロード中メッセージ削除
				$('#' + dtest1.con.id.ldmsg).remove();
				// canvasのDOM elementとcontext取得
				var canvas = document.getElementById(dtest1.con.id.cvm);
				if ( ! canvas || ! canvas.getContext ) { return false; }
				var ctx = canvas.getContext("2d");
				ctx.lineWidth = 1;
				ctx.globalAlpha = 0.7;
				ctx.globalCompositeOperation = "source-over";

				// 画面表示
				dtest1.DRAG = new dtcom.canv(ctx, canvas.width, canvas.height, dtest1);
				dtest1.DRAG.init();
				dtest1.DRAG.draw();

				// イベント付与
				// ドラッグ中にボタンが押されることを防ぐため、
				// clickではなくmousedownイベントを付与
				var $btn = $('#' + dtest1.con.id.stbtn); // スタートボタン
				$btn.mousedown(dtest1.start);
				$btn.text(dtest1.con.btnmsg.start);

				// メッセージ表示
				dtest1.showmsg(dtest1.con.msg.pushb);
		});


})(jQuery);
