var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var fbConfig = require('../fb.js');

module.exports = function(passport) {

    passport.use('facebook', new FacebookStrategy({
        clientID        : fbConfig.appID,
        clientSecret    : fbConfig.appSecret,
        callbackURL     : fbConfig.callbackUrl
    },

    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {


		// asynchronous
		process.nextTick(function() {
			// find the user in the database based on their facebook id
	        User.findOne({ '_id' : profile.id }, function(err, user) {

	        	// if there is an error, stop everything and return that
	        	// ie an error connecting to the database
	            if (err){
	                console.log("Error occurred in Facebook.js!",err)
	                return done(err);
	            }

				// if the user is found, then log them in
	            if (!user)
	                user = new User(); // user found, return that user
            
                // if there is no user found with that facebook id, create them
               

				// set all of the facebook information in our user model
                user._id = profile.id;
                user.fb.id    = profile.id; // set the users facebook id	                
                user.fb.access_token = access_token; // we will save the token that facebook provides to the user	                
                user.fb.firstName  = profile.name.givenName;
                user.fb.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
                user.fb.displayName = profile.displayName;
                if ((profile.hasOwnProperty('emails')) && (profile.emails.length > 0)){
                	user.fb.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                }

				// save our user to the database
                user.save(function(err) {
                    if (err)
                        throw err;

                    // if successful, return the new user
                    return done(null, user);
                });
	        });
        });
    }));
};