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
                Projects.remove({ "userId": user._id });
                _.each (result.data.project, function (it) {
                    it.userId = user._id;
                    Projects.insert(it);
                });
                return result;
            } catch (e) {
                throw e;
            }
        }
    },
    getProjectWorkTypes: function (req) {
        if (Meteor.isServer) {
            this.unblock();
            try {
                var user = Meteor.users.findOne(this.userId);
                var apikey = user.profile.apikey;
                var result = HTTP.get(Meteor.settings.apiURL + "/projectworktype", {
                    "auth": apikey + ":X",
                    "params": req,
                    "headers": {
                        "Accept": "application/json"
                    }
                });
                ProjectWorkTypes.remove({ "userId": user._id });
                _.each (result.data.projectworktype, function (it) {
                    it.userId = user._id;
                    ProjectWorkTypes.insert(it);
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
                Persons.remove({ "userId": user._id });
                _.each (result.data.person, function (it) {
                    it.userId = user._id;
                    Persons.insert(it);
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
                Clients.remove({ "userId": user._id });
                _.each (result.data.client, function (it) {
                    it.userId = user._id;
                    Clients.insert(it);
                });
                return result;
            } catch (e) {
                throw e;
            }
        }
    },
    getProjectModules: function (req) {
        if (Meteor.isServer) {
            this.unblock();
            try {
                var user = Meteor.users.findOne(this.userId);
                var apikey = user.profile.apikey;
                var result = HTTP.get(Meteor.settings.apiURL + "/projectmodule", {
                    "auth": apikey + ":X",
                    "params": req,
                    "headers": {
                        "Accept": "application/json"
                    }
                });
                ProjectModules.remove({ "userId": user._id });
                _.each (result.data.projectmodule, function (it) {
                    it.userId = user._id;
                    ProjectModules.insert(it);
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
                    "data": req,
                    "headers": {
                        "Accept": "application/json",
                        "Content-type": "application/json"
                    }
                });
                return result;
            } catch (e) {
                throw e;
            }
        }
    },
    setAPIKey: function (req) {
         if (Meteor.isServer) {
            try {
                var user = Meteor.users.findOne(this.userId);
                var apikey = req;
                var result = HTTP.get(Meteor.settings.apiURL + "/me", {
                    "auth": apikey + ":X",
                    "headers": {
                        "Accept": "application/json",
                    }
                });
                if (result.statusCode === 200) {
                    return Meteor.users.update({_id: user._id }, { $set: { profile: { personid: result.data.personid, apikey: req } }});
                } else {
                    throw Meteor.Error(result.statusCode);
                }
            } catch (e) {
                throw e;
            }
        }
    },
    createOrg: function(org) {
        if (Meteor.isServer) {
            try {
                return Organizations.insert({name: org});
            } catch (e) {
                throw e;
            }
        }
    },
    createTeam: function(team, orgId) {
        if (Meteor.isServer) {
            try {
                return Teams.insert({name: team, orgId: orgId});
            } catch (e) {
                throw e;
            }
        }
    },
    joinTeam: function(teamId) {
        if (Meteor.isServer) {
            try {
                return Meteor.users.update({_id: this.userId }, { $addToSet: { 'profile.teams': teamId} });
            } catch (e) {
                throw e;
            }
        }
    },
    changeTaskOwner: function(userId, taskId) {
        if (Meteor.isServer) {
            var user = Meteor.users.findOne(userId);
            var task = Tasks.findOne(taskId);
            try {
                if(user && task) {
                    if(user._id !== task.userId){
                        var doc = task;
                        delete doc._id;
                        doc.userId = user._id;
                        doc.personId = user.profile.personid;
                        doc.archived = false;

                        Tasks.update({_id: taskId}, {$set: {archived: true}});
                        return Tasks.insert(doc);
                    }
                }
            } catch (e) {
                throw e;
            }
        }
    }
});
