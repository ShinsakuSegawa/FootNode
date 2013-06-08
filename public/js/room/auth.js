// room/auth.js
// 部屋の認証
(function () {
  var socket;
  var messageLogs = {};

  // ページロード時の処理
  $(document).ready(function () {
    // ユーザー名、ルーム名、パスワードを送信
    socket = io.connect('http://localhost');

    // メッセージハンドラの定義
    // サーバーへの接続完了
    socket.on('connected', function(data) {
      socket.emit('check credential', minichat);
    });

    // 認証成功
    socket.on('credential ok', function(data) {
      socket.emit('request log', {});
			//絵の初期化
			socket.emit('init draw', {});
    });

    // 認証失敗：ルーム名/パスワードの不一致
    socket.on('invalid credential', function(data) {
      authRetry('ルーム名/パスワードが不正です');
    });

    // 認証失敗：同名のルームがすでに存在
    socket.on('room exists', function(data) {
      authRetry('同名のルームがすでに存在します');
    });

    // 認証失敗：ルームに同名のユーザーが存在
    socket.on('userName exists', function(data) {
      authRetry('その名前はすでに使われています');
    });

  }); //document.ready() 終わり

  function authRetry(message) {
    $('#credential-dialog-header').text(message);    
    $('#new-room').val(minichat.roomName);
    $('#new-name').val(minichat.userName);
    $('#credentialDialog').modal('show');
  }

}).apply(this);

