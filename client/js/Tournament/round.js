Template.Tournament_round.helpers({

	Tournamnet:function(){
		return Router.current().data().Tournament
	},

	Round:function(){
		return Router.current().data().Round
	},

	Games:function(tournamnet, round){
		return tournamnet.Rounds[round-1].Games;
	},
	Paired:function(){
		var tournamnet = Router.current().data().Tournament;
		var roundIndex = Router.current().data().Round-1;
		return tournamnet.Rounds[roundIndex].paried;
	},
	Name: function(id){
		var players = Router.current().data().Tournament.Players;
		
		for (var i = players.length - 1; i >= 0; i--) {
			if(players[i].Id === id){
				return players[i].Name
			}
		};
	},
	isTo: function(){
		return Meteor.user().username === Router.current().data().Tournament.TO
	},

	notDone:function(){
		return this.Result === null;
	}

});

Template.Tournament_round.events({

	"submit form":function(event){
		event.preventDefault();
		var tournamentName = Router.current().data().Tournament.Name;
		var playerOneScore = event.target[0].value;
		var playerTwoScore = event.target[1].value;

		if (Number(playerOneScore) + Number(playerTwoScore) != 20){
			alert("sum should be 20");
			return
		}

		Meteor.call("reportResult" , tournamentName, Router.current().data().Round, this.Table , this.PlayerOne , playerOneScore , this.PlayerTwo , playerTwoScore);
	}

});
