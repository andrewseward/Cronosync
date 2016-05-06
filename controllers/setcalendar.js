var calendarSync = require('../calendar-sync');

exports.set = function(req, res){
	try{
		//var calendarAction = JSON.parse(req.body);
		//console.log("Hello there! " + calendarAction);
		if (req.body.calendarId){
			if (req.body.action=='Sync')
				calendarSync.syncCalendar(req.user,req.body.calendarId);
			else if (req.body.action=='Unsync')
				calendarSync.unSyncCalendar(req.user,req.body.calendarId);
		}
		res.status(204).send();
	}
	catch (e) {
	  console.log("ERROR: ",e);
	  res.status(400).send({error: e});
	}
}


/*
cronofyUtil.getAccessToken(req.user, function(accessToken){
		  	if (accessToken){
		  		
		  	}
		 }
*/