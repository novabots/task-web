UserList = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        return {
            users: Meteor.users.find().fetch()
        }
    },
    render () {
        return (
            <div>
            {this.renderUsers}
            </div>
        );
    },
    renderUsers () {
        return this.data.users.map((user) => {
            return <User key={user._id} user={user} />;
        });
    }
});

User = React.createClass({
    render () {
        return (
            <div>{this.props.user._id}</div>
        );
    }
});
