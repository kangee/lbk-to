Template.Tournament_nav.helpers({
	Name: function(){
		return Router.current().data().Tournament.Name
	},
	Rounds: function(){
		var tournament = Router.current().data().Tournament;
		var rounds = tournament.Rounds;
		var name = tournament.Name;
		var out=[];
		for (var i = 1; i <= rounds; i++) {
			out[i-1]={url:/tournament/+name+"/round/"+i,text:"Round "+i}
		};
		return out;
	}
	
})