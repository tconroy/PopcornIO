var User   = require('../models/User');
var Status = require("mongoose-friends").Status;

/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {

  User.getFriends(req.user, function(err, docs) {
    var accFriends = [], otherFriends = [];
    if(!err) {
      for( var i=0, len=docs.length; i<len; i++ ) {
        if (docs[i].status === 'accepted') {
          accFriends.push(docs[i]);
        } else {
          otherFriends.push(docs[i]);
        }
      }
    }
    res.render('home', {
      title: 'Home',
      pageData: {
        friends: {
          accepted: accFriends,
          other: otherFriends
        }
      }
    });
  });
};
