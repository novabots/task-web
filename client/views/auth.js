Template.register.events({
    "submit #create-account-form": function(event, template) {
        event.preventDefault();
        Accounts.createUser({
            username: template.find("#create-username").value,
            password: template.find("#create-password").value,
            emails: [
                { address: template.find("#create-email").value, verified: false }]
        }, function(error) {
            if (! error) {

            } else {
                toastr.warning('Failed to create account. Reason: '+ error.reason);
            }
        });
    }
});

Template.login.events({
    "submit #login-form": function(event, template) {
        event.preventDefault();
        Meteor.loginWithPassword(
            template.find("#login-username").value,
            template.find("#login-password").value,
            function(error) {
                if (! error) {

                } else {
                    toastr.warning("There was a problem logging in. Try again.");
                }
            }
        );
    },
    "click .google-login": function(){
        Meteor.loginWithGoogle(function(error){
            if(! error){

            } else {
                toastr.warning('Failed to authenticate. Reason: '+ error.reason);
            }

        });
    }
});

Template.auth.helpers({
    authMode: function(what){
        return what == Session.get("authMode");
    },
    authModeClass: function(what){
        return what == Session.get("authMode") ? "btn-primary" : "btn-default";
    }
});

Template.auth.events({
    'click #loginToggle': function(){
        return Session.set("authMode", "login");
    },
    'click #createToggle': function(){
        return Session.set("authMode", "create");
    }
});
