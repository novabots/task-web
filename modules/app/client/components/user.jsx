import { Component, PropTypes } from 'react';
import Tasks from 'app/collections/Tasks';
import UserTaskIcon from './usertaskicon';
import { DropTarget } from 'react-dnd';
import { Types } from './constants';

export class UserList extends Component {
    render () {
        return (
            <div>
            {this.props.users.map((user) => {
                return <User key={user._id} user={user} tasks={this.props.tasks} />;
            })}
            </div>
        );
    }
}

const userTaskIconTarget = {
    canDrop(props, monitor) {
        const targetUserId = props.user._id;
        const user = Meteor.users.findOne(targetUserId);
        const item = monitor.getItem();
        const taskId = item.id;
        const task = Tasks.findOne(taskId);
        if(task && user && task.userId !== targetUserId) {
            return true;
        } else {
            return false;
        }
    },
    drop(props, monitor) {
        const targetUserId = props.user._id;
        const item = monitor.getItem();

        Meteor.call("changeTaskOwner", targetUserId, item.id, function(err, res){
            if(res) {
                toastr.success('You have updated the task.');
            }
            if(err) {
                toastr.error('Error: You have not updated the task.');
            }
        });
        return { name: props.user.username };
    }
};

@DropTarget(Types.UserTaskIcon, userTaskIconTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver()
}))
export class User extends Component {
    constructor(props) {
        super(props);
    }

    renderTaskIcons() {
        return this.props.tasks.filter((val) => {
            if (val.userId === this.props.user._id) {
                return val;
            }
        }).map((task) => {
            return <UserTaskIcon key={task._id} task={task} />;
        });
    }
    render () {
        const { connectDropTarget, canDrop, isOver, user } = this.props;
        return connectDropTarget(
            <div className="col-sm-6 user-box">
            {this.props.user ?
                <div className="well well-lg">
                    <h3>{user.username}</h3>
                    <div id={this.props.user._id}>
                        {this.renderTaskIcons()}
                    </div>
                </div>
            :
                null
            }
            </div>
        );
    }
}
