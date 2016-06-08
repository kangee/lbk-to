Meteor.tournamentHelpers = {
	findPlayer:function(tournament){

		for (var i = tournament.Players.length - 1; i >= 0; i--) {
			if(tournament.Players[i].User===Meteor.user().username){
				return tournament.Players[i];
			}
		};
		return null;
	}
}