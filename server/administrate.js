Meteor.publish("allUsers",function(){
	//console.log(this);
	if(this.userId){
    	return Meteor.users.find({},{fields:{username:true, profile:true, isAdmin:true }});
   	} 
});
// 