import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import Tasks from 'app/collections/Tasks';
import { UserTaskIcon, UserTaskCircle, TaskCirclePreview } from './usertaskicon';
import { DropTarget } from 'react-dnd';
import { Types } from './constants';
import { findPoint, nextAngle } from 'app/client/lib/graph';


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

export class UserNodes extends Component {
    render () {
        let usersCount = this.props.users.length;
        let radius = this.props.r * 0.5;
        let avgAngle = Math.ceil(360 / usersCount);
        let angle = this.props.angle + avgAngle;
        let offset = radius * 5;
        if(usersCount > 1) {
            angle = (360 / usersCount) + angle;
            if(angle > 360) {
                angle = angle - 360;
                if(angle == 0) {
                    angle = 90;
                }
            }
        }
        let positions = [];
        let angleInc = angle;
        let start = {x: this.props.x, y: this.props.y};
        for(var i = 0; i < usersCount; i++) {
            let pos = findPoint(nextAngle(angleInc, usersCount), offset, start);
            positions.push(pos);
            angleInc = angleInc + angle;
        }
        let counter = 0;
        return (
            <g>
                {this.props.users.map((user) => {
                    let text = positions[counter];
                    let pos = positions[counter];
                    let r = radius * this.props.zoom;
                    counter++;
                    return <UserNode key={user._id} user={user} cx={pos.x} cy={pos.y} r={r} text={text} zoom={this.props.zoom} angle={angle} />;
                    })}
            </g>
        );
    }
}

const userTaskTarget = {
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
};

@DropTarget(Types.UserTaskIcon, userTaskTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver()
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
            <div className="col-sm-6 user-box">
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

@DropTarget(Types.UserTaskCircle, userTaskTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver()
}))
@ReactMixin.decorate(ReactMeteorData)
export class UserNode extends Component {
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
    renderTaskCircles() {
        let tasksCount = this.data.tasks.length;
        let radius = this.props.r * 0.7;
        let avgAngle = Math.ceil(360 / tasksCount);
        let angle = this.props.angle + 45;
        let offset = radius * 3;
        if(tasksCount > 1) {
            angle = avgAngle + (angle - 45);
            if(angle >= 360) {
                angle = angle - 360;
                if(angle == 0) {
                    angle = 90;
                }
            }
        }
        let positions = [];
        let angleInc = angle;
        let start = {x: this.props.cx, y: this.props.cy};
        for(var i = 0; i < tasksCount; i++) {
            let pos = findPoint(nextAngle(angleInc, tasksCount), offset, start);
            positions.push(pos);
            angleInc = angleInc + angle;
        }
        let counter = 0;
        return this.data.tasks.map((task) => {
            let text = positions[counter];
            let pos = positions[counter];
            let r = radius * this.props.zoom;
            counter++;
            return <UserTaskCircle key={task._id} task={task} cx={pos.x} cy={pos.y} r={r} text={text} />;
        });
    }
    render () {
        const user = this.data.user[0];
        const { connectDropTarget, canDrop, isOver } = this.props;
        return connectDropTarget(
            <g>
                {this.data.user ?
                    <g>
                    <circle className="user-circle" id={this.data.user._id} cx={this.props.cx} cy={this.props.cy} r={this.props.r} />
                    <text x={this.props.text.x} y={this.props.text.y} textAnchor="middle" className="user-text">{user.username}</text>
                    {this.renderTaskCircles()}
                        <TaskCirclePreview />
                    </g>
                :
                    null
                }
            </g>
        );
    }
}