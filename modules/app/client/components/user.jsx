import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import Tasks from 'app/collections/Tasks';
import UserTaskIcon from './usertaskicon';
import { DropTarget } from 'react-dnd';
import { Types } from './constants';


export class UserList extends Component {
    render () {
        return (
            <div>
            {this.props.users.map((user) => {
                return <User key={user._id} user={user} />;
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
        const task = Tasks.findOne(item.id);
        Meteor.call("changeTaskOwner", targetUserId, task._id, function(err, res){
            if(res) {
                toastr.success('You have updated the task.');
            }
            if(err) {
                toastr.error('Error: You have not updated the task.');
            }
        });
        return { name: props.user.username };
    }
}
@DropTarget(Types.UserTaskIcon, userTaskIconTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver(),
}))
@ReactMixin.decorate(ReactMeteorData)
export class User extends Component {
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
    }
    renderTaskIcons() {
        return this.data.tasks.map((task) => {
            return <UserTaskIcon key={task._id} task={task} />;
        });
    }
    render () {
        const user = this.data.user[0];
        const { connectDropTarget, canDrop, isOver } = this.props;
        return connectDropTarget(
            <div className="col-sm-3">
            {this.data.user ?
                <div className="well well-lg">
                    <h3>{user.username}</h3>
                    <div id={this.data.user._id}>
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
