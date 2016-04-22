var graph = require('fbgraph');
var cronofy = require('cronofy');
var cronofyUtil = require('../cronofy-util');
exports.home = function(req, res){
  graph.get("/" + req.user._id + "/picture", function(err, fbResponse) {
  	console.log('fbResponse',fbResponse);
  	var profileImageUrl = '';
  	if (fbResponse.location)
  		profileImageUrl = fbResponse.location;


  	cronofyUtil.getAccessToken(req.user, function(accessToken){
	  	if (accessToken){
	  		cronofy.profileInformation({access_token:accessToken}, function(cronofyProfileResponseError,cronofyProfileResponse){
			  	cronofy.listCalendars({access_token:accessToken}, function(cronofyResponseError,cronofyResponse){
					console.log('cronofyResponse',cronofyResponse)
					var calendars ={"profiles":[]};
					cronofyProfileResponse.profiles.forEach(function(profile){
						if (profile.profile_connected == true){
							var newProfile =   {"provider_name":profile.provider_name,
												"profile_id":profile.profile_id,
												"profile_name":profile.profile_name,
												"calendars":[]};
							cronofyResponse.calendars.forEach(function(calendar){
								if ((calendar.calendar_deleted=='false')
									&& (calendar.readonly=='false')
									&& (calendar.profile_id == profile.profile_id)){
									console.log('adding Calendar',calendar);
									newProfile.calendars.push(calendar);
								}
							});
							calendars.profiles.push(newProfile);
						}
					});
					console.log('renderedcalendars',calendars);
			  		res.render('home', { user: req.user, profileImageUrl: profileImageUrl, calendarProfiles: calendars});
			  	});
			 });
		}
		else
	  		res.render('home', { user: req.user, profileImageUrl: profileImageUrl });
	  });
  });
};