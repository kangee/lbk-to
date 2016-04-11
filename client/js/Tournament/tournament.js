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
	},
	canSignUp:function(){
		var tournament = Router.current().data().Tournament;
		var isSignedUp = tournament.Players.reduce(function(prev,curr){
			return Meteor.user().profile.Name === curr.Name || prev;
		}, false);
		return !tournament.started && !isSignedUp;
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
	},
	'click #sort-on-ranking':function(){
		var tournamentName = Router.current().data().Tournament.Name;
		Meteor.call('sortOnRanking',tournamentName);
	},
	'click .signup':function(event){
		event.preventDefault();
		console.log(Meteor.user());
		var userProfile = Meteor.user().profile;

		if(userProfile != null &&  userProfile.Name != null){
			var Player = {
				Name: userProfile.Name,
				Club: userProfile.Club,
				User: Meteor.user().username
			}
		} else{
			var Player = {
				Name: Meteor.user().username,
				Club: "",
				User: Meteor.user().username
			}
		}

		
		Meteor.call('addPlayer',Router.current().data().Tournament.Name, Player)
	}
});