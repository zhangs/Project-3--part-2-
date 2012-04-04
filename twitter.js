// redis-cli

var http = require('http');
var twitter = require('ntwitter');
var redis = require('redis');
var credentials = require('./credentials.js');

function TwitterWorker() {
//create redis client                                                                                                                                                                                                                       
var client = redis.createClient();

//if the 'awesome' key doesn't exist, create it      
// Non-blocking, thus everything runs at once
// fucntion takes error and then results     
// Automatically done for you, so no need, actually                                                                                                                                                                                  
/*client.exists('awesome', function(error, exists) {
    if(error) {
        console.log('ERROR: '+error);
    } else if(!exists) {
        client.set('awesome', 0); //create the awesome key
    };
});
*/

var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

t.stream(
	'statuses/filter',
	// no track parameter for statuses/links
   { track: ['awesome', 'cool', 'gnarly', 'bad', 'painful', 'lovely', 'interesting'] },
    function(stream) {
        stream.on('data', function(tweet) {
			for(var i = 0; i < tweet.entities.urls.length; i++) {
				console.log(tweet.entities.urls[i]);
				console.log(tweet.text);
				//if word is in the tweet text, increment counter of that link in that set
				if(tweet.text.match(tweet.entities.urls[i].url && /awesome/)) {
					client.zadd('awesome', 1, tweet.entities.urls[i].url);
				}
				if(tweet.text.match(tweet.entities.urls[i].url && /cool/)) {
					client.zadd('cool', 1, tweet.entities.urls[i].url);
				}
				if(tweet.text.match(tweet.entities.urls[i].url && /gnarly/)) {
					client.zadd('gnarly', 1, tweet.entities.urls[i].url);
				}
				if(tweet.text.match(tweet.entities.urls[i].url && /bad/)) {
					client.zadd('bad', 1, tweet.entities.urls[i].url);
				}
				if(tweet.text.match(tweet.entities.urls[i].url && /painful/)) {
					client.zadd('painful', 1, tweet.entities.urls[i].url);
				}
				if(tweet.text.match(tweet.entities.urls[i].url && /lovely/)) {
					client.zadd('lovely', 1, tweet.entities.urls[i].url);
				}
				if(tweet.text.match(tweet.entities.urls[i].url && /interesting/)) {
					client.zadd('interesting', 1, tweet.entities.urls[i].url);
				}				
			}
        });
    }
);
};

module.exports = TwitterWorker;