var CronofyStrategy = require('passport-oauth2').Strategy,
	refresh = require('passport-oauth2-refresh');
var User = require('../models/user');
var cronofyConfig = require('../cronofyConfig.js');
module.exports = function(passport) {
	var strategy = new CronofyStrategy({
	    authorizationURL: 'https://app.cronofy.com/oauth/authorize',
	    tokenURL: 'https://api.cronofy.com/oauth/token',
	    clientID: cronofyConfig.appID,
	    clientSecret: cronofyConfig.appSecret,
	    callbackURL: cronofyConfig.callbackUrl,
	    passReqToCallback: true
	  },
	    function(req, access_token, refresh_token, profile, done) {
	    	console.log('Cronofy auth ok!');
	    	//console.log('profile', profile);
	    	//console.log('access_token', access_token);
	    	//console.log('refresh_token', refresh_token);
			//console.log('req.user', req.user);
			//console.log('req.session.passport.user', req.session.passport.user);
			// asynchronous
			process.nextTick(function() {

				// find the user in the database based on their facebook id
				
		        if (req.user) {
		        	var user = req.user;
                	// update the current users facebook credentials
	                user.cronofy.access_token = access_token;
		            user.cronofy.refresh_token = refresh_token;

	                // save the user
	                user.save(function(err) {
	                    if (err)
	                        throw err;
	                    return done(null, user);
	                });

     			}
     			else{
     				throw new Error('You must log in using Facebook');
     			}
     		});
        }

    );

    passport.use('cronofy',strategy);
    refresh.use('cronofy',strategy);
};