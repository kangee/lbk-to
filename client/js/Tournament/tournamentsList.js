
Meteor.subscribe("tournament");

Template.tournamentsList.helpers({
	tornaments: function(){
		return Tournament.find({},{sort:{StartDate:1}});
	}
	
});


Template.tournamentListItem.helpers({
	Date: function(date){
		var _date = new Date(date);
		return _date.toLocaleDateString();
 	}
});