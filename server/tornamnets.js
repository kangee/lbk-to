Meteor.publish("tournaments",function(){
    return Tournaments.find({});
});

Meteor.methods({
	createTournament:function(tournament){
		tournament.TO = Meteor.user().username;
		Tournaments.insert(tournament);
	},
	addPlayer:function(tournamentName, Player){
		var _player = Player;
		var id = new Mongo.ObjectID();
		_player.Id = id._str;
		_player.Points = 3;
		Tournaments.update({ Name: tournamentName },{ $push: { Players: _player }})
	},
	removePlayer:function(tournamentName,PlayerID){
		Tournaments.update({ Name : tournamentName } ,{ $pull : {Players: { Id:PlayerID } } } );
	},
	startTournament:function(tournamentName){
		Tournaments.update({ Name : tournamentName } ,{ $set : {started: true } } );
		Meteor.call("pairRound",tournamentName,1);		
	},
	pairRound:function(tournamentName,round){
		var tournament = Tournaments.findOne({Name:tournamentName});
		var _rounds = tournament.Rounds;
		var _players = tournament.Players;
		console.log("before sort");
		_players.sort(playerSort);
		console.log("after sort");

		var games = matchPlayers(_players);
		console.log("after matching");
		console.log(games);

		_rounds[round-1].Games = games;
		_rounds[round-1].paried = true;
		Tournaments.update({Name:tournamentName},{$set:{Rounds:_rounds, Players:_players}});
	}

})



var playerSort = function(player1, player2){
	console.log("sorting a pair");
	return player2.Points - player1.Points
}

var matchPlayers= function(Players){
	console.log(Players.length);
	console.log(Players);
	var games = [];
	for (var i = 0; i < Players.length; i=i+2) {
		console.log("paring game: "+i);
		games[i] = {
			PlayerOne: Players[i].Id,
			PlayerTwo: Players[i+1].Id
		};
	};

	return games;
}