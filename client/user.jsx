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
            {this.renderUsers()}
            </div>
        );
    },
    renderUsers () {
        return this.data.users.map((user) => {
            return <User key={user._id} user={user} />;
        });
    }
});

UserTaskIcon = React.createClass({
    renderTask() {
        let taskTitle = this.props.task.clientName + " " + this.props.task.description;
        return <a className="btn btn-info btn-xs draggable" id={this.props.task._id} title={taskTitle}><i className="fa fa-arrows"></i> {this.props.task.title}</a>
    },
    render() {
        return (
            <div>{this.renderTask()}</div>
        );
    }
});

User = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData(){
        const user = Meteor.users.find({_id: this.props.user._id}).fetch();
        const tasks = Tasks.find({ userId: this.props.user._id }).fetch();
        const data = {};
        if(user){
            data.user = user;
        }
        if (tasks) {
            data.tasks = tasks;
        }
        return data;
    },
    renderTaskIcons() {
        return this.data.tasks.map((task) => {
            return <UserTaskIcon key={task._id} task={task} />;
        });
    },
    render () {
        let user = this.data.user[0];
        return (
            <div className="col-sm-3">
            {this.data.user ?
                <div className="well well-lg">
                    <h3>{user.username}</h3>
                    <div className="droppable" id={this.data.user._id}>
                        {this.renderTaskIcons()}
                    </div>
                </div>
            :
                null
            }
            </div>
        );
    }
});
