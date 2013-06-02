/*
 * Get room page.
 */ 

var crypto = require('crypto');
 
exports.entrance = function(req, res) {
  res.render('room/room_entrance', {title: 'FootBallNode - room'});
};

exports.enter = function(req, res){
  var roomName = req.body.roomName || '';
  var yourName = req.body.yourName || '';
  var mode = req.body.mode;

  if (mode === undefined) {
    res.send(500);
    return;
  };
   
  var params = {
    //paramsとしてフォームの入力を入力
    title: 'FootBallNode room : ' + roomName,
    room: {
      name: roomName
    },
    user: {name: yourName},
    mode: mode
  };
  res.render('room/room', params);
};
