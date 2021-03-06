var cronofy = require('cronofy');
var refresh = require('passport-oauth2-refresh');

exports.getAccessToken = function(user, callback){
	if (user.cronofy.access_token){
		cronofy.accountInformation({access_token:user.cronofy.access_token}, function(err,res){
			if ((err) && (err.status.code=='401')){
				refresh.requestNewAccessToken('cronofy', user.cronofy.refresh_token, function(accessTokenErr, newAccessToken, newRefreshToken) {
		 			exports.updateCronofyKeys(user,newAccessToken,newRefreshToken);
		 			process.nextTick(function(){
						callback(newAccessToken);
					});
				});
			}
			else {
				process.nextTick(function(){
					callback(user.cronofy.access_token);
				});
			}
		});
	}
	else {
		process.nextTick(function(){
			callback("");
		});
	}
};

exports.removeCronofyKeys = function(user){ 
	user.cronofy.access_token = "";
    user.cronofy.refresh_token = "";

    // save the user
    user.save(function(err) {
        if (err)
            throw err;
    });
}

exports.updateCronofyKeys = function(user, accessToken, refreshToken){
	process.nextTick(function() {
        if (user) {
        	// update the current users facebook credentials
            user.cronofy.access_token = accessToken;
            user.cronofy.refresh_token = refreshToken;

            // save the user
            user.save(function(err) {
                if (err)
                    throw err;
            });
		}
	})
}
