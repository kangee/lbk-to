Router.map(function() {


  	this.route('tournamentsList', {
	    path: '/',
	    template: 'tournamentsList',
    	layoutTemplate: 'main',
  	});

	this.route('profile', {
	    path: '/profile',
	    template: 'user',
	    layoutTemplate: 'main',
	    onBeforeAction: function (pause) {
	       	if (!Meteor.user()) {
	          Router.go("/");
	        }else{
	     	   this.next();
	    	}
	    }
	});

	this.route('tournament',{
		name: 'tournament',
		path: 'tournament/:_name',
		template: 'tournament',
		layoutTemplate: 'main',
		data: function(){
			var _name = this.params._name;
			return Tournaments.findOne({Name: _name});
			
		},
		onBeforeAction: function (pause) {
	       	if (!Meteor.user()) {
	          Router.go("/");
	        }else{
	     	   this.next();
	    	}
	    }
	});

	this.route('tournamentSatandings',{
		path: 'tournament/:_name/currentStanding',
		template: 'Tournament_CurrentStanding',
		layoutTemplate: 'main',
		data: function(){
			var _name = this.params._name;
			return Tournaments.findOne({Name: _name});	
		},
		onBeforeAction: function (pause) {
	       	if (!Meteor.user()) {
	          Router.go("/");
	        }else{
	     	   this.next();
	    	}
	    }
	});

	this.route('createTournament',{
		path: 'createTournament',
		template: 'Tournament_create',
		layoutTemplate: 'main',
		onBeforeAction: function (pause) {
	       	if (!Meteor.user()) {
	          Router.go("/");
	        }else{
	     	   this.next();
	    	}
	    }
	})


});

