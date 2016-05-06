var graph = require('fbgraph');
var cronofy = require('cronofy');
var cronofyUtil = require('../cronofy-util');
exports.home = function(req, res){
  graph.get("/" + req.user._id + "/picture", function(err, fbResponse) {
  	var profileImageUrl = '';
  	if (fbResponse.location)
  		profileImageUrl = fbResponse.location;


  	cronofyUtil.getAccessToken(req.user, function(accessToken){
	  	if (accessToken){
	  		cronofy.profileInformation({access_token:accessToken}, function(cronofyProfileResponseError,cronofyProfileResponse){
			  	cronofy.listCalendars({access_token:accessToken}, function(cronofyResponseError,cronofyResponse){
					var calendars ={"profiles":[]};
					cronofyProfileResponse.profiles.forEach(function(profile){
						if (profile.profile_connected == true){
							var newProfile =   {"provider_name":profile.provider_name,
												"profile_id":profile.profile_id,
												"profile_name":profile.profile_name,
												"calendars":[]};
							cronofyResponse.calendars.forEach(function(calendar){
								if ((calendar.calendar_deleted==false)
									&& (calendar.calendar_readonly==false)
									&& (calendar.profile_id == profile.profile_id)){
									var synced = valueExists(calendar.calendar_id,req.user.cronofy.synced_calendar_ids);
									var newCalendar = {"calendar_id":calendar.calendar_id,
														"calendar_name":calendar.calendar_name,
														"synced":synced};
									newProfile.calendars.push(newCalendar);
								}
							});
							calendars.profiles.push(newProfile);
						}
					});

			  		res.render('home', { user: req.user, profileImageUrl: profileImageUrl, calendarProfiles: calendars});
			  	});
			 });
		}
		else
	  		res.render('home', { user: req.user, profileImageUrl: profileImageUrl });
	  });
  });
};

function valueExists(value, values)
{
	
    return (values.indexOf(value) > -1);
}