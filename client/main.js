BlazeLayout.setRoot('body');

Meteor.startup(function(){
    Session.set("creatingOrg", false);
    Session.set("creatingTeam", false);
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
    },
    orgExists: function() {
        return Organizations.find().count() > 0;
    },
    organization: function() {
        return Organizations.find();
    },
    noTeam: function(userId) {
        var user = Meteor.users.findOne(userId);
        if(user){
            return _.isEmpty(user.profile.teams);
        }
    }
});

Template.users.events({
    'click #create-org-button': function(e) {
        e.preventDefault();
    }
});

Template.userBox.helpers({
    task: function(userId){
        return Tasks.find({userId: userId, archived: false});
    }
});

Template.createOrg.helpers({
    creatingOrg: function(){
        return Session.get("creatingOrg");
    }
});

Template.createOrg.events({
    'submit #create-org-form': function(e, t){
        e.preventDefault();
        Meteor.call("createOrg", t.find("#orgName").value, function(err, res) {
            if(res) {
                toastr.success('Organization created.');
                Session.set("creatingOrg", false);
            }
            if(err) {
                toastr.error('Error: Organization not created.');
            }
        });
    },
    'click #create-org-button': function(e, t) {
        Session.set("creatingOrg", true);
    }
});

Template.org.helpers({
    teamsExist: function(orgId){
        return Teams.find({orgId: orgId}).count() > 0;
    },
    teams: function(orgId) {
        return Teams.find({orgId: orgId});
    }
});

Template.createTeam.helpers({
    creatingTeam: function(){
        return Session.get("creatingTeam");
    }
});

Template.createTeam.events({
    'submit #create-team-form': function(e, t){
        e.preventDefault();
        Meteor.call("createTeam", t.find("#teamName").value, t.find("#orgId").value, function(err, res) {
            if(res) {
                toastr.success('Team created.');
                Session.set("creatingTeam", false);
            }
            if(err) {
                toastr.error('Error: Team not created.');
            }
        });
    },
    'click .create-team-button': function(e,t){
        e.preventDefault();
        Session.set("orgSelected", t.find("#orgId").value);
        Session.set("creatingTeam", true);
    }
});

Template.team.helpers({
    notTeamMember: function(teamId) {
        var user = Meteor.user();
        return ! _.contains(user.profile.teams, teamId );
    },
    user: function(teamId) {
        return Meteor.users.find({'profile.teams': teamId});
    }
});

Template.team.events({
    'click .join-team': function(e, t) {
        e.preventDefault();
        Meteor.call("joinTeam", t.find("button").id, function(err, res) {
            if(res) {
                toastr.success('You have joined the team.');
            }
            if(err) {
                toastr.error('Error: You have not joined the team.');
            }
        });
    }
});
