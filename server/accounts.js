Accounts.onCreateUser(function(options, user) {
    if(options.profile){
        user.profile = options.profile;
    } else {
        user.profile = {apikey: "", teams: []};
    }
    return user;
});

ServiceConfiguration.configurations.upsert(
    { service: "google" },
    {
        $set: {
            clientId: Meteor.settings.google.clientId,
            loginStyle: "popup",
            secret: Meteor.settings.google.secret
        }
    }
);