import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import { ActionBar } from './components/actionbar';
import { TaskForm, TaskList } from './components/task';
import { OrganizationList } from './components/organization';
import { ConnectApi } from './api';

export class MainLayout extends Component {
    state = {
        selectedUser: Meteor.user()
    };
    getConnectApiStatus() {
        let user = this.state.selectedUser;
        return user.profile.apikey != "";
    }
    toggleSidebar() {
        this.setState({mainClass: this.state.mainClass === "col-sm-12" ?  "col-sm-offset-4 col-sm-8" : "col-sm-12"});
        this.setState({sidebarClass: this.state.sidebarClass === "col-sm-4 sidebar-closed" ?  "col-sm-4 sidebar-open" : "col-sm-4 sidebar-closed" });
    }
    render() {
        let mainClass = this.state.mainClass === "col-sm-12" ?  "col-sm-offset-4 col-sm-8" : "col-sm-12";
        let sidebarClass = this.state.sidebarClass === "col-sm-4 sidebar-closed" ?  "col-sm-4 sidebar-open" : "col-sm-4 sidebar-closed";
        return (
            <div>
                {this.getConnectApiStatus ?
                <div>
                    <div id="header">
                        <ActionBar setLoggedIn={this.props.setLoggedIn} toggleSidebar={this.toggleSidebar} />
                    </div>
                    <div id="organizations" className={mainClass}>
                        <OrganizationList />
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
};