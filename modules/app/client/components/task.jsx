import { Component, PropTypes } from 'react';
import Tasks from 'app/collections/Tasks';

import TaskStatuses from 'app/collections/TaskStatuses';
import TaskPriorities from 'app/collections/TaskPriorities';

import PersonAutosuggest from './personautosuggest';
import ClientAutosuggest from './clientautosuggest';
import ProjectAutosuggest from './projectautosuggest';
import ProjectModuleAutosuggest from './projectmoduleautosuggest';
import ProjectWorkTypeAutosuggest from './projectworktypeautosuggest';

import { Input } from 'react-bootstrap';

export class TaskForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            enteringNew: false,
            isEditing: props.isEditing,
            user: props.user,
            status: props.task ? props.task.status : "",
            priority: props.task ? props.task.priority : "",
            title: props.task ? props.task.title : "",
            description: props.task ? props.task.description : "",
            dueDate: props.task ? props.task.dueDate : "",
            personId: props.task ? props.task.personId : "",
            personName: props.task ? props.task.personName : "",
            clientId: props.task ? props.task.clientId : "",
            clientName: props.task ? props.task.clientName : "",
            projectId: props.task ? props.task.projectId : "",
            projectName: props.task ? props.task.projectName : "",
            projectModuleId: props.task ? props.task.projectModuleId : "",
            projectModuleName: props.task ? props.task.projectModuleName : "",
            projectWorkTypeId: props.task ? props.task.projectWorkTypeId : "",
            projectWorkTypeName: props.task ? props.task.projectWorkTypeName : "",
            billable: props.task ? props.task.billable : "",
            time: props.task ? props.task.time : 0.00
        };
        this.personSelected = this.personSelected.bind(this);
        this.clientSelected = this.clientSelected.bind(this);
        this.projectSelected = this.projectSelected.bind(this);
        this.projectModuleSelected = this.projectModuleSelected.bind(this);
        this.projectWorkTypeSelected = this.projectWorkTypeSelected.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.stopEdit = this.stopEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div>
            { this.state.enteringNew || this.state.isEditing ?
                <div>
                    <form className="new-task" onSubmit={e => e.preventDefault()}>
                        <PersonAutosuggest
                            label="Person"
                            selected={this.personSelected}
                            task={this.props.task}
                            value={this.state.personName}
                            data={this.props.persons} />
                        <ClientAutosuggest
                            label="Client"
                            selected={this.clientSelected}
                            task={this.props.task}
                            value={this.state.clientName}
                            data={this.props.clients} />
                        <ProjectAutosuggest
                            label="Project"
                            selected={this.projectSelected}
                            task={this.props.task}
                            value={this.state.projectName}
                            client={this.state.clientId}
                            data={this.props.projects} />
                        <ProjectModuleAutosuggest
                            label="Module"
                            selected={this.projectModuleSelected}
                            task={this.props.task}
                            value={this.state.projectModuleName}
                            project={this.state.projectId}
                            data={this.props.projectModules} />
                        <ProjectWorkTypeAutosuggest
                            label="Work Type"
                            selected={this.projectWorkTypeSelected}
                            task={this.props.task}
                            value={this.state.projectWorkTypeName}
                            project={this.state.projectId} />
                        <Input label="Title"
                            type="text"
                            className="form-control"
                            onChange={(e) => this.setState({title: e.target.value})}
                            placeholder="Title"
                            value={this.state.title} />
                        <Input label="Description" type="textarea"
                            className="form-control"
                            placeholder="Description"
                            onChange={(e) => this.setState({description: e.target.value})}
                            value={this.state.description}></Input>
                        <Input label="Due Date"
                            className="form-control"
                            type="date"
                            onChange={(e) => this.setState({dueDate: e.target.value})}
                            value={this.state.dueDate} />
                        <Input label="Status" type="select" value={this.state.status} onChange={(e) => this.setState({status: e.target.value})} className="form-control">
                            <option label="Select ..."></option>
                            {this.props.statuses ?
                                this.props.statuses.map((status, i) => {
                                    return <option value={status.description} key={status.description}>{status.description}</option>
                                })
                                :
                                null
                            }
                        </Input>
                        <Input label="Priority" type="select" value={this.state.priority} onChange={(e) => this.setState({priority: e.target.value})} className="form-control">
                            <option label="Select ..."></option>
                            {this.props.priorities ?
                                this.props.priorities.map((priority, i) => {
                                    return <option value={priority.description} key={priority.description}>{priority.description}</option>
                                })
                                :
                                null
                            }
                        </Input>
                        <Input type="number" label="Time" step="0.25" value={this.state.time} onChange={e => this.setState({time: e.target.value })} />
                        <Input type="select" label="Billable" placeholder="Billable" value={this.state.billable} onChange={e => this.setState({billable: e.target.value})}>
                            <option label="Select ..."></option>
                            <option value="t">Yes</option>
                            <option value="f">No</option>
                        </Input>
                        {this.state.isEditing ?
                            this.props.task && this.state.status === "Time Entry" ?
                                <button type="button" onClick={this.handleSubmit} className="btn btn-primary btn-block">Enter Time</button>
                                :
                                <button type="button" onClick={this.handleSubmit} className="btn btn-primary btn-block">Update</button>
                            :
                            null
                        }
                        {this.state.enteringNew ?
                            <button type="button" onClick={this.handleSubmit} className="btn btn-primary btn-block">Save</button>
                            :
                            null
                        }
                    </form>
                    {this.state.isEditing ?
                        <button className="btn btn-danger btn-block" type="button" onClick={this.stopEdit}>Cancel</button>
                        :
                        null
                    }
                    {this.state.enteringNew ?
                        <button className="btn btn-danger btn-block" type="button" onClick={this.close}>Cancel</button>
                        :
                        null
                    }
                </div>
                :
                <button className="btn btn-primary btn-block" type="button" onClick={this.open}>New Task</button>
            }
            </div>
        );
    }

    personSelected(suggestion, event) {
        const personId = suggestion.id;
        const personName = suggestion.firstname + " " + suggestion.lastname;
        this.setState({personId: personId});
        this.setState({personName: personName});
    }

    clientSelected(suggestion, event) {
        const clientId = suggestion.id;
        const clientName = suggestion.name;
        this.setState({clientName: clientName});
        this.setState({clientId: clientId});
    }

    projectSelected(suggestion, event) {
        const projectId = suggestion.id;
        const projectName = suggestion.name;
        this.setState({projectName: projectName});
        this.setState({projectId: projectId});
    }

    projectModuleSelected(suggestion, event) {
        const projectModuleId = suggestion.moduleid;
        const projectModuleName = suggestion.modulename
        this.setState({projectModuleId: projectModuleId});
        this.setState({projectModuleName: projectModuleName});
    }


    projectWorkTypeSelected(suggestion, event) {
        const projectWorkTypeId = suggestion.worktypeid;
        const projectWorkTypeName = suggestion.worktype;
        this.setState({projectWorkTypeId: projectWorkTypeId});
        this.setState({projectWorkTypeName: projectWorkTypeName});
    }

    close() {
        this.setState({
            enteringNew: false,
            status: "",
            priority: "",
            title: "",
            description: "",
            dueDate: "",
            personId: "",
            personName: "",
            clientId: "",
            clientName: "",
            projectId: "",
            projectName: "",
            projectModuleId: "",
            projectModuleName: "",
            projectWorkTypeId: "",
            projectWorkTypeName: "",
            billable: "",
            time: 0.00
        });
    }

    stopEdit() {
        this.setState({
            isEditing: false,
            status: "",
            priority: "",
            title: "",
            description: "",
            dueDate: "",
            personId: "",
            personName: "",
            clientId: "",
            clientName: "",
            projectId: "",
            projectName: "",
            projectModuleId: "",
            projectModuleName: "",
            projectWorkTypeId: "",
            projectWorkTypeName: "",
            billable: "",
            time: 0.00
        });
        if (this.props.edit) {
            this.props.edit(false);
        }
    }

    open() {
        this.setState({enteringNew: true});
    }

    handleSubmit(event) {
        event.preventDefault();

        const taskTitle = this.state.title;
        const userId = this.props.user._id;
        const taskDescription = this.state.description;
        const taskDueDate = this.state.dueDate;
        const taskStatus = this.state.status;
        const taskPriority = this.state.priority;
        const personId = this.state.personId;
        const personName = this.state.personName;
        const clientId = this.state.clientId;
        const clientName = this.state.clientName;
        const projectId = this.state.projectId;
        const projectName = this.state.projectName;
        const projectModuleId = this.state.projectModuleId;
        const projectModuleName = this.state.projectModuleName;
        const projectWorkTypeId = this.state.projectWorkTypeId;
        const projectWorkTypeName = this.state.projectWorkTypeName;
        const billable = this.state.billable;
        const time = this.state.time;

        let task = {};
        if (this.props.task && this.state.status === "Time Entry") {
            task = this.props.task;
            task.userId = userId;
            task.title = taskTitle;
            task.description = taskDescription;
            task.dueDate = taskDueDate;
            task.status = taskStatus;
            task.priority = taskPriority;
            task.personId = personId;
            task.personName = personName;
            task.clientId = clientId;
            task.clientName = clientName;
            task.projectId = projectId;
            task.projectName = projectName;
            task.projectModuleId = projectModuleId;
            task.projectModuleName = projectModuleName;
            task.projectWorkTypeId = projectWorkTypeId;
            task.projectWorkTypeName = projectWorkTypeName;
            task.archived = true;
            task.billable = billable;
            task.time = time && parseFloat(time).toFixed(2);
            Tasks.update(task._id, task);
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
            //     }
            // });
        } else if (this.props.task) {
            task = this.props.task;
            task.userId = userId;
            task.title = taskTitle;
            task.description = taskDescription;
            task.dueDate = taskDueDate;
            task.status = taskStatus;
            task.priority = taskPriority;
            task.personId = personId;
            task.personName = personName;
            task.clientId = clientId;
            task.clientName = clientName;
            task.projectId = projectId;
            task.projectName = projectName;
            task.projectModuleId = projectModuleId;
            task.projectModuleName = projectModuleName;
            task.projectWorkTypeId = projectWorkTypeId;
            task.projectWorkTypeName = projectWorkTypeName;
            task.billable = billable;
            task.time = time && parseFloat(time).toFixed(2);
            Tasks.update(task._id, task);
        } else {
            task = {
                title: taskTitle,
                status: taskStatus,
                priority: taskPriority,
                description: taskDescription,
                createdAt: new Date(), // current time
                dueDate: taskDueDate,
                userId: userId,
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
                billable: billable,
                time: time && time && parseFloat(time).toFixed(2),
                archived: false
            };
            Tasks.insert(task);
        }
        this.close();
        this.stopEdit();
    }
}

