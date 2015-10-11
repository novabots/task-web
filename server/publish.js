Meteor.publish("tasks", function(){
    if(this.userId){
        return Tasks.find();
    }
});

Meteor.publish("permissions", function(){
    Permissions.find({userId: this.userId});
});

Meteor.publish("teams", function(){
    if(this.userId){
        Teams.find();
    }
});

Meteor.publish("organizations", function(){
    if(this.userId){
        Organizations.find();
    }
});

Meteor.publish("users", function(){
    if(this.userId){
        return Meteor.users.find();
    }
});

Meteor.publish("clients", function () {
    if (this.userId) {
        return Clients.find({ userId: this.userId });
    }
});

