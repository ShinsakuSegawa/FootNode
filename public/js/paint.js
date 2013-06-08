/**
* canvas の描画処理
* マウス押下時、ドラッグ時、アップ時のイベントを判定
* downFlgで制御しながら座標指定で線の描画を行う
* x-170, y-100 はcanvasの位置による描画位置の調整
**/

$(document).ready(function () {
	var canvas = document.getElementById('canvas');
	var downFlg = false;
	var ctx = canvas.getContext("2d");

	canvas.addEventListener('mousedown', function (e) {
		downFlg = true;
		ctx.beginPath();
		ctx.moveTo(e.clientX-170, e.clientY-100);
	}, false);

	window.addEventListener('mousemove', function (e) {
		if (!downFlg) return; 
		ctx.lineTo(e.clientX-170, e.clientY-100);
		ctx.stroke();
	}, false);

	window.addEventListener('mouseup', function (e) {
		if (!downFlg) return;
		ctx.lineTo(e.clientX-170, e.clientY-100);
		ctx.stroke();
		ctx.closePath();
		downFlg = false;
	}, false);

	$('#clearBtn').click(function() {
		console.log('Hello');
		ctx.clearRect(0, 0, 940, 500);
		//	clear();
	});
	
});

