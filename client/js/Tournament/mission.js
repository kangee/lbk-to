Template.Tournament_round_mission.helpers({
	hasMission:function(){
		var round = Router.current().data().Round;
		var mission = Router.current().data().Tournament.Rounds[round-1].Mission;
		if (typeof(mission) === "undefined" || mission === null){
			return false;
		}
		return true;
	},
	deployment:function(){
		var round = Router.current().data().Round;
		var mission = Router.current().data().Tournament.Rounds[round-1].Mission;
		return "Dawn of War"
		//return mission.Deployment;
	},
	missions:function(){
		var round = Router.current().data().Round;
		var mission = Router.current().data().Tournament.Rounds[round-1].Mission;
		return [{text:"Killpoints (max diff 6vp)"}, {text:"Objectives"}]
		//return mission.Missions;
	},
	isTo:function(){
		return Meteor.user().username === Router.current().data().Tournament.TO; 
	}

})