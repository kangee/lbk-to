Template.Tournament_round.helpers({

	Tournamnet:function(){
		return Router.current().data().Tournament
	},

	Round:function(){
		return Router.current().data().Round
	},

	Games:function(tournamnet, round){
		console.log(tournamnet);
		console.log(round);
		return tournamnet.Rounds[round-1].Games;
	},
	Paired:function(){
		var tournamnet = Router.current().data().Tournament;
		var roundIndex = Router.current().data().Round-1;
		return tournamnet.Rounds[roundIndex].paried;
	}
});

