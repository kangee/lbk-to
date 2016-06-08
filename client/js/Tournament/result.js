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

Template.Tournament_Result.events({
	"click .view-form":function(event){
		event.preventDefault();
		swapModifyText($(event.toElement)[0]);
		$(event.toElement).parent().children("form").toggleClass("hidden");
	},
	"submit .battle-points-form":function(event){
		event.preventDefault();
		var tournamentName = Router.current().data().Tournament.Name;
		var change = Number(event.target["number"].value);
		event.target["number"].value = null;
		swapModifyText($(event.currentTarget).parent().children("button")[0]);
		$(event.currentTarget).toggleClass("hidden");
		Meteor.call('updatePoints', tournamentName, this.Id, "Points", change);
	},
	"submit .impresion-form":function(event){
		event.preventDefault();
		var tournamentName = Router.current().data().Tournament.Name;
		var change = Number(event.target["number"].value);
		event.target["number"].value = null;
		swapModifyText($(event.currentTarget).parent().children("button")[0]);
		$(event.currentTarget).toggleClass("hidden");
		Meteor.call('updatePoints', tournamentName, this.Id, "Impresion", change);
	},
	"submit .expression-form":function(event){
		event.preventDefault();
		var tournamentName = Router.current().data().Tournament.Name;
		var change = Number(event.target["number"].value);		
		event.target["number"].value = null;
		swapModifyText($(event.currentTarget).parent().children("button")[0]);
		$(event.currentTarget).toggleClass("hidden");
		Meteor.call('updatePoints', tournamentName, this.Id, "Expresion", change);
	}
});

var swapModifyText = function(element){
	if(element.innerHTML === "Modify"){
			element.innerHTML = "Close";
		}else{
			element.innerHTML = "Modify"
		}
}


var PointSort = function(x ,y){
	return y.Points - x.Points;
};
var ImpresionSort = function(x ,y){
	return y.Impresion - x.Impresion;
};
var ExpresionSort = function(x ,y){
	return y.Expresion - x.Expresion;
};
