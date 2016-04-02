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
		layoutTemplate: 'Tournament_main',
		data: function(){
			var _name = this.params._name;
			return {Tournament:Tournaments.findOne({Name: _name})};
			
		}
	});

		this.route('tournamentRound',{
		name: 'tournamentRound',
		path: 'tournament/:_name/round/:_id',
		template: 'Tournament_round',
		layoutTemplate: 'Tournament_main',
		data: function(){
			var _name = this.params._name;
			var _round = this.params._id;
			return { Tournament: Tournaments.findOne({Name: _name}) , Round:_round};
			
		}
	});

	this.route('tournamentSatandings',{
		path: 'tournament/:_name/currentStanding',
		template: 'Tournament_CurrentStanding',
		layoutTemplate: 'Tournament_main',
		data: function(){
			var _name = this.params._name;
			return {Tournament: Tournaments.findOne({Name: _name})};	
		}
	});
	this.route('tournamentResult',{
		path: 'tournament/:_name/result',
		template: 'Tournament_Result',
		layoutTemplate: 'Tournament_main',
		data: function(){
			var _name = this.params._name;
			return {Tournament: Tournaments.findOne({Name: _name})};	
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

