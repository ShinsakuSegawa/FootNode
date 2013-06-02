/*
 * Get room page.
 */ 

exports.index = function(req, res) {
  res.render('room/room_entrance', {title: 'FootBallNode - room'});
};

