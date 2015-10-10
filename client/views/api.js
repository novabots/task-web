Template.apiLayout.events({
    "click .get-projects": function (evt) {
        Meteor.call("getProjects", {
            //"clientid": "-1",
            "active": "t",
            //"personid": "-1",
            "limit": "0"
        }, function (error, result) {
            console.log(error);
            console.log(result);
        });
    },
    "click .post-time": function (evt) {
        Meteor.call("postTime", {
            "projectid": "",
            "moduleid": "",
            "worktypeid": "",
            "personid": "",
            "date": "",
            "time": "",
            "billable": ""
        }, function (error, result) {
            console.log(error);
            console.log(result);
        });
    }
});
