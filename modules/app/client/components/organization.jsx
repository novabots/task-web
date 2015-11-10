import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import Organizations from 'app/collections/Organizations';
import Teams from 'app/collections/Teams';
import { Team, TeamForm } from './team';
import { User } from './user';

@ReactMixin.decorate(ReactMeteorData)
export class OrganizationList extends Component{
    constructor(props){
        super(props);
    }
    getMeteorData() {
        const organizations = Meteor.subscribe("organizations");
        const users = Meteor.subscribe("users");
        const data = {};
        if(organizations.ready() && users.ready()){
            data.organizations = Organizations.find().fetch();
            data.users = Meteor.users.find().fetch();
        }
        return data;
    }
    renderUsersWithNoTeam() {
        let noTeams = [];
        _.each(this.data.users, function(user){
            if(_.isEmpty(user.profile.teams)){
                noTeams.push(user);
            }
        });
        return noTeams.map((user) => {
            return <User key={user._id} user={user} />
        });
    }
    renderOrganizations() {
        if (this.data.organizations.length > 0) {
            return this.data.organizations.map((organization) => {
                return <Organization key={organization._id} organization={organization} user={this.props.user} />;
            });
        } else {
            return <OrganizationForm />
        }
    }
    render() {
        return (
            <div>
        {this.data.organizations ?
            <div>
                {this.renderOrganizations()}
                {this.renderUsersWithNoTeam()}
            </div>
        :
            null
        }
            </div>
        );
    }
}

@ReactMixin.decorate(ReactMeteorData)
export class Organization extends Component {
    constructor(props){
        super(props);
        this.state = {
            "creatingTeam" : false
        };
        this.creatingTeam = this.creatingTeam.bind(this);
        this.toggleTeamForm = this.toggleTeamForm.bind(this);
    }
    getMeteorData() {
        const teams = Meteor.subscribe("teams");

        const data = {};
        if(teams.ready()){
            data.teams = Teams.find({orgId: this.props.organization._id}).fetch();
        }
        return data;
    }
    creatingTeam(){
        this.setState({ "creatingTeam" : true })
    }
    toggleTeamForm(state){
        this.setState({ "creatingTeam" : state })
    }
    renderTeams(){
        let user = this.props.user;
        return this.data.teams.map((team) => {
            let teamMember =  ! (user.profile.teams.indexOf(team._id) > -1);
            return <Team key={team._id} team={team} teamMember={teamMember} />;
        });
    }
    render() {
        return (
            <div id="org" className="well well-lg">
                <h1>{this.props.organization.name}</h1>
                {this.state.creatingTeam ?
                    <TeamForm orgId={this.props.organization._id} toggleTeamForm={this.toggleTeamForm}  />
                    :
                    <div className="btn-group btn-group-lg">
                        <button className="btn btn-support create-team-button" onClick={this.creatingTeam}>Create Team <i className="fa fa-plus"></i></button>
                    </div>
                }
                <div className="org-teams">
                {this.data.teams ?
                    <div>
                        {this.renderTeams()}
                    </div>
                :
                    <div className="loading-indicator"><i className="fa fa-circle-o-notch fa-spin"></i></div>
                }
                </div>
            </div>

        );
    }
}

export class OrganizationForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            "creatingOrg" : false
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render () {
        return (
            <div>
            { this.state.creatingOrg ?
                <form id="create-org-form" onSubmit={this.handleSubmit}>
                    <div className="input-group col-sm-4">
                        <input type="text" className="form-control big-input" ref="orgName" id="orgName" placeholder="Organization Name" />
                        <span className="input-group-btn">
                            <button type="button" className="btn cancel-x" ref="cancel" onClick={this.handleCancel}>&times;</button>
                        </span>
                    </div>
                </form>
                :
                <div className="btn-group btn-group-lg">
                    <button className="btn btn-primary" id="create-org-button" onClick={this.handleClick}>Create Organisation <i className="fa fa-plus"></i></button>
                </div>
            }
            </div>
        );
    }
    handleClick() {
        this.setState({ "creatingOrg" : true });
    }
    handleSubmit(evt) {
        evt.preventDefault();
        Meteor.call("createOrg", this.refs.orgName.value, (err, res) => {
            if(res) {
                toastr.success('Organization created.');
                this.setState({"creatingOrg": false});
            }
            if(err) {
                toastr.error('Error: Organization not created.');
            }
        });
    }
    handleCancel(evt) {
        this.setState({"creatingOrg": false});
    }
}
