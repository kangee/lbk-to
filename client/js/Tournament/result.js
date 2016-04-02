Template.Tournament_Result.helpers({
	Total:function(){
		return Router.current().data().Tournament.Players.map(function(x){ return { Name: x.Name, Points: x.Points + x.Impresion + x.Expresion};}).sort(PointSort);
	},
	BattlePoints: function(){
		return Router.current().data().Tournament.Players;
	},
	ImpresionList:function(){
		return Router.current().data().Tournament.Players.sort(ImpresionSort);

	},
	ExpresionList:function(){
		return Router.current().data().Tournament.Players.sort(ExpresionSort);

	},
	isTo:function(){
		return Meteor.user().username === Router.current().data().Tournament.TO;
	},
	tournamentDone:function(){
		var tournament = Router.current().data().Tournament;
		return tournament.Rounds[tournament.Rounds.length -1].done;
	},
	viewResult: function(){
		var tournament = Router.current().data().Tournament;
		return tournament.Rounds[tournament.Rounds.length-1].done || Meteor.user().username === tournament.TO;
	}

});

var PointSort = function(x ,y){
	return y.Points - x.Points;
};
var ImpresionSort = function(x ,y){
	return y.Impresion - x.Impresion;
};
var ExpresionSort = function(x ,y){
	return y.Expresion - x.Expresion;
};