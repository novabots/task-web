App = React.createClass({
    render() {
        return (
            <div>
                <div id="header">
                    <ActionBar />
                </div>
                <div id="organizations" className="{{statusClass}}">
                    <OrganizationList />
                </div>
                <div id="users" className="{{statusClass}}">
                    <UserList />
                </div>
                <div id="sidebar" className="col-sm-4 {{statusClass}}">
                    <TaskForm />
                    <TaskList />
                </div>
            </div>
        );
    }
});

var ActionBar = React.createClass({
    render() {
        return (
            <div id="header">
                <ul className="nav nav-pills pull-right">
                    <UserButton />
                    <RefreshData />
                    <LogoutButton />
                </ul>
            </div>
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
function handleApiResponse(err, res, collection) {
    if (res.data.status === "OK") {
        toastr.success(`${collection} updated!`);
    } else {
        toastr.warning(err);
        console.log(err);
    }
}
var RefreshData = React.createClass({
    render() {
        return (
            <li><a className="btn btn-default" onClick={this.refreshData}>refresh</a></li>
        );
    },
    refreshData() {
        try {
            Meteor.call("getClients", function (err, res) {
                handleApiResponse(err, res, "Clients");
            });
            Meteor.call("getProjects", function (err, res) {
                handleApiResponse(err, res, "Projects");
            });
            Meteor.call("getProjectModules", function (err, res) {
                handleApiResponse(err, res, "Modules");
            });
            Meteor.call("getProjectWorkTypes", function (err, res) {
                handleApiResponse(err, res, "Work Types");
            });
            Meteor.call("getPersons", function (err, res) {
                handleApiResponse(err, res, "People");
            });
        } catch(e) {
            toastr.error(e);
        }
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
