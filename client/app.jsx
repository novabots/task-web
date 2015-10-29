App = React.createClass({
    getInitialState() {
        return {loggedIn: Meteor.user()}
    },
    loggedIn() {
        return this.state.loggedIn();
    },
    render() {
        return (
            <div>
                {this.loggedIn ?
                    <MainLayout />
                    :
                    <Auth/>
                }
            </div>
        );
    }
});

MainLayout = React.createClass({
    getInitialState() {
        return { selectedUser: Meteor.user() };
    },
    getConnectApiStatus() {
        let user = this.state.selectedUser;
        return user.profile.apikey != "";
    },
    toggleSidebar() {
        this.setState({mainClass: this.state.mainClass === "col-sm-12" ?  "col-sm-offset-4 col-sm-8" : "col-sm-12"});
        this.setState({sidebarClass: this.state.sidebarClass === "col-sm-4 sidebar-closed" ?  "col-sm-4 sidebar-open" : "col-sm-4 sidebar-closed" });
    },
    render() {
        let mainClass = this.state.mainClass === "col-sm-12" ?  "col-sm-offset-4 col-sm-8" : "col-sm-12";
        let sidebarClass = this.state.sidebarClass === "col-sm-4 sidebar-closed" ?  "col-sm-4 sidebar-open" : "col-sm-4 sidebar-closed";
        return (
            <div>
                {this.getConnectApiStatus ?
                    <div>
                        <div id="header">
                            <ActionBar toggleSidebar={this.toggleSidebar} />
                        </div>
                        <div id="organizations" className={mainClass}>
                            <OrganizationList />
                        </div>
                        <div id="users" className={mainClass}>
                            <UserList />
                        </div>
                        <div id="sidebar" className={sidebarClass}>
                            <TaskForm />
                            <TaskList />
                        </div>
                    </div>
                    :
                    <ConnectApi />
                    }
            </div>
        );
    }
});



var ActionBar = React.createClass({
    render() {
        return (
            <div id="header">
                <ul className="nav nav-pills pull-right">
                    <UserButton toggleSidebar={this.props.toggleSidebar} />
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
        this.props.toggleSidebar();
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
