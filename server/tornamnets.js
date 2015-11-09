Meteor.publish("tornaments",function(){
    return Tornaments.find();
});