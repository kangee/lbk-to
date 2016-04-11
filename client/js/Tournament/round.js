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
	},
	TempResult:function(player){
		if(this.TempResult !== null){
			var results = this.TempResult.split("-");
			return Number(results[player-1]);
		}
	}

});

Template.Tournament_round.events({
	"submit form":function(event){
		event.preventDefault();
		console.log("for submit");
		var tournamentName = Router.current().data().Tournament.Name;
		var playerOneScore = event.target["player-one"].value;
		var playerTwoScore = event.target["player-two"].value;
		var opponent = event.target["opponent"].value;
		var impresion = event.target["impresion"].value;
		var expresion = event.target["expresion"].value;

		if (Number(playerOneScore) + Number(playerTwoScore) != 20){
			alert("sum should be 20");
			return
		}

		Meteor.call("reportResult" , tournamentName, Router.current().data().Round, this.Table , this.PlayerOne , playerOneScore , this.PlayerTwo , playerTwoScore, opponent, impresion, expresion);
	},
	"click .player-one-report":function(event){
		event.preventDefault();
		$(event.toElement).parent().parent().children(".report-field-player-one").toggleClass("hidden");
	},

	"click .player-two-report":function(event){
		event.preventDefault();
		$(event.toElement).parent().parent().children(".report-field-player-two").toggleClass("hidden");
	}
});
