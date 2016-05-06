$("button").on( "click", function() {
	var button = $(this);
	//button.button('loading');
	$.post( "/setcalendar", {'calendarId':button.attr('name'),'action':button.html()}, function( data ) {	
		//button.button('reset');
		button.html(button.html()=="Sync"?"Unsync":"Sync");	
	});	
});