Template.tournament.helpers({
	Tournament:function(){
		return Router.current().data()
	},
	Date: function(date){
		var _date = new Date(date);
		return  _date.toLocaleDateString();
	},
	Players: function(){
		return Router.current().data().Players
	}


});