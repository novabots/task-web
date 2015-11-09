// This file is sent directly to Meteor without going through Webpack
// You can initialize anything you need before your app start here

FlowRouter.wait();

Meteor.startup(() => {
    Session.set("creatingOrg", false);
    Session.set("creatingTeam", false);
});