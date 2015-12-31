import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import { ActionBar } from './components/actionbar';
import { TaskForm, TaskList } from './components/task';

import Tasks from 'app/collections/Tasks';
import TaskStatuses from 'app/collections/TaskStatuses';
import TaskPriorities from 'app/collections/TaskPriorities';

import { OrganizationList } from './components/organization';
import Organizations from 'app/collections/Organizations';

import { User } from './components/user';
import { Team } from './components/team';
import Teams from 'app/collections/Teams';

import Persons from 'app/collections/Persons';
import Clients from 'app/collections/Clients';
import Projects from 'app/collections/Projects';
import ProjectModules from 'app/collections/ProjectModules';

import { ConnectApi } from './api';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

@DragDropContext(HTML5Backend)
@ReactMixin.decorate(ReactMeteorData)
export class MainLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUser: Meteor.user(),
            mainClass: "col-sm-12",
            sidebarClass: "col-sm-4 sidebar-closed"
        };
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.getConnectApiStatus = this.getConnectApiStatus.bind(this);
    }

    getMeteorData() {
        const statuses = Meteor.subscribe('taskstatuses');
        const priorities = Meteor.subscribe('taskpriorities');
        const organizations = Meteor.subscribe("organizations");
        const users = Meteor.subscribe("users");
        const teams = Meteor.subscribe("teams");
        const user = Meteor.user();
        const persons = Meteor.subscribe('persons');
        const clients = Meteor.subscribe('clients');
        const projects = Meteor.subscribe('projects');
        const projectModules = Meteor.subscribe('projectmodules');

        const data = {};

        data.user = user;
        data.ready = false;

        if (teams.ready()) {
            // TODO: This needs to be filtered by organization id
            // currently this is being done downstream in OrganizationList.renderOrganizations
            data.teams = Teams.find().fetch();
        }

        if(organizations.ready() && users.ready()){
            data.organizations = Organizations.find().fetch();
            data.users = Meteor.users.find().fetch();
        }

        if (persons.ready()) {
            data.persons = Persons.find().fetch();
        }

        if(clients.ready()) {
            data.clients = Clients.find().fetch();
        }

        if (projects.ready()) {
            data.projects = Projects.find().fetch();
        }

        if (projectModules.ready()) {
            data.projectModules = ProjectModules.find().fetch();
        }

        if (statuses.ready()) {
            data.statuses = TaskStatuses.find().fetch();
        }

        if (priorities.ready()) {
            data.priorities = TaskPriorities.find().fetch();
        }

        if (user) {
            data.tasks = Tasks.find().fetch()
            data.userTasks = data.tasks.filter(task => task.userId === user._id);
        }

        if (teams.ready() && organizations.ready() && users.ready()
            && statuses.ready() && priorities.ready() && persons.ready()
            && clients.ready() && projects.ready() && projectModules.ready()) {
            data.ready = true;
        }

        return data;
    }

    getConnectApiStatus() {
        let user = this.state.selectedUser;
        return user.profile.apikey != "";
    }

    toggleSidebar() {
        this.setState({mainClass: this.state.mainClass === "col-sm-12" ?  "col-sm-offset-4 col-sm-8" : "col-sm-12"});
        this.setState({sidebarClass: this.state.sidebarClass === "col-sm-4 sidebar-closed" ?  "col-sm-4 sidebar-open" : "col-sm-4 sidebar-closed" });
    }

    componentDidMount() {
        window.addEventListener('usertaskicondrop', (e) => {
            this.setState({sidebarClass: "col-sm-4 sidebar-open"});
            this.setState({mainClass: "col-sm-offset-4 col-sm-8"});
        });
    }

    componentWillUnmount() {
        window.removeEventListener('usertaskicondrop');
    }

    render() {
        return (
            <div>
                {this.getConnectApiStatus() ?
                    <div>
                        <div id="header">
                            <ActionBar toggleSidebar={this.toggleSidebar} setLoggedIn={this.props.setLoggedIn} />
                        </div>
                        { this.data.ready ?
                        <div id="organizations" className={this.state.mainClass}>
                            <OrganizationList organizations={this.data.organizations} user={this.props.user} users={this.data.users} teams={this.data.teams} tasks={this.data.tasks} />
                        </div>
                        : <div className="loading-indicator"><i className="fa fa-circle-o-notch fa-spin"></i></div>}
                        <div id="sidebar" className={this.state.sidebarClass}>
                            { this.data.ready ?
                                <div>
                                    <TaskForm
                                        persons={this.data.persons}
                                        clients={this.data.clients}
                                        projects={this.data.projects}
                                        projectModules={this.data.projectModules}
                                        statuses={this.data.statuses}
                                        priorities={this.data.priorities}
                                        user={this.data.user} />
                                    <TaskList
                                        persons={this.data.persons}
                                        clients={this.data.clients}
                                        projects={this.data.projects}
                                        projectModules={this.data.projectModules}
                                        tasks={this.data.userTasks}
                                        statuses={this.data.statuses}
                                        priorities={this.data.priorities}
                                        user={this.data.user} />
                                </div>
                            : <div className="loading-indicator"><i className="fa fa-circle-o-notch fa-spin"></i></div> }
                        </div>
                    </div>
                    :
                    <ConnectApi />
                }
            </div>
        );
    }
}
