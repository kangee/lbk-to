
Meteor.validationHelpers = {
	isTo: function(tournament){
		return tournament.TO === Meteor.user().username;
	},

	isSignedUp: function(tournament){
		var player = Meteor.tournamentHelpers.findPlayer(tournament);
		if( player != null && player.User === Meteor.user().username){
			return true;
		}
		return false;
	},
	isPlayer: function(tournament, playerId){
		var player = Meteor.tournamentHelpers.findPlayer(tournament);
		if( player != null && player.Id === playerId && player.User === Meteor.user().username){
			return true;
		}
		return false;
	},
	checkTable: function(tournament, round , table , playerOne, playerTwo){
		var game = tournament.Rounds[round-1].Games[table-1];
		if(game.PlayerOne === playerOne && game.PlayerTwo === playerTwo){
			console.log("validated");
			return true
		}
		return false;
	}
}
