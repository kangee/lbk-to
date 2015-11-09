Router.map(function() {

	this.route('home', {
	    path: '/',
	    template: 'tornamentsList',
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
})