export class TaskList extends Component {
    constructor(props) {
        super(props);
    }

    renderTasks() {
        if (this.props.tasks) {
            return this.props.tasks.map((task) => {
                let expandTask = false;
                if (this.props.data && (this.props.data.task._id === task._id)) {
                    expandTask = true;
                }
                return <Task
                    persons={this.props.persons}
                    clients={this.props.clients}
                    projects={this.props.projects}
                    projectModules={this.props.projectModules}
                    statuses={this.props.statuses}
                    priorities={this.props.priorities}
                    expandTask={expandTask}
                    key={task._id}
                    task={task}
                    user={this.props.user} />;
            });
        }
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
            expandTask: props.expandTask,
            edit: false
        };
        this.handleExpand = this.handleExpand.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.edit = this.edit.bind(this);
        this.taskFormEdit = this.taskFormEdit.bind(this);
        this.clientSelected = this.clientSelected.bind(this);
    }

    static propTypes = {
        task: React.PropTypes.object.isRequired
    };

    render() {
        return (
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <span>{this.props.task.title}</span>
                        <div className="btn-group pull-right">
                            <button className="btn btn-xs btn-danger pull-right" onClick={this.handleDelete}>
                                <i className="fa fa-times" title="Delete Task" ></i>
                            </button>
                            { this.state.expandTask ?
                                <button className="btn btn-xs btn-info pull-right" onClick={this.handleClose}><i title="Expand Task" className="fa fa-expand" ></i></button>
                            :
                                <button className="btn btn-xs btn-info pull-right" onClick={this.handleExpand}><i title="Expand Task" className="fa fa-expand" ></i></button>
                            }
                        </div>
                    </div>
                    { this.state.expandTask ?
                    <div className="panel-body">
                        {this.state.edit ?
                            <TaskForm
                                persons={this.props.persons}
                                clients={this.props.clients}
                                projects={this.props.projects}
                                projectModules={this.props.projectModules}
                                statuses={this.props.statuses}
                                priorities={this.props.priorities}
                                task={this.props.task}
                                edit={this.taskFormEdit}
                                user={this.props.user}
                                isEditing={this.state.edit} />
                            :
                            <div>
                                <ul className="list-group">
                                    <li className="list-group-item">{this.props.task.personName}</li>
                                    <li className="list-group-item">{this.props.task.clientName}</li>
                                    <li className="list-group-item">{this.props.task.projectName}</li>
                                    <li className="list-group-item">{this.props.task.projectModuleName}</li>
                                    <li className="list-group-item">{this.props.task.projectWorkTypeName}</li>
                                    <li className="list-group-item">{this.props.task.description}</li>
                                    <li className="list-group-item">{this.props.task.dueDate}</li>
                                    <li className="list-group-item">{this.props.task.status}</li>
                                    <li className="list-group-item">{this.props.task.priority}</li>
                                </ul>
                                <button className="btn btn-xs btn-info pull-right" onClick={this.edit} type="button">Edit</button>
                            </div>
                        }
                    </div>
                    :
                        null
                    }
                </div>
        );
    }

    edit() {
        this.setState({ edit: true });
    }

    taskFormEdit(edit) {
        this.setState({ edit: edit });
    }

    clientSelected(suggestion, event) {
        const clientId = suggestion.id;
        const clientName = suggestion.name;
        this.setState({clientId: clientId});
    }

    handleDelete() {
        if (confirm("Are you sure you want to delete this task?")) {
            Tasks.remove({ _id: this.props.task._id });
        }
    }

    handleExpand() {
        this.setState({ expandTask: true });
    }

    handleClose() {
        this.setState({ expandTask: false });
    }
}
