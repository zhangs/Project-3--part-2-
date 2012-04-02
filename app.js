
/**
 * Module dependencies.
 * Test_text
 */

var express = require('express')
  , routes = require('./routes');
var redis = require('redis');
var client = redis.createClient();

// Starts twitter module
var TwitterWorker = require('./twitter.js');
var t = new TwitterWorker();

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/word/:word', function(req, res) {
	//get the count from redis
	client.zrevrange([req.params.word, 0, 0], function(error, linkresult) {
		if (error) {
					console.log (error);
		}
		else if (!linkresult.length) {
			res.render('word/empty', {link:'Nothing yet'});
		}		
		else {
			res.render('word/awesome', {link:linkresult});
		}	
	});
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
