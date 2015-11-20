Template.Tournament_nav.helpers({
	Name: function(){
		return Router.current().data().Tournament.Name
	},
	Rounds: function(){
		var tournament = Router.current().data().Tournament;
		var rounds = tournament.Rounds.length;
		var name = tournament.Name;
		var out=[];
		for (var i = 1; i <= rounds; i++) {
			var active  = "";
			if (Router.current().data().Round == i){
				active = "active"
			}
			out[i-1]={active: active, url:/tournament/+name+"/round/"+i,text:"Round "+i}
		};
		return out;
	}
	
})