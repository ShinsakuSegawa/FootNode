// room.js
(function () {
	 
  var socket;
  var messageLogs = {};

  // ページロード時の処理
	$(document).ready(function () {

		// 描画用変数
		var canvas = document.getElementById('canvas');
		if (!canvas || !canvas.getContext) return false;
		var ctx = canvas.getContext('2d');
		ctx.lineWidth = 5;
		ctx.lineCap = "round";
		var flg = false;
		var oldX, oldY;
		
		// 描画
		var draw = function (x1, y1, x2, y2) {
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			ctx.closePath();
		}

		$('#clearBtn').click(function () {
			ctx.clearRect(0, 0, 940, 500);
			clear();
		});
		 
		$('#canvas').mousedown(function (e) {
			flg = true;
			oldX = e.pageX - $('#canvas').position().left;
			oldY = e.pageY - $('#canvas').position().top;
		});
		 
		$('#canvas').mouseup(function (e) {
			flg = false;
		});
		 
		$('#canvas').mousemove(function (e) {
			if (!flg) return;
			var x = e.pageX - $('#canvas').position().left;
			var y = e.pageY - $('#canvas').position().top;
			draw(oldX, oldY, x, y);
			sendToRoom(oldX, oldY, x, y);
			oldX = x;
			oldY = y;
		});

    // ユーザー名、ルーム名、パスワードを送信
    socket = io.connect('http://localhost');
		 
		 
		// チャットログの送信
    socket.on('request log', function(data, callback) {
      callback(messageLogs);
    });

    // チャットログの更新
    socket.on('update log', function(log) {
      Object.keys(log).forEach(function (key) {
        messageLogs[key] = log[key];
      });
      updateMessage();
    });

    // チャットルームへのメンバー追加
    socket.on('update members', function (members) {
      $('#members').empty();
      for (var i = 0; i < members.length; i++) {
        var html = '<li>' + members[i] + '</li>';
        $('#members').append(html);
      }
    });

    // チャットメッセージ受信
    socket.on('push message', function (message) {
      messageLogs[message.id] = message;
      prependMessage(message);
    });

    // チャットメッセージ送信
    $('#post-message').on('click', function () {
      var message = {
        from: minichat.userName,
        body: $('#message').val(),
        roomId: minichat.roomId
      };
      socket.emit('say', message, function () {
        // メッセージの送信に成功したらテキストボックスをクリアする
        $('#message').val('');
      });
    });
		
		// 描画受信
		socket.on('push draw', function(data) {
			console.log(data); 
			if(data == 'cls') {
				ctx.clearRect(0, 0, 940, 500);
			} else {
				var pos = JSON.parse(data);
				draw(pos[0], pos[1], pos[2], pos[3]);
			}
		});
	
		// 消去送信
		var clear = function () {
			socket.emit('draw', 'cls');
		}

		// 描画送信
		var sendToRoom = function (x1, y1, x2, y2) {
			console.log('send point');
			socket.emit('draw', JSON.stringify([x1, y1, x2, y2]));
		}
		 
  }); // document.ready()ここまで
  
  function prependMessage(message) {
    var html = '<div class="message" id="' + message.id + '">'
      + '<p class="postdate pull-right">' + message.date + '</p>'
      + '<p class="author">' + message.from + '：</p>'
      + '<p class="comment">' + message.body + '</p>'
      + '</div>';
    $('#messages').prepend(html);
  }
   
  function updateMessage() {
    $('#messages').empty();
    var keys = Object.keys(messageLogs);
    keys.sort();
    keys.forEach(function (key) {
      prependMessage(messageLogs[key]);
    });
  }

}).apply(this);

