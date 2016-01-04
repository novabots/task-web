import { Component, PropTypes } from 'react';
import { DragSource, DragLayer } from 'react-dnd';
import { Types } from './constants';
import ReactDOM from 'react-dom';

const userTaskIconSource = {
    beginDrag(props) {
        return {
            id: props.task._id
        };
    },
    endDrag(props, monitor, component) {
        let e = document.createEvent('Event');
        e.initEvent('usertaskicondrop', true, true);
        e.detail = props;
        window.dispatchEvent(e);
    }
};

@DragSource(Types.UserTaskIcon, userTaskIconSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
export class UserTaskIcon extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { connectDragSource, isDragging } = this.props;

        let taskTitle = this.props.task.title;
        let taskDescription = this.props.task.description;
        let id = this.props.task._id;
        return (
            <div>
                {
                    connectDragSource(
                        <div style={{ opacity: isDragging ? 0.5 : 1 }}><a className="btn btn-info btn-xs" id={id} title={taskDescription}><i className="fa fa-arrows"></i> {taskTitle}</a></div>
                    )
                }
            </div>
        );
    }
};

@DragSource(Types.UserTaskCircle, userTaskIconSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
}))
export class UserTaskCircle extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { connectDragSource, connectDragPreview, isDragging } = this.props;

        let taskTitle = this.props.task.title;
        let taskDescription = this.props.task.description;
        let id = this.props.task._id;
        return (
            <g>
                {
                    connectDragPreview(connectDragSource(
                    <g style={{ opacity: isDragging ? 0.5 : 1 }}><circle className="task-circle" cx={this.props.cx} cy={this.props.cy} r={this.props.r} /><text className="task-description" x={this.props.text.x} textAnchor="middle" y={this.props.text.y} id={id} title={taskDescription}>{taskTitle}</text></g>
                    ))
                }
            </g>
        );
    }
};

function collect(monitor) {
    var item = monitor.getItem();
    return {
        id: item && item._id,
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    };
}

function getItemStyles (currentOffset) {
    if (!currentOffset) {
        return {
            display: 'none'
        };
    }

    var x = currentOffset.x;
    var y = currentOffset.y;
    var transform = `translate(${x}px, ${y}px)`;
    return {
        pointerEvents: 'none',
        //transform: transform,
        //WebkitTransform: transform
    };
}

@DragLayer(collect)
export class TaskCirclePreview extends React.Component {
    render () {
        if (!this.props.isDragging) {
            return <g></g>;
        }

        return (
            <g>
               <circle className="task-circle preview" r="20" cx={this.props.currentOffset.x + this.props.offset.left} cy={this.props.currentOffset.y - this.props.offset.top} style={getItemStyles(this.props.currentOffset)} />
            </g>
        );
    }
}
