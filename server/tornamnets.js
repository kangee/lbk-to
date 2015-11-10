Meteor.publish("tournament",function(){
    return Tournament.find();
});