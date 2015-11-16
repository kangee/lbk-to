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
	}

});

Template.tournament.events({
	'submit form':function(event){
		event.preventDefault();
		var name = document.getElementById("name").value;
		document.getElementById("name").value = "";
		var Player = {
			Name: name
		};
		Meteor.call('addPlayer',Router.current().data().Tournament.Name, Player)
	},
	'click .delete-player':function(){
		var tournamentName = Router.current().data().Tournament.Name;
		var playerId = this.Id;
		Meteor.call('removePlayer',tournamentName,playerId);
	}


});