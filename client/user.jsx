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

function collect(connect, monitor) {
    console.log("collect");
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}
const userTaskIconSource = {
    beginDrag(props) {
        return {
            id: props.user._id,
            user: props.user
        };
    }
};
var UserTaskIcon = React.createClass({
    /*
    propTypes: {
        connectDragSource: React.PropTypes.func.isRequired,
        isDragging: React.PropTypes.bool.isRequired
    },
    */
    componentDidMount(){
        $( ".draggable" ).draggable({
            revert: "invalid"
        });
        $(".droppable").droppable({
            drop: function( event, ui ) {
                var userId = event.target.id,
                    user = Meteor.users.findOne(userId),
                    taskId = ui.draggable[0].id,
                    task = Tasks.findOne(taskId);
                if(task && user && task.userId !== user._id) {
                    Meteor.call("changeTaskOwner", user._id, task._id, function(err, res){
                        if(res) {
                            toastr.success('You have updated the task.');
                        }
                        if(err) {
                            toastr.error('Error: You have not updated the task.');
                        }
                    });
                } else {
                    return false;
                }
            }
        });
    },
    renderTask() {
        let taskTitle = this.props.task.clientName + " " + this.props.task.description;
        return <a className="btn btn-info btn-xs draggable" id={this.props.task._id} title={taskTitle}><i className="fa fa-arrows"></i> {this.props.task.title}</a>
    },
    render() {
        var isDragging = this.props.isDragging;
        var connectDragSource = this.props.connectDragSource;
        // return connectDragSource(
        // <div style={{ opacity: isDragging ? 0.5 : 1 }}>{this.renderTask()}</div>;
        // );
        return <div>{this.renderTask()}</div>;
    }
});

DragSource("userTaskIcon", userTaskIconSource, collect)(UserTaskIcon);

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
        const user = this.data.user[0];
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
DragDropContext(ReactDnDBackend)(User);
