Template.auth.onCreated(function(){
    this.authMode = new ReactiveVar("login");
});

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
        return what == Template.instance().authMode.get("authMode");
    },
    authModeClass: function(what){
        return what == Template.instance().authMode.get("authMode") ? "btn-primary" : "btn-default";
    },
    loggingIn: function(){
        return Meteor.loggingIn()
    }
});

Template.auth.events({
    'click #loginToggle': function(e, template){
        return template.authMode.set("login");
    },
    'click #createToggle': function(e, template){
        return template.authMode.set("create");
    }
});
