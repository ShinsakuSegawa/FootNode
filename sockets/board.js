exports.onConnection = function(socket) {
	// コネクションが確立されたら'connected'メッセージを送信する
	socket.emit('connected', {});
};

