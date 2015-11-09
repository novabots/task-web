import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import { DragDropContext } from 'react-dnd';
import Tasks from 'app/collections/Tasks';
import HTML5Backend from 'react-dnd-html5-backend';
import UserTaskIcon from './usertaskicon';


@ReactMixin.decorate(ReactMeteorData)
export class UserList extends Component {
    getMeteorData() {
        return {
            users: Meteor.users.find().fetch()
        }
    }
    render () {
        return (
            <div>
            {this.renderUsers()}
            </div>
        );
    }
    renderUsers () {
        return this.data.users.map((user) => {
            return <User key={user._id} user={user} />;
        });
    }
}

@DragDropContext(HTML5Backend)
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
}
