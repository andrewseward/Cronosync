var facebook = require('./facebook');

exports.syncCalendar=function(user,calendarId){
	if (user) {
		if (!valueExists(calendarId, user.cronofy.synced_calendar_ids)){
        	// update the current users facebook credentials
	        user.cronofy.synced_calendar_ids.push(calendarId);

	        // save the user
	        user.save(function(err) {
	            if (err)
	                throw err;
	            else{
	            	process.nextTick(function() {
	            		facebook.syncEvents(user);
	            	});
	            }
	        });
	    }
	}
}

exports.unSyncCalendar=function(user,calendarId){
	if (user) {
		if (valueExists(calendarId, user.cronofy.synced_calendar_ids)){
        	// update the current users facebook credentials
		
	        user.cronofy.synced_calendar_ids.splice(user.cronofy.synced_calendar_ids.indexOf(calendarId),1);

	        // save the user
	        user.save(function(err) {
	            if (err)
	                throw err;
	            //else
	            	//Remove Facebook events
	        });
	    }
	}
}

function valueExists(value, values)
{
    return (values.indexOf(value) > -1);
}