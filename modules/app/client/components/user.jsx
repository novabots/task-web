import { Component, PropTypes } from 'react';
import Tasks from 'app/collections/Tasks';
import { UserTaskIcon, UserTaskCircle, TaskCirclePreview } from './usertaskicon';
import { DropTarget } from 'react-dnd';
import { Types } from './constants';
import { findPoint, nextAngle } from 'app/client/lib/graph';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export class UserNodes extends Component {
    render () {
        let tasks = this.props.tasks;
        let usersCount = this.props.users.length;
        let radius = this.props.r * 0.5;
        let avgAngle = Math.ceil(360 / usersCount);
        let startAngle = this.props.angle;
        let angle = 0;
        let offset = radius * 5;
        if(usersCount > 1) {
            if(usersCount == 2) {
                angle = 180;
            } else {
                angle = avgAngle;
                if(angle >= 360) {
                    angle = angle - 360;
                }
            }
        }
        let positions = [];
        let angles = [];
        let angleInc = Math.ceil(startAngle/2);
        if(usersCount > 1) {
            angleInc = startAngle + Math.ceil(angle/2);
        }
        let start = {x: this.props.x, y: this.props.y};
        for(var i = 0; i < usersCount; i++) {
            let pos = findPoint(nextAngle(angleInc, usersCount), offset, start);
            positions.push(pos);
            angles.push(angleInc);
            angleInc = angleInc + angle;
        }
        let counter = 0;
        return (
            <g>
                {this.props.users.map((user) => {
                    let text = positions[counter];
                    let pos = positions[counter];
                    let r = radius * this.props.zoom;
                    let startAngle = angles[counter];
                    counter++;
                    return <UserNode offset={this.props.offset} key={user._id} user={user} cx={pos.x} cy={pos.y} r={r} text={text} zoom={this.props.zoom} angle={startAngle} tasks={tasks} />;
                    })}
            </g>
        );
    }
}

const userTaskTarget = {
    canDrop(props, monitor) {
        const targetUserId = props.user._id;
        const user = Meteor.users.findOne(targetUserId);
        const task = Tasks.findOne(monitor.getItem().id);
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
@DropTarget(Types.UserTaskCircle, userTaskTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver()
}))
export class UserNode extends Component {
    constructor(props) {
        super(props);
    }
    renderTaskCircles() {
        let tasks = this.props.tasks.filter((val) => {
            if (val.userId === this.props.user._id) {
                return val;
            }
        });
        let tasksCount = tasks.length;
        let radius = this.props.r * 0.7;
        let avgAngle = Math.ceil(360 / tasksCount);
        let startAngle = this.props.angle;
        if(startAngle == 0) {
            startAngle = 180;
        }
        let angle = 0;
        let offset = radius * 3;
        if(tasksCount > 1) {
            if(tasksCount == 2) {
                angle = 180;
            } else {
                angle = avgAngle;
                if(angle >= 360) {
                    angle = angle - 360;
                }
            }
        }
        let positions = [];
        let angleInc = Math.ceil(startAngle/2);
        if(tasksCount > 1) {
            angleInc = startAngle + Math.ceil(angle/2);
        }
        let start = {x: this.props.cx, y: this.props.cy};
        for(var i = 0; i < tasksCount; i++) {
            let pos = findPoint(nextAngle(angleInc, tasksCount), offset, start);
            positions.push(pos);
            angleInc = angleInc + angle;
        }
        let counter = 0;
        return tasks.map((task) => {
            let pos = positions[counter];
            let r = radius * this.props.zoom;
            counter++;
            return <UserTaskCircle key={task._id} task={task} cx={pos.x} cy={pos.y} r={r} />;
        });
    }
    render () {
        const { connectDropTarget, canDrop, isOver, user } = this.props;
        return (
           <g>
                <OverlayTrigger placement="top" overlay={<Tooltip id={user._id}>{user.username}</Tooltip>}>
                     {connectDropTarget(<circle className="user-circle" id={user._id} cx={this.props.cx} cy={this.props.cy} r={this.props.r} />)}
                </OverlayTrigger>
               {this.renderTaskCircles()}
               <TaskCirclePreview offset={this.props.offset} />
           </g>
        );
    }
}
