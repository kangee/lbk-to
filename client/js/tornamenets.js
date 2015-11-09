
Meteor.subscribe("tornaments");

Template.tornamentsList.helpers({
	tornaments: function(){
		return Tornaments.find({},{sort:{StartDate:1}});
	}
});
