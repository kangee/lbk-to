Template.Tournament_create.events({
"click .cancel-create":function(event){
	event.preventDefault();
	Router.go("/");
},
"submit form":function(event){
	event.preventDefault();

	var name = document.getElementById("tournament-name-input").value;
	var date = document.getElementById("tournament-date-input").value;
	var location = document.getElementById("tournament-location-input").value;
	var rounds = document.getElementById("tournament-rounds-input").value;
	var _rounds = [];

	for (var i = 0; i < rounds; i++) {
		_rounds[i] = {Games: [], done:false, paried: false}
	}
		var tournament = {
		Name: name,
		StartDate: date,
		started: false,
		Location: location,
		Rounds: _rounds,
		Players:[]
	}
	Meteor.call('createTournament',tournament);
	Router.go("/")
 }

});