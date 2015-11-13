Template.Tournament_nav.helpers({
	Name: function(){
		return Router.current().data().Name
	},
	Rounds: function(){
		var rounds = Router.current().data().Rounds;
		var baseUrl = Router.current().url;
		var out=[];
		for (var i = 1; i <= rounds; i++) {
			out[i-1]={url:baseUrl+"/round/"+i,text:"Round "+i}
		};
		return out;
	}
	
})