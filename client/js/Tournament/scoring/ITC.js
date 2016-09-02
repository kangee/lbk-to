Template.ITC_Scoring.helpers({

	TempResult:function(player){
		if(this.game.TempResult !== null){
			var results = this.game.TempResult.split("-");
			return Number(results[player-1]);
		}
	},
	canReport: function(){
		var playerOneUserName = "";
		var playerTwoUserName = "";
		var players = Router.current().data().Tournament.Players;
		var playerOneId = this.game.PlayerOne;
		var playerTwoId = this.game.PlayerTwo;
		for (var i = players.length - 1; i >= 0; i--) {
			if(players[i].Id === playerOneId){
				playerOneUserName = players[i].User;
			}
			if(players[i].Id === playerTwoId){
				playerTwoUserName = players[i].User;
			}

		};
		return Meteor.user().username === Router.current().data().Tournament.TO || Meteor.user().username === playerOneUserName || Meteor.user().username === playerTwoUserName;
	},
	notDone:function(){
		return this.game.Result === null;
	},
	isTo: function(){

		return Meteor.user().username === Router.current().data().Tournament.TO
	},
	Name: function(id){

		var players = Router.current().data().Tournament.Players;
		
		for (var i = players.length - 1; i >= 0; i--) {
			if(players[i].Id === id){
				return players[i].Name
			}
		};
	}
});

Template.ITC_Scoring.events({
	"submit .player-submit":function(event){
		event.preventDefault();
		var tournamentName = Router.current().data().Tournament.Name;
		var playerOneScore = event.target["player-one"].value;
		var playerTwoScore = event.target["player-two"].value;

		//TODO add check for valid result 
		if (false && Number(playerOneScore) + Number(playerTwoScore) != 20){
			alert("sum should be 20");
			return
		}

		Meteor.call("reportResult" , tournamentName, Router.current().data().Round, this.game.Table , this.game.PlayerOne , playerOneScore , this.game.PlayerTwo , playerTwoScore);
	},
	"submit .admin-submit":function(event){
		event.preventDefault();
		var tournamentName = Router.current().data().Tournament.Name;
		var playerOneScore = event.target["player-one"].value;
		var playerTwoScore = event.target["player-two"].value;

		Meteor.call("updateResult" , tournamentName, Router.current().data().Round, this.game.Table , this.game.PlayerOne , playerOneScore , this.game.PlayerTwo , playerTwoScore);
	},
	"click .player-report":function(event){
		event.preventDefault();
		swapReportText($(event.toElement)[0]);
		$(event.toElement).parent().children(".player-report-container").toggleClass("hidden");

	},
	"click .update-result":function(event){
		event.preventDefault();
		swapUpdateResultText($(event.toElement)[0]);
		$(event.toElement).parent().children(".admin-update-result").toggleClass("hidden");
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