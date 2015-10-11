var ActionBar = React.createClass({
    render() {
        return (
            <ul className="nav nav-pills pull-right">
                <UserButton />
                <LogoutButton />
            </ul>
        );
    }
});

var UserButton = React.createClass({
    getInitialState() {
        return { selected: null, user: Meteor.user()}
    },
    selectUser() {
        Session.set("userSelected", this.state.selected === this.state.user._id ? this.state.user._id : null );
        if(! Session.get("sidebarOpen")){
            Session.set("sidebarOpen", true);
        } else {
            Session.set("sidebarOpen", false);
        }
        this.setState({selected: this.state.selected === this.state.user._id ? null : this.state.user._id });
    },
    render() {
        const buttonClass = this.state.selected === this.state.user._id ? 'btn btn-primary' : 'btn btn-default';
        const username = this.state.user.username;
        return (
            <li><a className={buttonClass} onClick={this.selectUser}>{username}</a></li>
        )
    }
});

var LogoutButton = React.createClass({
    logoutUser() {
        Meteor.logout();
    },
    render() {
        return (
            <li><a className="btn btn-default" onClick={this.logoutUser}>Logout <i className="fa fa-sign-out"></i></a></li>
        );
    }
});

Template.header.helpers({
   ActionBar() {
        return ActionBar;
   }
});

var TaskForm = React.createClass({
    getInitialState() {
        return { enteringNew: false, user: Meteor.user() }
    },
    userId: Meteor.userId(),
    render() {
        return (
            <div>
            { this.state.enteringNew ?
                <form className="new-task" onSubmit={this.handleSubmit}>
                    <input type="text" className="form-control typeahead" name="client" autoComplete="off" spellCheck="off" data-source="clients" data-min-length="0" placeholder="Search Clients" />
                    <input
                        type="text"
                        className="form-control"
                        ref="taskTitle"
                        placeholder="Task Title" />
                    <textarea
                        className="form-control"
                        ref="taskDescription" placeholder="Task Description"></textarea>
                    <input
                        className="form-control"
                        ref="taskDueDate"
                        type="date"
                        placeholder="Task Due Date" />
                </form> : <button className="btn btn-primary btn-block" onClick={this.toggleForm}>New Task</button>
            }
            </div>
        );
    },
    toggleForm() {
        this.setState({enteringNew: true});
    },
    handleSubmit(event) {
        event.preventDefault();
        // Find the text field via the React ref
        var taskTitle = React.findDOMNode(this.refs.taskTitle).value.trim();
        var taskDescription = React.findDOMNode(this.refs.taskTitle).value.trim();

        Tasks.insert({
            title: taskTitle,
            description: taskDescription,
            createdAt: new Date(), // current time
            userId: this.userId
        });

        this.setState({enteringNew: false});
    },
    componentDidUpdate() {
        Meteor.typeahead.inject();
    }
});
var TaskList = React.createClass({
    mixins: [ReactMeteorData],
    userId: Meteor.userId(),
    getMeteorData() {
        return {
            tasks: Tasks.find({userId: this.userId},{sort: {dueDate: 1}}).fetch()
        }
    },
    renderTasks() {
        return this.data.tasks.map((task) => {
            return <Task key={task._id} task={task} />;
        });
    },
    render() {
        return (
            <div>{this.renderTasks()}</div>
        );
    }
});

var Task = React.createClass({
    propTypes: {
        task: React.PropTypes.object.isRequired
    },
    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">{this.props.task.text}</div>
                <div className="panel-body"></div>
            </div>
        );
    }
});

Template.sidebar.helpers({
    statusClass: () => Session.get("sidebarOpen") ? "sidebar-open" : "sidebar-closed"
});

Template.taskList.helpers({
    TaskList() {
        return TaskList;
    }
});
Template.taskForm.helpers({
    TaskForm() {
        return TaskForm;
    },
    clients: function () {
        return Clients.find().fetch().map(function (it) { return it.name; });
    }
});
