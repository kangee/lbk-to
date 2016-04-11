Template.Tournament_CurrentStanding.helpers({
	Players:function() {
		return Router.current().data().Tournament.Players
	}
});

/*Template.Tournament_CurrentStanding.events({

	//debugg method to use with 
	//<button class="sort btn btn-lg">Do sorting</button>
	"click .sort":function() {
		return Meteor.call("sort",Router.current().data().Tournament.Name)
	}
});*/