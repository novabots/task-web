BlazeLayout.setRoot('body');

Meteor.startup(function(){
   Session.set("windowWidth", window.innerWidth);
   Session.set("windowHeight", window.innerHeight);
});

Template.app.helpers({
    apiConnected: function(){
        var user = Meteor.user();
        return user.profile.apikey != "";
    }
});

Template.connectApi.events({
    'submit #api-key-form': function(event, template) {
        event.preventDefault();
        Meteor.call("setAPIKey", template.find("#api-key").value, function(err, res) {
            if(res) {
                toastr.success('API Key Saved.');
            }
            if(err) {
                toastr.error('Error: API Key Not Saved.');
            }
        });
    }
});

Template.users.helpers({
    users: function(){
        return Meteor.users.find();
    },
    statusClass: function() {
        return Session.get("sidebarOpen") ? "col-sm-8 col-sm-offset-4" : "col-sm-12"
    }
});