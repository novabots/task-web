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
            <div>
                <form className="new-task" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    className="form-control"
                    ref="textInput"
                    placeholder="Type to add new tasks" />
                </form>
                <div>{this.renderTasks()}</div>
            </div>
        );
    },
    handleSubmit(event) {
        event.preventDefault();
        // Find the text field via the React ref
        var text = React.findDOMNode(this.refs.textInput).value.trim();

        Tasks.insert({
            text: text,
            createdAt: new Date(), // current time
            userId: this.userId
        });

        // Clear form
        React.findDOMNode(this.refs.textInput).value = "";
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
    TaskList() {
        return TaskList;
    },
    statusClass: () => Session.get("sidebarOpen") ? "sidebar-open" : "sidebar-closed"
});
