BlazeLayout.setRoot('body');

Template.mainLayout.helpers({

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