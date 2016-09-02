Meteor.publish("tournaments",function(){
    return Tournaments.find({});
});

require('./validationHelpers.js');

Meteor.methods({
	createTournament:function(tournament){
		if(Meteor.user()){
			tournament.TO = Meteor.user().username;
			Tournaments.insert(tournament);
		}
	},
	addPlayer:function(tournamentName, Player){
		if(Meteor.user()){
			var tournament = Tournaments.findOne({Name:tournamentName});
			if(Meteor.validationHelpers.isTo(tournament) || !Meteor.validationHelpers.isSignedUp(tournament, Player)){
				var _player = Player;
				var id = new Mongo.ObjectID();
				_player.Id = id._str;
				_player.Points = 0;
				_player.Oponents = [];
				_player.Tables = [];
				if(tournament.Scoring_type === "ITC_Scoring"){
				}else{
					_player.Impresion = 0;
					_player.Expresion = 0;
				}


				Tournaments.update({ Name: tournamentName },{ $push: { Players: _player }})
			}
		}
	},
	removePlayer:function(tournamentName,PlayerID){
		if(Meteor.user()){
			var tournament = Tournaments.findOne({Name:tournamentName});
			if(Meteor.validationHelpers.isTo(tournament) || Meteor.validationHelpers.isPlayer(tournament, PlayerID)){
				Tournaments.update({ Name : tournamentName } ,{ $pull : {Players: { Id:PlayerID } } } );
			}
		}
	},
	startTournament:function(tournamentName){
		if(Meteor.user()){
			var tournament = Tournaments.findOne({Name:tournamentName});
			if(Meteor.validationHelpers.isTo(tournament)){
				Tournaments.update({ Name : tournamentName } ,{ $set : {started: true } } );
				Meteor.call("pairRound",tournamentName,1);
			}
		}		
	},
	shuffle : function(tournamentName){
		if(Meteor.user()){
			var tournament = Tournaments.findOne({Name:tournamentName});
			if(Meteor.validationHelpers.isTo(tournament)){

				var a = Meteor.Sorter.shuffle(tournament.Players);
				Tournaments.update({Name:tournamentName},{$set:{Players: a}});
			}
		}
	},

	sortOnRanking:function(tournamentName){
		if(Meteor.user()){
			var url = "http://www.svenska40k.se/rank.php";
			var tournament = Tournaments.findOne({Name:tournamentName});
			//this.unblock();
			if(Meteor.validationHelpers.isTo(tournament)){
				try{
					var res = HTTP.call('get',url);
					var badString2 = "<script language=\"JavaScript\" src=\"http:\/\/convert.rss-to-javascript.com/?src=http://voxnovus.wordpress.com/feed/&desc=0&desc_max=0&chan=1&simple_chan=0&font=Arial&fgcolor=&bgcolor=&date=0&target=&num=3&target=&use_lists=1&font_size=\" ></script><noscript>Your browser does not support JavaScript. <a title='RSS-to-JavaScript.com: Free RSS to JavaScript Converter' href=http://convert.rss-to-javascript.com/?src=http://voxnovus.wordpress.com/feed/&desc=0&desc_max=0&chan=1&simple_chan=0&font=&fgcolor=&bgcolor=&date=0&target=&num=3&target=&use_lists=1&font_size=&as_html=1 >Click to read the latest news</a>.</noscript>"
					var badString1 = "<script language=\"JavaScript\" src=\"http:\/\/convert.rss-to-javascript.com/?src=http://egges40k.wordpress.com/feed/&desc=0&desc_max=0&chan=1&simple_chan=0&font=Arial&fgcolor=&bgcolor=&date=0&target=&num=3&target=&use_lists=1&font_size=\" ></script><noscript>Your browser does not support JavaScript. <a title='RSS-to-JavaScript.com: Free RSS to JavaScript Converter' href=http://convert.rss-to-javascript.com/?src=http://egges40k.wordpress.com/feed/&desc=0&desc_max=0&chan=1&simple_chan=0&font=&fgcolor=&bgcolor=&date=0&target=&num=3&target=&use_lists=1&font_size=&as_html=1 >Click to read the latest news</a>.</noscript>"
					if(res.statusCode === 200){
						res.content = res.content.replace(/<br>/g, " ");
						res.content = res.content.replace(badString1, "");
						res.content = res.content.replace(badString2, "");

						xml2js.parseString(res.content, function (jsError, jsResult) {
		                    if(jsError === null){
		                    	
		                    	var tableRows = jsResult.html.body[0].div[0].div[3].table[0].tr.splice(1);
		                    	for (var i = tournament.Players.length - 1; i >= 0; i--) {
		                    		for (var j = tableRows.length - 1; j >= 0; j--) {
		                    			if(tableRows[j].td[1].a[0]._.startsWith(tournament.Players[i].Name)){
		                    				tournament.Players[i].Rank = tableRows[j].td[0];
		                    				continue;
		                    			}
		                    			
		                       		};                 		
		                    	};
		                    	var a = tournament.Players.sort(function(a,b){
		                    		if(typeof a.Rank !== 'undefined' && typeof b.Rank !== 'undefined'){
		                    		return a.Rank-b.Rank;
		                    		}else if( typeof a.Rank === 'undefined' && typeof b.Rank === 'undefined'){
		                    			return 0;
		                    		}else if(typeof a.Rank === 'undefined'){
		                    			return 1;
		                    		}else {
		                    			return -1;
		                    		}

		                    	});
		                    	console.log(a);
		                    	Tournaments.update({Name:tournamentName},{$set:{Players: a}});
		                    }else{
		                    	console.log("Error parsing svenska40k");
		                    	console.error(jsError);
		                    }
		                });
					}
				} catch(e){
					console.log(e);
				}
			}
		}

	},
	pairRound:function(tournamentName,round){
		if(Meteor.user()){
			var tournament = Tournaments.findOne({Name:tournamentName});
			if(Meteor.validationHelpers.isTo(tournament) || tournament.Rounds[round-2].done){
				var _rounds = tournament.Rounds;
				var _players = tournament.Players;

				if(tournament.Scoring_type === "ITC_Scoring"){
					var a = Meteor.Sorter.mergeSort(_players,Meteor.ITC.playerSort(tournament));
				}else{
					var a = Meteor.Sorter.mergeSort(_players,Meteor.BattlePoints.playerSort(tournament));
				}

				if(round <= _rounds.length){
					var games = matchPlayers(_players, tournament.ClubParing);

					_rounds[round-1].Games = games;
					_rounds[round-1].paried = true;
					Tournaments.update({Name:tournamentName},{$set:{Rounds:_rounds, Players: a}});
				}else{
					Tournaments.update({Name:tournamentName},{$set:{Players: a}});
				}
			}
		}
	},
	updateResult: function(tournamentName, round , table , playerOne , playerOneScore , playerTwo , playerTwoScore){
		if(Meteor.user()){
			var tournament = Tournaments.findOne({Name:tournamentName});
			if(Meteor.validationHelpers.isTo(tournament) && Meteor.validationHelpers.checkTable(tournament, round , table , playerOne, playerTwo)){

				if(tournament.Scoring_type === "ITC_Scoring"){
					Meteor.ITC.updateResult(tournament,round , table , playerOne , playerOneScore , playerTwo , playerTwoScore);
				}else{
					Meteor.BattlePoints.updateResult(tournament,round , table , playerOne , playerOneScore , playerTwo , playerTwoScore);
				}
			}
		}
	},
	reportResult:function(tournamentName, round , table , playerOne , playerOneScore , playerTwo , playerTwoScore, opponent, impresion, expresion){
		console.log(tournamentName, round , table , playerOne , playerOneScore , playerTwo , playerTwoScore, opponent, impresion, expresion);
		if(Meteor.user()){
			console.log("user");
			var tournament = Tournaments.findOne({Name:tournamentName});
			if(Meteor.validationHelpers.checkTable(tournament, round , table , playerOne, playerTwo)){
				console.log("valid");
				if(tournament.Scoring_type === "ITC_Scoring"){
					Meteor.ITC.reportResult(tournament, round , table , playerOne , playerOneScore , playerTwo , playerTwoScore)
				}else{
					Meteor.BattlePoints.reportResult(tournament, round , table , playerOne , playerOneScore , playerTwo , playerTwoScore, opponent, impresion, expresion)
				}
			}
		}
	},
	sort:function(tournamentName){
		if(Meteor.user()){
			var tournament = Tournaments.findOne({Name:tournamentName});
			if(Meteor.validationHelpers.isTo(tournament)){
				var _players = tournament.Players;
				if(tournament.Scoring_type === "ITC_Scoring"){
					var a = Meteor.Sorter.mergeSort(_players,Meteor.ITC.playerSort(tournament));
				}else{
					var a = Meteor.Sorter.mergeSort(_players,Meteor.BattlePoints.playerSort(tournament));
				}
				Tournaments.update({Name:tournament.Name},{$set: {Players: a}});
			}
		}
	},
	reDoParing:function(tournamentName, round){
		if(Meteor.user()){
			var tournament = Tournaments.findOne({Name:tournamentName});
			if(Meteor.validationHelpers.isTo(tournament)){
				for (var i = tournament.Players.length - 1; i >= 0; i--) {
					tournament.Players[i].Oponents.pop();
					tournament.Players[i].Tables.pop();
				}
				Tournaments.update({Name:tournament.Name},{$set: {Players: tournament.Players}});
				if(!tournament.Rounds[round-1].done){
					Meteor.call("pairRound",tournamentName,round);
					return
				}
			}
		}
	},
	updatePoints:function(tournamentName, PlayerId, field, change){
		if(Meteor.user()){
			var tournament = Tournaments.findOne({Name:tournamentName});
			if(Meteor.validationHelpers.isTo(tournament)){
				for (var i = tournament.Players.length - 1; i >= 0; i--) {
					if(tournament.Players[i].Id === PlayerId){
						tournament.Players[i][field] += change;
					}
				}
				Tournaments.update({Name:tournament.Name},{$set: {Players: tournament.Players}});
			}
		}
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



var playerSortOld = function(tournamentName){
	return function(player1, player2){
		//batle points tested
		if ((player2.Points - player1.Points)!==0) {
			console.log("Sorted on Battle points:"+ player1.Name +"-"+player2.Name);
			return player2.Points - player1.Points
		}

		var tournament = Tournaments.findOne({Name:tournamentName})
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
				var pOneIndex = IndexOf(player1.Oponents, extraPlyer.Id);
				var pTwoIndex = IndexOf(player2.Oponents, extraPlyer.Id);
				if (pOneIndex != -1 && pTwoIndex != -1){
					for (var j = 0; j<tournament.Rounds[pOneIndex].Games.length;j++){
						if(PlayedInGame(tournament.Rounds[pOneIndex].Games[j],player1.Id)){
							var pOnePoints = pointsFromGame(tournament.Rounds[pOneIndex].Games[j],player1.Id);
						}
					}
					for (var j = 0; j<tournament.Rounds[pTwoIndex].Games.length;j++){
						if(PlayedInGame(tournament.Rounds[pTwoIndex].Games[j],player2.Id)){
							var pTwoPoints = pointsFromGame(tournament.Rounds[pTwoIndex].Games[j],player2.Id);
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
				var pOneIndex = IndexOf(player1.Oponents, extraPlyer.Id);
				var pTwoIndex = IndexOf(player2.Oponents, extraPlyer.Id);
				if (pOneIndex != -1 && pTwoIndex == -1){
					for (var j = 0; j<tournament.Rounds[pOneIndex].Games.length;j++){
						if(PlayedInGame(tournament.Rounds[pOneIndex].Games[j],player1.Id)){
							var pOnePoints = pointsFromGame(tournament.Rounds[pOneIndex].Games[j],player1.Id);
							if(pOnePoints>10){
								console.log("Sorted on won agenst top:"+ player1.Name +"-"+player2.Name);
								return -1;
							}
						}
					}
				}
				if (pOneIndex == -1 && pTwoIndex != -1){
					for (var j = 0; j<tournament.Rounds[pTwoIndex].Games.length;j++){
						if(PlayedInGame(tournament.Rounds[pTwoIndex].Games[j],player2.Id)){
							var pTwoPoints = pointsFromGame(tournament.Rounds[pTwoIndex].Games[j],player2.Id);
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
				var pOneIndex = IndexOf(player1.Oponents, extraPlyer.Id);
				var pTwoIndex = IndexOf(player2.Oponents, extraPlyer.Id);
				if (pOneIndex != -1 && pTwoIndex == -1){
					for (var j = 0; j<tournament.Rounds[pOneIndex].Games.length;j++){
						if(PlayedInGame(tournament.Rounds[pOneIndex].Games[j],player1.Id)){
							console.log("Sorted on played agenst top:"+ player1.Name +"-"+player2.Name);
							return -1;
						}
					}
				}
				if (pOneIndex == -1 && pTwoIndex != -1){
					for (var j = 0; j<tournament.Rounds[pTwoIndex].Games.length;j++){
						if(PlayedInGame(tournament.Rounds[pTwoIndex].Games[j],player2.Id)){
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

var hasMeet = function(playerOne,playerTwo){
	for (var i = 0; i < playerOne.Oponents.length; i++) {
		if (playerOne.Oponents[i] === playerTwo.Id){
			return true;
		}
	};
	return false;
}

var redoOne = function(Games, index, Players, remaningPlayers, badMachup){
	game = Games[index];
	//Games.splice(index,1);
	addToBadMacthup(badMachup, game.PlayerOne, game.PlayerTwo);
	return clearGame(Players, remaningPlayers, game.PlayerOne, game.PlayerTwo, game.Table);
	
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
			Players[i].Tables.splice(index, 1);
			playerOne = {
				Player: Players[i],
				Index: i
			}
		}
		if(Players[i].Id === PlayerTwoId){
			var index = IndexOf(Players[i].Oponents,PlayerOneId);
			Players[i].Oponents.splice(index, 1);
			Players[i].Tables.splice(index, 1);
			playerTwo = {
				Player: Players[i],
				Index: i
			}
		}
	};

	return [playerOne,playerTwo];

}

var contains = function(array, element){
	for (var i = array.length - 1; i >= 0; i--) {
		if (array[i] == element){
			return true;
		}
	};
	return false;
}

var createGame = function(Players, playerOneIndex ,playerTwoIndex, tables ){
	pOneTables = Players[playerOneIndex].Tables;
	pTwoTables = Players[playerTwoIndex].Tables;
	var table = -1;
	var tIndex = -1;
	for (var i = 0; i < tables.length; i++) {
		if(tIndex == -1 && !contains(pOneTables, tables[i]) && !contains(pTwoTables, tables[i])){
			table = tables[i];
			tIndex = i;
		}
	};

	if(table == -1){
		table = tables[0];
		tIndex = 0;
	}

	tables.splice(tIndex,1);

	Players[playerOneIndex].Oponents.push(Players[playerTwoIndex].Id)
	Players[playerOneIndex].Tables.push(table);
	
	Players[playerTwoIndex].Oponents.push(Players[playerOneIndex].Id)
	Players[playerTwoIndex].Tables.push(table);
	
	game = {
		PlayerOne: Players[playerOneIndex].Id,
		PlayerTwo: Players[playerTwoIndex].Id,
		PlayerOneSubmited: false,
		PlayerTwoSubmited: false,
		Result: null,
		TempResult: null,
		Table: table
	};
	return game;
}

var matchPlayers= function(Players, ClubParing){
	
	var games = [];
	var remaningPlayers = [];
	var badMachup = {};
	var tables = [];

	for (var i = 0; i< Players.length; i++) {
		remaningPlayers[i] = {
			Player: Players[i],
			Index: i
		}
		badMachup[Players[i].Id] = [];
	};

	if(ClubParing){
		for (var i = 0; i < Players.length; i++) {
			if (i >= (Players.length/2)){
				for (var j = i+1; j < Players.length; j++) {
					if(Players[j].Club != null && Players[j].Club != "" && Players[j].Club === Players[i].Club){
						addToBadMacthup(badMachup,Players[i].Id,Players[j].Id);					
					}
				};
			}
		};
	}

	for (var i = 0; i < Players.length/2; i++) {
		tables[i] = i+1;
	};

	var lastGameIndex = -1;
	while(remaningPlayers.length>=2){
		var playerOne = remaningPlayers[0];
		var playerTwo = null;
		var foundOpponent = false
		var k = 1;
		while (!foundOpponent) {
			if(!hasMeet(playerOne.Player,remaningPlayers[k].Player) && Meteor.Sorter.IndexOf(badMachup[playerOne.Player.Id],remaningPlayers[k].Player.Id)==-1){
				
				playerTwo = remaningPlayers[k]

				var game = createGame(Players, playerOne.Index, playerTwo.Index, tables);
				lastGameIndex = game.Table-1;
				games[lastGameIndex] = game;
				console.log("create game on table "+ game.Table);
				console.log(games);
				remaningPlayers.splice(k,1);
				remaningPlayers.splice(0,1);
				foundOpponent = true;
			}else {
				k++;
				if (k >= remaningPlayers.length){
					console.log("undo game from table " + games[lastGameIndex].Table);
					tables.push(games[lastGameIndex].Table);
					var a = redoOne(games, lastGameIndex, Players, remaningPlayers, badMachup).concat(remaningPlayers);
					remaningPlayers = a;
					foundOpponent = true;
				}
			}
		};
	};
	return games;
}





