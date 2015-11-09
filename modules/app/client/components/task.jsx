import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import Teams from 'app/collections/Teams';
import Tasks from 'app/collections/Tasks';
import Persons from 'app/collections/Persons';
import Projects from 'app/collections/Projects';
import ProjectModules from 'app/collections/ProjectModules';
import ProjectWorkTypes from 'app/collections/ProjectWorkTypes';
import Clients from 'app/collections/Clients';
import Autosuggest from 'react-autosuggest';

@ReactMixin.decorate(ReactMeteorData)
export class TaskForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            enteringNew: false, user: Meteor.user()
        };
        this.personSelected = this.personSelected.bind(this);
        this.clientSelected = this.clientSelected.bind(this);
        this.projectSelected = this.projectSelected.bind(this);
        this.projectModuleSelected = this.projectModuleSelected.bind(this);
        this.projectWorkTypeSelected = this.projectWorkTypeSelected.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    getMeteorData(){
        const persons = Meteor.subscribe('persons');
        const projects = Meteor.subscribe('projects');
        const clients = Meteor.subscribe("clients");
        const projectmodules = Meteor.subscribe("projectmodules");
        const projectworktypes = Meteor.subscribe("projectworktypes");

        const data = {};

        if(persons.ready() && projects.ready() && clients.ready() && projectmodules.ready() && projectworktypes.ready()) {
            data.persons = Persons.find().fetch();
            data.projects = Projects.find().fetch();
            data.clients = Clients.find().fetch();
            data.projectmodules = ProjectModules.find().fetch();
            data.projectworktypes = ProjectWorkTypes.find().fetch();
            if(Meteor.user()){
                data.userId = Meteor.userId();
            }
        }

        return data;
    }
    render() {
        const personInputAttributes = {
            className: 'form-control',
            placeholder: 'Search People',
            type: 'search'
        };
        const clientInputAttributes = {
            className: 'form-control',
            placeholder: 'Search Clients',
            type: 'search'
        };
        const projectInputAttributes = {
            className: 'form-control',
            placeholder: 'Search Projects',
            type: 'search'
        };
        const projectModuleInputAttributes = {
            className: 'form-control',
            placeholder: 'Search Modules',
            type: 'search'
        };
        const projectWorkTypeInputAttributes = {
            className: 'form-control',
            placeholder: 'Search Work Types',
            type: 'search'
        };
        return (
            <div>
            { this.state.enteringNew ?
                <div>
                <form className="new-task" onSubmit={this.handleSubmit}>
                    <Autosuggest
                        id="personId"
                        ref="personId"
                        className="form-control"
                        suggestions={this.getPersonSuggestions}
                        suggestionRenderer={this.renderPersonSuggestion}
                        suggestionValue={this.renderPersonSuggestionValue}
                        onSuggestionSelected={this.personSelected}
                        inputAttributes={personInputAttributes} />
                    <Autosuggest
                        id="clientId"
                        ref="clientId"
                        className="form-control"
                        suggestions={this.getClientSuggestions}
                        suggestionRenderer={this.renderClientSuggestion}
                        suggestionValue={this.renderClientSuggestionValue}
                        onSuggestionSelected={this.clientSelected}
                        inputAttributes={clientInputAttributes} />
                    <Autosuggest
                        id="projectId"
                        ref="projectId"
                        className="form-control"
                        suggestions={this.getProjectSuggestions}
                        suggestionRenderer={this.renderProjectSuggestion}
                        suggestionValue={this.renderProjectSuggestionValue}
                        onSuggestionSelected={this.projectSelected}
                        inputAttributes={projectInputAttributes} />
                    <Autosuggest
                        id="projectModuleId"
                        ref="projectModuleId"
                        className="form-control"
                        suggestions={this.getProjectModuleSuggestions}
                        suggestionRenderer={this.renderProjectModuleSuggestion}
                        suggestionValue={this.renderProjectModuleSuggestionValue}
                        onSuggestionSelected={this.projectModuleSelected}
                        inputAttributes={projectModuleInputAttributes} />
                    <Autosuggest
                        id="projectWorkTypeId"
                        ref="projectWorkTypeId"
                        className="form-control"
                        suggestions={this.getProjectWorkTypeSuggestions}
                        suggestionRenderer={this.renderProjectWorkTypeSuggestion}
                        suggestionValue={this.renderProjectWorkTypeSuggestionValue}
                        onSuggestionSelected={this.projectWorkTypeSelected}
                        inputAttributes={projectWorkTypeInputAttributes} />
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
                    <button type="submit" className="btn btn-primary btn-block">Save</button>
                </form>
                <button className="btn btn-danger btn-block" onClick={this.toggleForm}>Cancel</button></div> : <button className="btn btn-primary btn-block" onClick={this.toggleForm}>New Task</button>
            }
            </div>
        );
    }
    getPersonSuggestions(input, cb) {
        const regex = new RegExp(input, 'i');
        const persons = Persons.find().fetch().filter(person => regex.test(person.firstname + " " + person.lastname));
        cb(null, persons);
    }
    renderPersonSuggestion(suggestion, input) {
        return (
            suggestion.firstname + " " + suggestion.lastname
        );
    }
    renderPersonSuggestionValue(suggestionObj) {
        return suggestionObj.firstname + " " + suggestionObj.lastname;
    }
    personSelected(suggestion, event) {
        const personId = suggestion.id;
        const personName = suggestion.firstname + " " + suggestion.lastname;
        this.data.personId = personId;
        this.data.personName = personName;
    }
    getClientSuggestions(input, cb) {
        const regex = new RegExp(input, 'i');
        const clients = Clients.find().fetch().filter(client => regex.test(client.name));
        cb(null, clients);
    }
    renderClientSuggestion(suggestion, input) {
        return (
            suggestion.name
        );
    }
    renderClientSuggestionValue(suggestionObj) {
        return suggestionObj.name;
    }
    clientSelected(suggestion, event) {
        const clientId = suggestion.id;
        const clientName = suggestion.name;
        this.data.clientId = clientId;
        this.data.clientName = clientName;
    }
    getProjectSuggestions(input, cb) {
        const regex = new RegExp(input, 'i');
        const projects = Projects.find({ clientid: this.data.clientId }).fetch().filter(project => regex.test(project.name));
        cb(null, projects);
    }
    renderProjectSuggestion(suggestion, input) {
        return (
            suggestion.name
        );
    }
    renderProjectSuggestionValue(suggestionObj) {
        return suggestionObj.name;
    }
    projectSelected(suggestion, event) {
        const projectId = suggestion.id;
        const projectName = suggestion.name;
        this.data.projectId = projectId;
        this.data.projectName = projectName;
    }
    getProjectModuleSuggestions(input, cb) {
        const regex = new RegExp(input, 'i');
        const projectmodules = ProjectModules.find({ projectid: this.data.projectId }).fetch().filter(projectmodule => regex.test(projectmodule.modulename));
        cb(null, projectmodules);
    }
    renderProjectModuleSuggestion(suggestion, input) {
        return (
            suggestion.modulename
        );
    }
    renderProjectModuleSuggestionValue(suggestionObj) {
        return suggestionObj.modulename;
    }
    projectModuleSelected(suggestion, event) {
        const projectModuleId = suggestion.moduleid;
        const projectModuleName = suggestion.modulename
        this.data.projectModuleId = projectModuleId;
        this.data.projectModuleName = projectModuleName;
    }
    getProjectWorkTypeSuggestions(input, cb) {
        const regex = new RegExp(input, 'i');
        const projectworktypes = ProjectWorkTypes.find({ projectid: this.data.projectId }).fetch().filter(projectworktype => regex.test(projectworktype.worktype));
        cb(null, projectworktypes);
    }
    renderProjectWorkTypeSuggestion(suggestion, input) {
        return (
            suggestion.worktype
        );
    }
    renderProjectWorkTypeSuggestionValue(suggestionObj) {
        return suggestionObj.worktype;
    }
    projectWorkTypeSelected(suggestion, event) {
        const projectWorkTypeId = suggestion.worktypeid;
        const projectWorkTypeName = suggestion.worktype;
        this.data.projectWorkTypeId = projectWorkTypeId;
        this.data.projectWorkTypeName = projectWorkTypeName;
    }
    toggleForm() {
        if (this.state.enteringNew === true) {
            this.setState({enteringNew: false});
        } else {
            this.setState({enteringNew: true});
        }
    }
    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const taskTitle = this.refs.taskTitle.value;
        const taskDescription = this.refs.taskDescription.value;
        const taskDueDate = this.refs.taskDueDate.value;
        const personId = this.data.personId;
        const personName = this.data.personName;
        const clientId = this.data.clientId;
        const clientName = this.data.clientName;
        const projectId = this.data.projectId;
        const projectName = this.data.projectName;
        const projectModuleId = this.data.projectModuleId;
        const projectModuleName = this.data.projectModuleName;
        const projectWorkTypeId = this.data.projectWorkTypeId;
        const projectWorkTypeName = this.data.projectWorkTypeName;

        // Meteor.call("postTime", {
        //     "projectid": projectId,
        //     "moduleid": projectModuleId,
        //     "worktypeid": projectWorkTypeId,
        //     "date": "2015-10-10",
        //     "time": "1.00",
        //     "description": taskDescription,
        //     "billable": "f",
        //     "personid": personId
        // }, function (error, result) {
        //     if (error) {
        //         toastr.error(error);
        //     } else {
                Tasks.insert({
                    title: taskTitle,
                    description: taskDescription,
                    createdAt: new Date(), // current time
                    dueDate: taskDueDate,
                    userId: this.data.userId,
                    personId: personId,
                    personName: personName,
                    clientId: clientId,
                    clientName: clientName,
                    projectId: projectId,
                    projectName: projectName,
                    projectModuleId: projectModuleId,
                    projectModuleName: projectModuleName,
                    projectWorkTypeId: projectWorkTypeId,
                    projectWorkTypeName: projectWorkTypeName,
                    archived: false
                });
        //     }
        // });

        this.setState({enteringNew: false});
    }
}

