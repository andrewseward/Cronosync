
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	_id: String,
	fb: {
		id: String,
		access_token: String,
		refresh_token: String,
		displayName: String,
		firstName: String,
		lastName: String,
		email: String
	},
	cronofy: {
		access_token: String,
		refresh_token: String,
		synced_calendar_ids: [String],
		channel_id: String
	}
	
});

