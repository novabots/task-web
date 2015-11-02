TaskForm = React.createClass({
    getInitialState() {
        return { enteringNew: false, user: Meteor.user() }
    },
    userId: Meteor.userId(),
    render() {
        const inputAttributes = {
            className: 'form-control',
            placeholder: 'Enter locations...',
            type: 'search',
            onChange: value => console.log(`Input value changed to: ${value}`),
            onBlur: event => console.log('Input blurred. Event:', event)
        };
        return (
            <div>
            { this.state.enteringNew ?
                <div>
                <form className="new-task" onSubmit={this.handleSubmit}>
                    <ReactAutosuggest
                        id="personId"
                        ref="personId"
                        className="form-control"
                        suggestions={this.getPersonSuggestions}
                        suggestionRenderer={this.renderPersonSuggestion}
                        suggestionValue={this.renderPersonSuggestionValue}
                        inputAttributes={inputAttributes} />
                    <ReactAutosuggest
                        id="clientId"
                        ref="clientId"
                        className="form-control"
                        suggestions={this.getClientSuggestions}
                        suggestionRenderer={this.renderClientSuggestion}
                        suggestionValue={this.renderClientSuggestionValue}
                        inputAttributes={inputAttributes} />
                    <ReactAutosuggest
                        id="projectId"
                        ref="projectId"
                        className="form-control"
                        suggestions={this.getProjectSuggestions}
                        suggestionRenderer={this.renderProjectSuggestion}
                        suggestionValue={this.renderProjectSuggestionValue}
                        inputAttributes={inputAttributes} />
                    <ReactAutosuggest
                        id="projectModuleId"
                        ref="projectModuleId"
                        className="form-control"
                        suggestions={this.getProjectModuleSuggestions}
                        suggestionRenderer={this.renderProjectModuleSuggestion}
                        suggestionValue={this.renderProjectModuleSuggestionValue}
                        inputAttributes={inputAttributes} />
                    <ReactAutosuggest
                        id="projectWorkTypeId"
                        ref="projectWorkTypeId"
                        className="form-control"
                        suggestions={this.getProjectWorkTypeSuggestions}
                        suggestionRenderer={this.renderProjectWorkTypeSuggestion}
                        suggestionValue={this.renderProjectWorkTypeSuggestionValue}
                        inputAttributes={inputAttributes} />
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
    },
    getPersonSuggestions(input, cb) {
        const regex = new RegExp('^' + input, 'i');
        const persons = Persons.find().fetch().filter(person => regex.test(person.firstname + " " + person.lastname));
        cb(null, persons);
    },
    renderPersonSuggestion(suggestion, input) {
        return (
            suggestion.firstname + " " + suggestion.lastname
        );
    },
    renderPersonSuggestionValue(suggestionObj) {
        return suggestionObj.firstname + " " + suggestionObj.lastname;
    },
    getClientSuggestions(input, cb) {
        const clients = Clients.find({ "name": { $regex: input } }).fetch();
        cb(null, clients);
    },
    renderClientSuggestion(suggestion, input) {
        return (
            suggestion.name
        );
    },
    renderClientSuggestionValue(suggestionObj) {
        return suggestionObj.name;
    },
    toggleForm() {
        if (this.state.enteringNew === true) {
            this.setState({enteringNew: false});
        } else {
            this.setState({enteringNew: true});
        }
    },
    handleSubmit(event) {
        event.preventDefault();
        // Find the text field via the React ref
        var taskTitle = React.findDOMNode(this.refs.taskTitle).value.trim();
        var taskDescription = React.findDOMNode(this.refs.taskDescription).value.trim();
        var taskDueDate = React.findDOMNode(this.refs.taskDueDate).value.trim();
        var personId = Session.get("person").id;
        var personName = Session.get("person").value;
        var clientId = Session.get("client").id;
        var clientName = Session.get("client").value;
        var projectId = Session.get("project").id;
        var projectName = Session.get("project").value;
        var projectModuleId = Session.get("projectModule").id;
        var projectModuleName = Session.get("projectModule").value;
        var projectWorkTypeId = Session.get("projectWorkType").id;
        var projectWorkTypeName = Session.get("projectWorkType").value;

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
                    userId: this.userId,
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
});
TaskList = React.createClass({
    mixins: [ReactMeteorData],
    userId: Meteor.userId(),
    getMeteorData() {
        return {
            tasks: Tasks.find({userId: this.userId, archived: {$ne: true}},{sort: {dueDate: 1}}).fetch()
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
    getInitialState() {
        return { expandTask: false };
    },
    propTypes: {
        task: React.PropTypes.object.isRequired
    },
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
    },
    handleExpand() {
        if (this.state.expandTask === true) {
            this.setState({ expandTask: false })
        } else {
            this.setState({ expandTask: true });
        }
    },
    handleClose() {
        if (confirm("Are you sure you want to delete this task?")) {
            Tasks.remove({ _id: this.props.task._id });
        }
    }
});
Template.taskForm.helpers({
    persons() {
        return Persons.find().fetch().map(function (it) { return { "value": it.firstname + " " + it.lastname, "id": it.id }; });
    },
    clients() {
        return Clients.find().fetch().map(function (it) { return { "value": it.name, "id": it.id }; });
    },
    projects() {
        return Projects.find({ clientid: Session.get("client").id }).fetch().map(function (it) { return { "value": it.name, "id": it.id }; });
    },
    projectmodules() {
        return ProjectModules.find({ projectid: Session.get("project").id }).fetch().map(function (it) { return { "value": it.modulename, "id": it.moduleid }; });
    },
    projectworktypes() {
        return ProjectWorkTypes.find({ projectid: Session.get("project").id }).fetch().map(function (it) { return { "value": it.worktype, "id": it.worktypeid }; });
    },
    personSelected(event, suggestion, datasetName) {
        Session.set("person", suggestion);
    },
    clientSelected(event, suggestion, datasetName) {
        Session.set("client", suggestion);
    },
    projectSelected(event, suggestion, datasetName) {
        Session.set("project", suggestion);
    },
    projectmoduleSelected(event, suggestion, datasetName) {
        Session.set("projectModule", suggestion);
    },
    projectworktypeSelected(event, suggestion, datasetName) {
        Session.set("projectWorkType", suggestion);
    },
    activeTaskId: function() {
        return Session.get("activeTaskId");
    }
});

Template.taskList.helpers({
    TaskList() {
        return TaskList;
    }
});

Template.taskForm.onCreated(function () {
    Session.set("person", {});
    Session.set("client", {});
    Session.set("project", {});
    Session.set("projectModule", {});
    Session.set("projectWorkType", {});
});

Template.taskIcon.onRendered(function () {
    $( ".draggable" ).draggable({
        revert: "invalid"
    });
    $(".droppable").droppable({
        drop: function( event, ui ) {
            var userId = event.target.id,
                user = Meteor.users.findOne(userId),
                taskId = ui.draggable[0].id,
                task = Tasks.findOne(taskId);
            if(task && user && task.userId !== user._id) {
                Meteor.call("changeTaskOwner", user._id, task._id, function(err, res){
                    if(res) {
                        toastr.success('You have updated the task.');
                    }
                    if(err) {
                        toastr.error('Error: You have not updated the task.');
                    }
                });
            } else {
                return false;
            }
        }
    });
});