@ReactMixin.decorate(ReactMeteorData)
export class TaskList extends Component {
    getMeteorData() {
        const user = Meteor.user();
        const data = {};
        if(user){
            data.tasks = Tasks.find({userId: user._id, archived: {$ne: true}},{sort: {dueDate: 1}}).fetch()
        }

        return data;
    }
    renderTasks() {
        return this.data.tasks.map((task) => {
            return <Task key={task._id} task={task} />;
        });
    }
    render() {
        return (
            <div>{this.renderTasks()}</div>
        );
    }
}

export class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandTask: false
        };
        this.handleExpand = this.handleExpand.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    static propTypes = {
        task: React.PropTypes.object.isRequired
    };
    render() {
        return (
            <div>
            { this.state.expandTask ?
                <div className="panel panel-default">
                    <div className="panel-heading"><span>{this.props.task.title}</span> <div className="btn-group pull-right"><button className="btn btn-xs btn-danger pull-right" onClick={this.handleClose}><i className="fa fa-times" title="Delete Task" ></i></button> <button className="btn btn-xs btn-info pull-right" onClick={this.handleExpand}><i title="Expand Task" className="fa fa-expand" ></i></button></div></div>
                    <div className="panel-body">
                        <p>{this.props.task.description}</p>
                    </div>
                    <ul className="list-group">
                        <li className="list-group-item">{this.props.task.clientName}</li>
                        <li className="list-group-item">{this.props.task.projectName}</li>
                        <li className="list-group-item">{this.props.task.projectModuleName}</li>
                        <li className="list-group-item">{this.props.task.projectWorkTypeName}</li>
                        <li className="list-group-item">{this.props.task.personName}</li>
                    </ul>
                </div>
            : <div className="panel panel-default">
                <div className="panel-heading"><span>{this.props.task.title}</span> <div className="btn-group pull-right"><button className="btn btn-xs btn-danger pull-right" onClick={this.handleClose}><i className="fa fa-times" title="Delete Task" ></i></button> <button className="btn btn-xs btn-info pull-right" onClick={this.handleExpand}><i title="Expand Task" className="fa fa-expand" ></i></button></div></div>
            </div> }
            </div>
        );
    }
    handleExpand() {
        if (this.state.expandTask === true) {
            this.setState({ expandTask: false })
        } else {
            this.setState({ expandTask: true });
        }
    }
    handleClose() {
        if (confirm("Are you sure you want to delete this task?")) {
            Tasks.remove({ _id: this.props.task._id });
        }
    }
}
