Template.Tournament_CurrentStanding.helpers({
	Players:function() {
		return Router.current().data().Tournament.Players
	}
});

Template.Tournament_CurrentStanding.events({
	"click .sort":function() {
		return Meteor.call("sort",Router.current().data().Tournament.Name)
	}
});