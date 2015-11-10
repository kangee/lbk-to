
Template.navItems.helpers({
	item:function(){
		var currentPath = Router.current();
        var items = [
             {active:"", path:"", name:'Tournaments'},
             {active:"", path:"profile", name:'Profile'}
     	];
    	
     	items.forEach(function(i){
        	if(i.name == currentPath.route.name){
          		i.active = "active";
        	}
      	});
      return items;
    }
});