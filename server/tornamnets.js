Meteor.publish("tournaments",function(){
    return Tournaments.find({});
});

Meteor.methods({
	createTournament:function(tournament){
		//console.log(tournament);
		tournament.TO = Meteor.user().username;
		tournament.Players = [];
		Tournaments.insert(tournament);
	},
	addPlayer:function(tournamentName, Player){
		Tournaments.update({ Name: tournamentName },{ $push: { Players: Player }})
	}
})