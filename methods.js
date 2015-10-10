Meteor.methods({
    getProjects: function (req) {
        if (Meteor.isServer) {
            this.unblock();
            try {
                var user = Meteor.users.findOne(this.userId);
                var apikey = user.profile.apikey;
                var result = HTTP.get(Meteor.settings.apiURL + "/project", {
                    "auth": apikey + ":X",
                    "params": req,
                    "headers": {
                        "Accept": "application/json"
                    }
                });
                return result;
            } catch (e) {
                throw e;
            }
        }
    },
    getWorkTypes: function (req) {
        if (Meteor.isServer) {
            this.unblock();
            try {
                var user = Meteor.users.findOne(this.userId);
                var apikey = user.profile.apikey;
                var result = HTTP.get(Meteor.settings.apiURL + "/worktype", {
                    "auth": apikey + ":X",
                    "params": req,
                    "headers": {
                        "Accept": "application/json"
                    }
                });
                return result;
            } catch (e) {
                throw e;
            }
        }
    },
    getPersons: function (req) {
        if (Meteor.isServer) {
            this.unblock();
            try {
                var user = Meteor.users.findOne(this.userId);
                var apikey = user.profile.apikey;
                var result = HTTP.get(Meteor.settings.apiURL + "/person", {
                    "auth": apikey + ":X",
                    "params": req,
                    "headers": {
                        "Accept": "application/json"
                    }
                });
                return result;
            } catch (e) {
                throw e;
            }
        }
    },
    getClients: function (req) {
        if (Meteor.isServer) {
            this.unblock();
            try {
                var user = Meteor.users.findOne(this.userId);
                var apikey = user.profile.apikey;
                var result = HTTP.get(Meteor.settings.apiURL + "/client", {
                    "auth": apikey + ":X",
                    "params": req,
                    "headers": {
                        "Accept": "application/json"
                    }
                });
                return result;
            } catch (e) {
                throw e;
            }
        }
    },
    getModules: function (req) {
        if (Meteor.isServer) {
            this.unblock();
            try {
                var user = Meteor.users.findOne(this.userId);
                var apikey = user.profile.apikey;
                var result = HTTP.get(Meteor.settings.apiURL + "/module", {
                    "auth": apikey + ":X",
                    "params": req,
                    "headers": {
                        "Accept": "application/json"
                    }
                });
                return result;
            } catch (e) {
                throw e;
            }
        }
    },
    postTime: function (req) {
        if (Meteor.isServer) {
            try {
                var user = Meteor.users.findOne(this.userId);
                var apikey = user.profile.apikey;
                var result = HTTP.post(Meteor.settings.apiURL + "/time", {
                    "auth": apikey + ":X",
                    "params": req,
                    "headers": {
                        "Accept": "application/json"
                    }
                });
                return result;
            } catch (e) {
                throw e;
            }
        }
    },
    setAPIKey: function (req) {
        return Meteor.users.update({_id: this.userId}, {$set:{profile: {apikey: req}}});
    }
});
