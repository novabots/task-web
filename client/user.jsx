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
    mixins: [ReactMeteorData],
    getMeteorData(){
        const user = Meteor.users.find({_id: this.props.user._id}).fetch();
        const data = {};
        if(user){
            data.user = user;
        }
        return data;
    },
    render () {
        let user = this.data.user[0];
        return (
            <div className="col-sm-3">
            {this.data.user ?
                <div className="well well-lg">
                    <h3>{user.username}</h3>
                    <div className="droppable" id="{this.data.user._id}">

                    </div>
                </div>
            :
                null
            }
            </div>
        );
    }
});

