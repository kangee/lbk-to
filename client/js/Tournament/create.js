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

	var tournament = {
		Name: name,
		StartDate: date,
		Location: location,
		Rounds: rounds,
		Players:[]
	}

	//console.log(tournament);
	Meteor.call('createTournament',tournament);
	//Tournament.insert({tournament});
	Router.go("/")
 }

});