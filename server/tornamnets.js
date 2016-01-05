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
		_player.Oponents = [];
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

var calcCost= function(player1 , player2){
	var cost = 0;

	var haveMet = false;
	for (var i = player1.Oponents.length - 1; i >= 0; i--) {
		if(player1.Oponents[i] === player2.Id){
			haveMet += true;
		}
	};

	if(player1.Id === player2.Id) return 10000;
	if(haveMet) cost += 1000;
	cost += Math.abs(player1.Points - player2.Points);
	return cost;

}


var playerSort = function(player1, player2){
	return player2.Points - player1.Points
}

var hasMeet = function(playerOne,playerTwo){
	for (var i = 0; i < playerOne.Oponents.length; i++) {
		if (playerOne.Oponents[i] === playerTwo.Id){
			return true;
		}
	};

	return false;
}

var redoOne = function(Games, Players, remaningPlayers, badMachup){

	game = Games[Games.length-1];
	Games.splice(Games.length-1);
	addToBadMacthup(badMachup, game.PlayerOne, game.PlayerTwo);
	return clearGame(Players, remaningPlayers, game.PlayerOne, game.PlayerTwo);
	
}

var addToBadMacthup= function(badGames, PlayerOneId, PlayerTwoId){
	badGames[PlayerOneId].push(PlayerTwoId);
	badGames[PlayerTwoId].push(PlayerOneId);
}

var clearGame= function(Players, remaningPlayers, PlayerOneId, PlayerTwoId){
	var playerOne;
	var playerTwo;
	for (var i = 0; i < Players.length; i++) {
		if(Players[i].Id === PlayerOneId){
			var index = IndexOf(Players[i].Oponents,PlayerTwoId);
			Players[i].Oponents.splice(index, 1);
			playerOne = {
				Player: Players[i],
				Index: i
			}
		}
		if(Players[i].Id === PlayerTwoId){
			var index = IndexOf(Players[i].Oponents,PlayerOneId);
			Players[i].Oponents.splice(index, 1);
			playerTwo = {
				Player: Players[i],
				Index: i
			}
		}
	};
	return [playerOne,playerTwo];

}

var IndexOf = function(array, element){
	for (var i = array.length - 1; i >= 0; i--) {
		if(array[i]===element){
			return i
		}
	};
	return -1
}

var createGame = function(Players, playerOneIndex ,playerTwoIndex ){
	Players[playerOneIndex].Oponents.push(Players[playerTwoIndex].Id)
	Players[playerTwoIndex].Oponents.push(Players[playerOneIndex].Id)
	game = {
		PlayerOne: Players[playerOneIndex].Id,
		PlayerTwo: Players[playerTwoIndex].Id,
		Result: null
	};
	return game;
}

var matchPlayers= function(Players){
	
	var games = [];
	var remaningPlayers = [];
	var badMachup = {};

	for (var i = Players.length - 1; i >= 0; i--) {
		remaningPlayers[i] = {
			Player: Players[i],
			Index: i
		}
		badMachup[Players[i].Id] = [];
	};

	while(remaningPlayers.length>=2){

		var playerOne = remaningPlayers[0];
		var playerTwo = null;
		var foundOpponent = false
		var k = 1;
		while (!foundOpponent) {
			if(!hasMeet(playerOne.Player,remaningPlayers[k].Player) && IndexOf(badMachup[playerOne.Player.Id],remaningPlayers[k].Player.Id)==-1){
				playerTwo = remaningPlayers[k]

				var game = createGame(Players, playerOne.Index, playerTwo.Index);
				game["Table"] = games.length;
				games.push(game);
				
				remaningPlayers.splice(k,1);
				remaningPlayers.splice(0,1);
				foundOpponent = true;
			}else {
				k++;
				if (k >= remaningPlayers.length){
					var a = redoOne(games, Players, remaningPlayers, badMachup).concat(remaningPlayers);
					remaningPlayers = a;
					foundOpponent = true;
				}
			}
		};
	};
	return games;
}


