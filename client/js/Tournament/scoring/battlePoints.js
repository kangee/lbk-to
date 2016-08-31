
Template.battlePoints_Scoring.helpers({
	
		TempResult:function(player){
		if(this.game.TempResult !== null){
			var results = this.game.TempResult.split("-");
			return Number(results[player-1]);
		}
	},
	canReport: function(id){
		var playerUserName = "";
		var players = Router.current().data().Tournament.Players;
		for (var i = players.length - 1; i >= 0; i--) {
			if(players[i].Id === id){
				playerUserName = players[i].User;
			}
		};
		return Meteor.user().username === Router.current().data().Tournament.TO || Meteor.user().username === playerUserName;
	},
	notDone:function(){
		return this.game.Result === null;
	},
	impressionTitle:function(){
		return "0-8 Modelling\n\t0-2= fluffy or narratively arranged.\n\t0-1= Coherent colours & markings.\n\t0-2= Symbols, banners etc.\n\t0-3 impression from modelling/posing and conversions\n0-7 Painting\n\t-5= unpainted model/s.\n\t1= Painted army.\n\t+1= Well painted army\n\t0-1= all models based ore not,\n\t0-2 = technical challenges.\n\t0-2 = details";
	},
	expressionTitle:function(){
		return "0-10 Sportsmanship\n\t0 = I will never want to play this person again.\n\t5 = “normal” nice opponent.\n\t10 = the best sportsman I can think of\n0-5 Army cheesyness\n\t0 = min-maxing, on the limits of the Comp.\n\t3 = Hard but balanced army,\n\t5 = fluffy and cosy army with 3+ non-optimal units";
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



Template.Tournament_round.events({
	"submit .player-submit":function(event){
		event.preventDefault();
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

		Meteor.call("reportResult" , tournamentName, Router.current().data().Round, this.game.Table , this.game.PlayerOne , playerOneScore , this.game.PlayerTwo , playerTwoScore, opponent, impresion, expresion);
	},
	"submit .admin-submit":function(event){
		event.preventDefault();
		var tournamentName = Router.current().data().Tournament.Name;
		var playerOneScore = event.target["player-one"].value;
		var playerTwoScore = event.target["player-two"].value;

		Meteor.call("updateResult" , tournamentName, Router.current().data().Round, this.game.Table , this.game.PlayerOne , playerOneScore , this.game.PlayerTwo , playerTwoScore);
	},

	"click .player-one-report":function(event){
		event.preventDefault();
		swapReportText($(event.toElement)[0]);
		$(event.toElement).parent().parent().children(".report-field-player-one").toggleClass("hidden");
	},

	"click .update-result":function(event){
		event.preventDefault();
		swapUpdateResultText($(event.toElement)[0]);
		$(event.toElement).parent().children(".admin-update-result").toggleClass("hidden");
	},
	"click .player-two-report":function(event){
		event.preventDefault();
		swapReportText($(event.toElement)[0]);
		$(event.toElement).parent().parent().children(".report-field-player-two").toggleClass("hidden");
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