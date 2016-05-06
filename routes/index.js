var express = require('express');
var router = express.Router();
var homeController = require('../controllers/home.js');
var setCalendarController = require('../controllers/setcalendar.js');
var webhooks = require('../controllers/webhooks.js');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	// route for facebook authentication and login
	// different scopes while logging in
	router.get('/login/facebook', 
	  passport.authenticate('facebook', { scope : ['email','user_events','rsvp_event'] }
	));
	 
	// handle the callback after facebook has authenticated the user
	router.get('/login/facebook/callback', 
	  passport.authenticate('facebook', {
	    successRedirect : '/home',
	    failureRedirect : '/' 
	  })
	);




	router.get('/login/cronofy',
	  passport.authorize('cronofy', { scope : ['read_account','list_calendars','read_events','create_event','delete_event'] }));

	router.get('/login/cronofy/callback',
	  passport.authorize('cronofy', { failureRedirect: '/' }),
	  function(req, res) {
	    // Successful authorization, redirect home.
	    res.redirect('/home');
	  });

	/* GET Home Page */
	router.get('/home', isAuthenticated, homeController.home);
	router.post('/setcalendar', isAuthenticated, setCalendarController.set);

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	router.post('/webhooks/cronofy', webhooks.cronofy);
	router.post('/webhooks/facebook', webhooks.facebook);
	router.get('/webhooks/facebook', webhooks.facebook);
	return router;
}





