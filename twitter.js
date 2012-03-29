// redis-cli

var twitter = require('ntwitter');
var redis = require('redis');
var credentials = require('./credentials.js');

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
   { track: ['awesome', 'cool', 'rad', 'gnarly', 'groovy'] },
    function(stream) {
        stream.on('data', function(tweet) {
			for(var i = 0; i < tweet.entities.urls.length; i++) {
				console.log(tweet.entities.urls[i]);
				console.log(tweet.text);
				//if awesome is in the tweet text, increment the counter
				if(tweet.text.match(tweet.entities.urls[i].url && /awesome/)) {
					//client.incr(tweet.entities.urls[i].url + ' and awesome');
					client.zadd('links', 1, tweet.entities.urls[i].url + ' and awesome');
				}
				/*if(tweet.text.match(tweet.entities.urls[i].url && /cool/)) {
					client.zadd('links', 1, tweet.entities.urls[i].url + ' and cool');
				}
				if(tweet.text.match(tweet.entities.urls[i].url && /rad/)) {
					client.zadd('links', 1, tweet.entities.urls[i].url + ' and rad');
				}
				if(tweet.text.match(tweet.entities.urls[i].url && /gnarly/)) {
					client.zadd('links', 1, tweet.entities.urls[i].url + ' and gnarly');
				}
				if(tweet.text.match(tweet.entities.urls[i].url && /groovy/)) {
					client.zadd('links', 1, tweet.entities.urls[i].url + ' and groovy');
				}
				*/
			}
        });
    }

/*    'statuses/filter',
    { track: ['awesome', 'cool', 'rad', 'gnarly', 'groovy'] },
    function(stream) {
        stream.on('data', function(tweet) {
            console.log(tweet.text);
            //if awesome is in the tweet text, increment the counter                                                                                                                                                                        
            if(tweet.text.match(/awesome/)) {
                client.incr('awesome');
            }
            if(tweet.text.match(/cool/)) {
                client.incr('cool');
            }
            if(tweet.text.match(/rad/)) {
                client.incr('rad');
            }
            if(tweet.text.match(/gnarly/)) {
                client.incr('gnarly');
            }
            if(tweet.text.match(/groovy/)) {
                client.incr('groovy');
            }			
        });
    }
	*/
);