import { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

const userTaskIconSource = {
    beginDrag(props) {
        return {
            id: props.task._id,
            task: props.task
        };
    }
};

@DragSource("userTaskIcon", userTaskIconSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
export default class UserTaskIcon extends Component {
    render() {
        const isDragging = this.props.isDragging;
        const connectDragSource = this.props.connectDragSource;
        let taskTitle = this.props.task.clientName + " " + this.props.task.description;
        let id = this.props.task._id;
        return (
            <div>
                {
                    connectDragSource(
                        <div style={{ opacity: isDragging ? 0.5 : 1 }}><a className="btn btn-info btn-xs draggable" id={id} title={taskTitle}><i className="fa fa-arrows"></i> {taskTitle}</a></div>
                    )
                }
            </div>
        );
    }
};
