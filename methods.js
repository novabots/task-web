Meteor.methods({
    getProjects: function () {
        this.unblock();
        try {
            var result = HTTP.get('http://localhost:3000/intervals-project.json');
            return result;
        } catch (e) {
            return false;
        }
    },
    postTime: function (req) {
        try {
            var result = HTTP.post('http://localhost:3000/intervals-project.json');
            return req;
        } catch (e) {
            return false;
        }
    }
});
