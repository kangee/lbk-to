Template.Tournament_round.helpers({

	Tournamnet:function(){
		return Router.current().data().Tournament
	},

	Games:function(tournamnet, round){
		
		return [{PlayerOne:"Markus Fridolfsson",PlayerTwo:"Jonas Pärssinen"}];
	},
	Paired:function(){
		var tournamnet = Router.current().data().Tournament;
		var roundIndex = Router.current().data().Round-1;
		return tournamnet.Rounds[roundIndex].paried;
	}
});
