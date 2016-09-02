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
	isTo: function(){
		return Meteor.user().username === Router.current().data().Tournament.TO
	},
	canReDoParing:function(){
		if (Meteor.user().username === Router.current().data().Tournament.TO){
			var tournament = Router.current().data().Tournament;
			var round = Router.current().data().Round;
			if(tournament.Rounds[round-1].done){
				return false;
			}
			var noneReady = true;
			for (var i = tournament.Rounds[round-1].Games.length - 1; i >= 0; i--) {
				noneReady = noneReady && (tournament.Rounds[round-1].Games[i] === null || tournament.Rounds[round-1].Games[i].Result === null);
			};
			return noneReady
		}
		return false;
	},
	battlePoints:function(){
		return Router.current().data().Tournament.Scoring_type == "battlePoints_Scoring";
	},
});

Template.Tournament_round.events({
	"click .redo-paring":function(event){
		event.preventDefault();
		if(confirm("u sure?")){
			var tournamentName = Router.current().data().Tournament.Name;
			Meteor.call("reDoParing" , tournamentName, this.Round)
		}
	},
	"click #pair":function(event){
		event.preventDefault();
		if(confirm("u sure?")){
			var tournamentName = Router.current().data().Tournament.Name;
			Meteor.call("pairRound" , tournamentName, this.Round)
		}
	}
});

var swapReportText = function(element) {
	if(element.innerHTML === "Report"){
		element.innerHTML = "Close";
	}else{
		element.innerHTML = "Report"
	}
}

var swapUpdateResultText = function(element) {
	if(element.innerHTML === "Update Result"){
		element.innerHTML = "Close";
	}else{
		element.innerHTML = "Update Result"
	}
}

