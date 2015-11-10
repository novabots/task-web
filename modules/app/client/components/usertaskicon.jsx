import { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { Types } from './constants';

const userTaskIconSource = {
    beginDrag(props) {
        return {
            id: props.task._id,
        };
    }
};

@DragSource(Types.UserTaskIcon, userTaskIconSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
export default class UserTaskIcon extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { connectDragSource, isDragging } = this.props;

        let taskTitle = this.props.task.clientName + " " + this.props.task.description;
        let id = this.props.task._id;
        return (
            <div>
                {
                    connectDragSource(
                        <div style={{ opacity: isDragging ? 0.5 : 1 }}><a className="btn btn-info btn-xs" id={id} title={taskTitle}><i className="fa fa-arrows"></i> {taskTitle}</a></div>
                    )
                }
            </div>
        );
    }
};
