import { Component, PropTypes } from 'react';
import { DragSource, DragLayer } from 'react-dnd';
import { Types } from './constants';
import ReactDOM from 'react-dom';
import { OverlayTrigger, Popover } from 'react-bootstrap';

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

const userTaskCircleSource = {
    beginDrag(props) {
        return {
            id: props.task._id
        };
    },
    endDrag(props, monitor, component) {
        let e = document.createEvent('Event');
        e.initEvent('usertaskcircledrop', true, true);
        e.detail = props;
        window.dispatchEvent(e);
    }
};
@DragSource(Types.UserTaskCircle, userTaskCircleSource, (connect, monitor) => ({
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
            <OverlayTrigger placement="top" overlay={<Popover id={id} title={taskTitle}>{taskDescription}</Popover>}>
                {
                    connectDragPreview(connectDragSource(
                    <g style={{ opacity: isDragging ? 0.5 : 1 }}><circle className="task-circle" cx={this.props.cx} cy={this.props.cy} r={this.props.r} /></g>
                    ))
                }
            </OverlayTrigger>
        );
    }
};

function collect(monitor) {
    var item = monitor.getItem();
    return {
        id: item && item._id,
        currentOffset: monitor.getClientOffset(),
        isDragging: monitor.isDragging()
    };
}

function getItemStyles (currentOffset) {
    if (!currentOffset) {
        return {
            display: 'none'
        };
    }

    return {
        pointerEvents: 'none'
    };
}

@DragLayer(collect)
export class TaskCirclePreview extends React.Component {
    render () {
        if (!this.props.isDragging) {
            return <g></g>;
        }
        let x = this.props.currentOffset ? this.props.currentOffset.x : 0;
        let y = this.props.currentOffset ? this.props.currentOffset.y : 0;

        return (
            <g>
               <circle className="task-circle preview" r="20" cx={x} cy={y} style={getItemStyles(this.props.currentOffset)} />
            </g>
        );
    }
}
