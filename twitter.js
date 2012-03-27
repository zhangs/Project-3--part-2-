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
	
//<--Returns all statuses containing http: and https:. 
//  The links stream is not a generally available resource. Few applications require this level 
//  of access. Creative use of a combination of other resources and various access levels can 
//  satisfy nearly every application use case.
// Use this?
// OR
// Use twitter search API's (word) filter:links to find something with a link and a (word)? 
// Probably not?


// I want to collect the links and store them in redis as a string, 
// when a link and a selected word is detected together in the same tweet, storing the link
// and a count of the link. The link is in an array of strings.

// Then I will go through each string (link) in the array and use
// zadd (list name) (matching count of the link through search) (link as a string)
// to create a sorted set

// After the sorted set is complete, it will be ordered from lowest to highest, so
// re-sort the opposite way zrevrange (list name) 0 -1
// and then
// Key 1
// to find the most common link
// is my idea, but not sure how to do it

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