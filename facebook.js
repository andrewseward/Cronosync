var graph = require('fbgraph');
var cronofy = require('cronofy');
var cronofyUtil = require('./cronofy-util');

exports.syncEvents = function(user){
	var options = {
	    timeout:  3000
	  , pool:     { maxSockets:  Infinity }
	  , headers:  { connection:  "keep-alive" }
	};
	cronofyUtil.getAccessToken(user, function(cronofyAccessToken){
	  	if (cronofyAccessToken){
			var fbUrl = "me/events?type=attending&since=" + Math.floor(Date.now() / 1000);
			graph
		  		.setOptions(options)
		  		.get(fbUrl, {access_token:user.fb.access_token}, function(err, res) {
		  			
		  			//var fbData = JSON.parse(res);
		  			if (res.data){
		  				
			    		res.data.forEach(function(event){
							user.cronofy.synced_calendar_ids.forEach(function(calendarId){
								var options = {'access_token':cronofyAccessToken,'calendar_id':calendarId,'event_id':event.id,'start':event.start_time, 'summary':'[FB] '};
								if (event.name)
									options.summary += event.name;
								if (event.description)
									options.description = event.description;
								
								var eventEndDate;

								if (event.end_time){
									eventEndDate = event.end_time;
								}
								else{
									eventEndDate = new Date(new Date(event.start_time) + (1*60*60*1000)).toISOString();
								}

								options.end = eventEndDate;

								if (event.location)
									options.location.description = serialiseLocation(event);
								cronofy.createEvent(options, function(err, response){
										
										if(err){
											console.log("Cronofy createEvent Error", err);
											throw err;
										}
										
									})

								})
							});
		    			}
		    	});
	  	}
	 });

}

function serialiseLocation(event){
	var location = "";
	if (event.place.name){
		location += event.place.name;
		location += ", ";
	}
	if (event.place.location.street){
		location += event.place.location.street;
		location += ", ";
	}
	if (event.place.location.city){
		location += event.place.location.city;
		location += ", ";
	}
	if (event.place.location.zip){
		location += event.place.location.zip;
		location += ", ";
	}
	if (event.place.location.country){
		location += event.place.location.country;
		location += ", ";
	}
	if (location.endsWith(", "))
		location = location.slice(0, -2);

	return location;
}