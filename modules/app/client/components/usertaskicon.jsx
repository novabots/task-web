import { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
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
export default class UserTaskIcon extends Component {
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
