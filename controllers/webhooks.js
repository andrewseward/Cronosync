var calendarSync = require('../calendar-sync');
var fbConfig = require('../fb.js');

exports.cronofy = function(req, res){
	console.log("Cronofy endpoint hit!");
	console.log(req.body);
	res.status(200).send();
}

exports.alwaysSlow = function(req, res){
	console.log("alwaysSlow endpoint hit!");
	console.log(req.body);
	setTimeout(function() {
	  res.status(200).send();
	}, 35000);
}

exports.always400 = function(req, res){
	console.log("always400 endpoint hit!");
	console.log(req.body);
	res.status(404).send();
}

exports.facebook = function(req, res){
	console.log(req.query);
	try{
		if ((req.query.hub.verify_token) && (req.query.hub.verify_token = ifbConfig.verificationToken)){
			res.status(200).send(req.query.hub.challenge);
		}
	}
	catch(e)
	{
		console.log("Error with Facebook Webhook",e);
	}
	res.status(400).send();
}