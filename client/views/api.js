Template.apiLayout.events({
    "click .get-projects": function (evt) {
        Meteor.call("getProjects", function (error, result) {
            console.log(result);
        });
    },
    "click .post-time": function (evt) {
        Meteor.call("postTime", { userId: 123, startTime: "20:30", endTime: "21:30", startDate: "9/1/2015", endDate: "9/1/2015" }, function (error, result) {
            console.log(result);
        });
    }
});
