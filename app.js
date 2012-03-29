
/**
 * Module dependencies.
 * Test_text
 */

var express = require('express')
  , routes = require('./routes');
var redis = require('redis');
var client = redis.createClient();

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
var statement;
/*
client.zrevrange(['links', 0, 0], function(error, responses) {
	console.log(responses);
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end('The most awesome link is: ' + responses[0]);		
});
*/
var count = 2;

app.get('/', routes.index);
/*app.get('/word/awesome', function(req, res) {
	//get the count from redis
	res.render('/word/awesome', {awesomeCount:count});
});*/

// Last resort if cannot get awesome.ejs to work
app.get('/word/:word', function(req, res) { 
	client.zrevrange([req.params.word, 0, 0], function(error, count) {
		if (error) {
					console.log (error);
		}
		else if (!count.length) {
			res.send('Nothing yet!');
		}
		else {
			res.send('The most ' + req.params.word + ' link is ' + count + '.');
		}	
	});
});

/*
app.get('/word/awesome', function(req, res) {
	//get the count from redis
	client.zrevrange(['links', 0, 0], function(error, count) {
		if (error) {
					console.log (error);
		}
		else {
			res.render('/word/awesome', {awesomeCount:count});
		}	
	});
});
*/
app.get('/users/:user', routes.user);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
