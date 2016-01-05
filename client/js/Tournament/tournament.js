Template.tournament.helpers({
	Tournament:function(){
		return Router.current().data().Tournament
	},
	Date: function(date){
		var _date = new Date(date);
		return  _date.toLocaleDateString();
	},
	isTo: function(){
		return Meteor.user().username === Router.current().data().Tournament.TO
	},
	notStarted:function(){
		return !Router.current().data().Tournament.started
	}

});

Template.tournament.events({
	'submit form':function(event){
		event.preventDefault();
		var name = document.getElementById("name").value;
		var club = document.getElementById("club").value;		
		document.getElementById("name").value = "";
		document.getElementById("club").value = "";
		var Player = {
			Name: name,
			Club: club
		};
		Meteor.call('addPlayer',Router.current().data().Tournament.Name, Player)
	},
	'click .delete-player':function(){
		var tournamentName = Router.current().data().Tournament.Name;
		var playerId = this.Id;
		Meteor.call('removePlayer',tournamentName,playerId);
	},
	'click .start-tournament':function(){
		var tournamentName = Router.current().data().Tournament.Name;
		Meteor.call('startTournament',tournamentName);
	}
});