

Template.tournamentsList.helpers({
	tournaments: function(){
		return Tournaments.find({},{sort:{StartDate:1}});
	}
	
});

Template.tournamentsList.events({

	'click button':function(){
		Router.go("createTournament");
	}

});


Template.tournamentListItem.helpers({
	Date: function(date){
		var _date = new Date(date);
		return _date.toLocaleDateString();
 	}
});