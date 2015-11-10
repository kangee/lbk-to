
Session.set("viewUserProfile",true);

Template.user.helpers({
	viewProfile: function(){
		return Session.get("viewUserProfile");
	}
});

Template.viewprofile.helpers({
	profile:function(){
		var profile = Meteor.user().profile;
		return profile;
	}
});

Template.editProfile.helpers({
	profile:function(){
		var profile = Meteor.user().profile;
		return profile;
	}
});

Template.user.events({
"click .toggle-view-profile":function(event){
		Session.set("viewUserProfile", ! Session.get("viewUserProfile"));
},
"click .cancel-profile-update":function(event){
	event.preventDefault();
	Session.set("viewUserProfile",true);
},
"submit form":function(event){
	//event.preventDefault();

	var name = document.getElementById("profile-name-input").value;
	var email = document.getElementById("profile-email-input").value;
	var location = document.getElementById("profile-location-input").value;

	var profile = {
		Name: name,
		Email: email,
		Location: location
	}
	Meteor.users.update({_id:Meteor.user()._id}, {
        $set: {profile: profile}
      });

}

});