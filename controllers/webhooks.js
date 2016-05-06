var calendarSync = require('../calendar-sync');
var fbConfig = require('../fb.js');

exports.cronofy = function(req, res){
	console.log(req.body);
}

exports.facebook = function(req, res){
	console.log(req.query);
	try{
		if ((req.query.hub.verify_token) && (req.query.hub.verify_token = ifbConfig.verificationToken)){
			res.status(204).send(req.query.hub.challenge);
		}
	}
	catch(e)
	{
		console.log("Error with Facebook Webhook",e);
	}
	res.status(400).send();
}