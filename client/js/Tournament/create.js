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
	var _clubParing = document.getElementById("tournament-club-paring-input").checked;
	var scoring = document.getElementById("tournament-scoring-type-input").value;
	var _rounds = [];

	if(date === ""){
		var now = new Date();
		date = now.getFullYear() +"-"+ (now.getMonth()+1)+"-" + now.getDate();
	}

	for (var i = 0; i < rounds; i++) {
		_rounds[i] = {Games: [], done:false, paried: false}
	}
		var tournament = {
		Name: name,
		StartDate: date,
		started: false,
		Location: location,
		Rounds: _rounds,
		ClubParing: _clubParing,
		Scoring_type: scoring,
		Players:[]
	}
	Meteor.call('createTournament',tournament);
	Router.go("/")
 }

});