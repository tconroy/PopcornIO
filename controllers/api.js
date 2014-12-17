var secrets     = require('../config/secrets');
var User        = require('../models/User');
var querystring = require('querystring');
var validator   = require('validator');
var async       = require('async');
var cheerio     = require('cheerio');
var request     = require('request');
var graph       = require('fbgraph');

var clockwork   = require('clockwork')({key: secrets.clockwork.apiKey});
var Y           = require('yui/yql');
var _           = require('lodash');

/**
 * GET /api
 * List of API examples.
 */

exports.getApi = function(req, res) {
  res.render('api/index', {
    title: 'API Examples'
  });
};



/**
 * GET /api/scraping
 * Web scraping example using Cheerio library.
 */

exports.getScraping = function(req, res, next) {
  request.get('https://news.ycombinator.com/', function(err, request, body) {
    if (err) return next(err);
    var $ = cheerio.load(body);
    var links = [];
    $('.title a[href^="http"], a[href^="https"]').each(function() {
      links.push($(this));
    });
    res.render('api/scraping', {
      title: 'Web Scraping',
      links: links
    });
  });
};



/**
 * GET /api/aviary
 * Aviary image processing example.
 */

exports.getAviary = function(req, res) {
  res.render('api/aviary', {
    title: 'Aviary API'
  });
};




/**
 * GET /api/clockwork
 * Clockwork SMS API example.
 */

exports.getClockwork = function(req, res) {
  res.render('api/clockwork', {
    title: 'Clockwork SMS API'
  });
};

/**
 * POST /api/clockwork
 * Send a text message using Clockwork SMS
 */

exports.postClockwork = function(req, res, next) {
  var message = {
    To: req.body.telephone,
    From: 'Hackathon',
    Content: 'Hello from the Hackathon Starter'
  };
  clockwork.sendSms(message, function(err, responseData) {
    if (err) return next(err.errDesc);
    req.flash('success', { msg: 'Text sent to ' + responseData.responses[0].to });
    res.redirect('/api/clockwork');
  });
};

/**
 * GET /api/yahoo
 * Yahoo API example.
 */

exports.getYahoo = function(req, res) {
  Y.YQL('SELECT * FROM weather.forecast WHERE (location = 10007)', function(response) {
    var location = response.query.results.channel.location;
    var condition = response.query.results.channel.item.condition;
    res.render('api/yahoo', {
      title: 'Yahoo API',
      location: location,
      condition: condition
    });
  });
};



/**
 * POST /api/addFriend
 * checks if a user with provided email exists. If they do, then add them to the friends array.
 */
exports.postAddFriend = function(req, res) {

  var statusMsg, code;

  var reqEmail = req.params.value;

  // bad request -- cant friend yourself! exit.
  if (req.user.email === reqEmail) {
    res.writeHead(400, {'content-type': 'text/json'});
    res.write( JSON.stringify({statusMsg: 'You cant friend request yourself dummy.'}) );
    res.end('\n');
    return;
  }

  // perform query for user.
  var queryResult = User.findOne({'email': reqEmail}, 'email profile _id', function (err, result) {

    // if user with that email doesn't exist, exit.
    if(err || !result) {
      res.writeHead(404, {'content-type': 'text/json'});
      res.write( JSON.stringify({'statusMsg': 'User not found.'}) );
      res.end('\n');
      return;
    }

    // user was found. create friendship.
    if ( result ) {
      User.requestFriend(req.user.id, result.id, function(err, response) {
        if ( !err ) {
          console.dir(response);
          var msg;
          switch(response.friend.status) {
            case 'accepted':  msg = 'You and ' + result.profile.name + ' Are now friends!'; break;
            case 'requested': msg = 'Friend requested!'; break;
            case 'pending':   msg = "Friend request pending acceptance!"; break;
          }
          res.writeHead(200, {'content-type': 'text/json'});
          res.write( JSON.stringify({'statusMsg': msg}));
          res.end('\n');
          return;
        }
      });
    }
  });
};