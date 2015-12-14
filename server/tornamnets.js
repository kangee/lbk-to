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
		_player.Points = 0;
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

		_players.sort(playerSort);

		if(round <= _rounds.length){
			var games = matchPlayers(_players);

			_rounds[round-1].Games = games;
			_rounds[round-1].paried = true;
			Tournaments.update({Name:tournamentName},{$set:{Rounds:_rounds, Players:_players}});
		}else{
			Tournaments.update({Name:tournamentName},{$set:{Players:_players}});
		}
	},
	reportResult:function(tournamentName, round , table , playerOne , playerOneScore , playerTwo , playerTwoScore){
		var tournament = Tournaments.findOne({Name:tournamentName});
		var _rounds = tournament.Rounds;
		var _games = _rounds[round-1].Games;
		var _players = tournament.Players;

		_games[table].Result = playerOneScore + "-" + playerTwoScore;

		for (var i = _players.length - 1; i >= 0; i--) {
			if (_players[i].Id === playerOne){
				_players[i].Points = Number(_players[i].Points) + Number(playerOneScore);
			}
			if (_players[i].Id === playerTwo){
				_players[i].Points = Number(_players[i].Points) + Number(playerTwoScore);
			}
		};
		_rounds[round-1].done = true;
		_players.sort(playerSort);
		Tournaments.update({Name:tournament.Name},{$set: {Rounds: _rounds, Players: _players}});

		for (var i = _games.length - 1; i >= 0; i--) {
			if (_games[i].Result === null){
				return
			}
		};
		var next = Number(round) + 1;
		Meteor.call("pairRound",tournamentName, next);

	}
})



var playerSort = function(player1, player2){
	return player2.Points - player1.Points
}

var matchPlayers= function(Players){
	var games = [];
	var playerDict = {};

	for (var i = Players.length - 1; i >= 0; i--) {
		playerDict[Players[i].Id] = Players[i];
	};

	var j = 0;
	for (var i = 0; i < Players.length; i=i+2) {
		games[j] = {
			PlayerOne: Players[i].Id,
			PlayerTwo: Players[i+1].Id,
			Result: null,
			Table: j
		};
		j++;
	};
	return games;
}


