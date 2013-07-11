$(window).load(function() {
	// canvasのDOM elementとcontext取得
	var canvas = document.getElementById("field");
	var $cvdiv = $("#fdiv");
	if ( ! canvas || ! canvas.getContext ) { return false; }
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.globalAlpha = 0.5;		// 透過度
	ctx.globalCompositeOperation = "source-over";		// どのように図形や画像を現存するビットマップ上に描画するかセット

	// グローバル変数
	board = new Board(ctx, canvas.width, canvas.height, $cvdiv.offset().left, $cvdiv.offset().top, $cvdiv);

	// イベントの追加
	board.setEvents();
	board.initPlayers();
	board.drawField();

	board.setConnection();

	$("#addPlayer").click(function() {
		board.addPlayers(Math.floor(Math.random()*2));
	});
	$("#addPlayer").click(board.addPlayers(1));
	console.log( $("#addPlayer").click );

});

