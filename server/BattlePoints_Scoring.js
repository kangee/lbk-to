require('./validationHelpers.js');

Meteor.BattlePoints = {
	reportResult : function(tournament, round , table , playerOne , playerOneScore , playerTwo , playerTwoScore, opponent, impresion, expresion){
		var currentPlayerId = null;

				if (opponent === playerOne){
					currentPlayerId = playerTwo;
				}else if(opponent === playerTwo){
					currentPlayerId = playerOne;
				}

				if(Meteor.validationHelpers.isTo(tournament) || Meteor.validationHelpers.isPlayer(tournament, currentPlayerId)){
					var _rounds = tournament.Rounds;
					var _games = _rounds[round-1].Games;
					var _players = tournament.Players;
					var gameDone = false;
					var reportSoftScore = playerTwo === opponent && !_games[table -1].PlayerOneSubmited || playerOne === opponent && !_games[table -1].PlayerTwoSubmited;

					if(_games[table-1].TempResult != null && _games[table-1].TempResult === playerOneScore + "-" + playerTwoScore && _games[table-1].PlayerToReportNext === currentPlayerId){
						_games[table-1].Result = playerOneScore + "-" + playerTwoScore;
						gameDone = true;
					} 

					_games[table-1].TempResult = playerOneScore + "-" + playerTwoScore;
					_games[table-1].PlayerToReportNext = opponent;
					
					if(gameDone || reportSoftScore){
						for (var i = _players.length - 1; i >= 0; i--) {
							if(gameDone){
								if (_players[i].Id === playerOne){
									_players[i].Points = Number(_players[i].Points) + Number(playerOneScore);
								}
								if (_players[i].Id === playerTwo){
									_players[i].Points = Number(_players[i].Points) + Number(playerTwoScore);
								}
							}
							if(reportSoftScore){
								if (_players[i].Id === opponent){
										_players[i].Impresion = Number(_players[i].Impresion) + Number(impresion);
										_players[i].Expresion = Number(_players[i].Expresion) + Number(expresion);

									if(opponent === playerOne){
										_games[table-1].PlayerTwoSubmited = true;
									}
									if(opponent === playerTwo){
										_games[table-1].PlayerOneSubmited = true;
									}
								}
							}
						}
					}
					
					var a = Meteor.Sorter.mergeSort(_players,Meteor.BattlePoints.playerSort(tournament));
					console.log(tournament);
					Tournaments.update({Name:tournament.Name},{$set: {Rounds: _rounds, Players: a}});
					for (var i = _games.length - 1; i >= 0; i--) {
						if (_games[i].Result === null){
							return
						}
					};
					_rounds[round-1].done = true;

					Tournaments.update({Name:tournament.Name},{$set: {Rounds: _rounds, Players: a}});
					var next = Number(round) + 1;
					Meteor.call("pairRound",tournament.Name,next);
				}
	},

	updateResult : function(tournament,round , table , playerOne , playerOneScore , playerTwo , playerTwoScore){
		var _rounds = tournament.Rounds;
		var _game = _rounds[round-1].Games[table-1];
		var _oldScore = _game.Result.split("-");
		var playerOneOld = Number(_oldScore[0]);
		var playerTwoOld = Number(_oldScore[1]);
		_game.Result = playerOneScore + "-" + playerTwoScore;
		var _players = tournament.Players;
		for (var i = _players.length - 1; i >= 0; i--) {
			if (_players[i].Id === playerOne){
				_players[i].Points = Number(_players[i].Points) + Number(playerOneScore) - playerOneOld;
			}
			if (_players[i].Id === playerTwo){
				_players[i].Points = Number(_players[i].Points) + Number(playerTwoScore) - playerTwoOld;
			}
		}

		if(tournament.Scoring_type === "ITC_Scoring"){
			var a = Meteor.Sorter.mergeSort(_players,Meteor.ITC.playerSort(tournament));
		}else{
			var a = Meteor.Sorter.mergeSort(_players,Meteor.BattlePoints.playerSort(tournament));
		}

		Tournaments.update({Name:tournament.Name},{$set: {Rounds: _rounds, Players: a}});
	},

	playerSort : function(tournament){
	return function(player1, player2){
		//batle points tested
		if ((player2.Points - player1.Points)!==0) {
			console.log("Sorted on Battle points:"+ player1.Name +"-"+player2.Name);
			return player2.Points - player1.Points
		}

		//var tournament = Tournaments.findOne({Name:tournamentName})
		var index = Meteor.Sorter.IndexOf(player1.Oponents,player2.Id);
		//internal meeting
		if (index != -1){			
					var result = tournament.Rounds[index].Games[Number(player1.Tables[index]-1)].Result
					if(result != null){
						var arr = result.split("-");
						var p1 = Number(arr[0]);
						var p2 = Number(arr[1]);
						if((p1-p2)!= 0) {
							console.log("Sorted on internal meeting:"+ player1.Name +"-"+player2.Name);
							if (tournament.Rounds[index].Games[Number(player1.Tables[index]-1)].PlayerOne == player1.Id){
								return p2-p1;								
							}
							return p1-p2;
						}
					}
		}
		// most points from top player if both has meet the same
		for (var i = 0; i < tournament.Players.length; i++) {
			var extraPlyer = tournament.Players[i];
			if(extraPlyer.Id != player1.ID && extraPlyer.Id != player2.Id){
				var pOneIndex = Meteor.Sorter.IndexOf(player1.Oponents, extraPlyer.Id);
				var pTwoIndex = Meteor.Sorter.IndexOf(player2.Oponents, extraPlyer.Id);
				if (pOneIndex != -1 && pTwoIndex != -1){
					for (var j = 0; j<tournament.Rounds[pOneIndex].Games.length;j++){
						if(Meteor.Sorter.PlayedInGame(tournament.Rounds[pOneIndex].Games[j],player1.Id)){
							var pOnePoints = Meteor.Sorter.pointsFromGame(tournament.Rounds[pOneIndex].Games[j],player1.Id);
						}
					}
					for (var j = 0; j<tournament.Rounds[pTwoIndex].Games.length;j++){
						if(Meteor.Sorter.PlayedInGame(tournament.Rounds[pTwoIndex].Games[j],player2.Id)){
							var pTwoPoints = Meteor.Sorter.pointsFromGame(tournament.Rounds[pTwoIndex].Games[j],player2.Id);
						}
					}
					if ((pTwoPoints - pOnePoints)!= 0){
						console.log("Sorted on same opponent:"+ player1.Name +"-"+player2.Name);
						return pTwoPoints - pOnePoints;
					}
				}
			}
		};

		// won agenst higest player
		for (var i = 0; i < tournament.Players.length; i++) {
			var extraPlyer = tournament.Players[i];
			if(extraPlyer.Id != player1.ID && extraPlyer.Id != player2.Id){
				var pOneIndex = Meteor.Sorter.IndexOf(player1.Oponents, extraPlyer.Id);
				var pTwoIndex = Meteor.Sorter.IndexOf(player2.Oponents, extraPlyer.Id);
				if (pOneIndex != -1 && pTwoIndex == -1){
					for (var j = 0; j<tournament.Rounds[pOneIndex].Games.length;j++){
						if(Meteor.Sorter.PlayedInGame(tournament.Rounds[pOneIndex].Games[j],player1.Id)){
							var pOnePoints = Meteor.Sorter.pointsFromGame(tournament.Rounds[pOneIndex].Games[j],player1.Id);
							if(pOnePoints>10){
								console.log("Sorted on won agenst top:"+ player1.Name +"-"+player2.Name);
								return -1;
							}
						}
					}
				}
				if (pOneIndex == -1 && pTwoIndex != -1){
					for (var j = 0; j<tournament.Rounds[pTwoIndex].Games.length;j++){
						if(Meteor.Sorter.PlayedInGame(tournament.Rounds[pTwoIndex].Games[j],player2.Id)){
							var pTwoPoints = Meteor.Sorter.pointsFromGame(tournament.Rounds[pTwoIndex].Games[j],player2.Id);
							if(pTwoPoints>10){
								console.log("Sorted on won agenst top:"+ player1.Name +"-"+player2.Name);
								return 1;
							}
						}
					}
				}
			}
		}

		// played agenst higest player
		for (var i = 0; i < tournament.Players.length; i++) {
			var extraPlyer = tournament.Players[i];
			if(extraPlyer.Id != player1.ID && extraPlyer.Id != player2.Id){
				var pOneIndex = Meteor.Sorter.IndexOf(player1.Oponents, extraPlyer.Id);
				var pTwoIndex = Meteor.Sorter.IndexOf(player2.Oponents, extraPlyer.Id);
				if (pOneIndex != -1 && pTwoIndex == -1){
					for (var j = 0; j<tournament.Rounds[pOneIndex].Games.length;j++){
						if(Meteor.Sorter.PlayedInGame(tournament.Rounds[pOneIndex].Games[j],player1.Id)){
							console.log("Sorted on played agenst top:"+ player1.Name +"-"+player2.Name);
							return -1;
						}
					}
				}
				if (pOneIndex == -1 && pTwoIndex != -1){
					for (var j = 0; j<tournament.Rounds[pTwoIndex].Games.length;j++){
						if(Meteor.Sorter.PlayedInGame(tournament.Rounds[pTwoIndex].Games[j],player2.Id)){
							console.log("Sorted on played agenst top:"+ player1.Name +"-"+player2.Name);
							return 1;
						}
					}
				}
			}
		}
		console.log("Players are equal:"+ player1.Name +"-"+player2.Name);
		return 0 // elements are equal
	}
}

};