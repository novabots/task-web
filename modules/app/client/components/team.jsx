import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import Teams from 'app/collections/Teams';
import { UserNodes } from './user';

@ReactMixin.decorate(ReactMeteorData)
export class Team extends Component {
    constructor(props){
        super(props);
    }
    getMeteorData(){
        const users = Meteor.subscribe("users");
        const data = {};
        if(users.ready()){
            data.team = this.props.team;
            data.users = Meteor.users.find({"profile.teams": this.props.team._id}).fetch();
        }

        return data;
    }
    render () {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3>{this.props.team.name}</h3>
                </div>
                <div className="panel-body">
                    {this.data.users ?
                        <UserList users={this.data.users} tasks={this.props.tasks} />
                    :
                        null
                    }
                </div>
                <div className="panel-footer">
                    {this.props.teamMember ?
                        <TeamJoinForm teamId={this.props.team._id} />
                        :
                        null
                    }
                </div>
            </div>
        );
    }
}

@ReactMixin.decorate(ReactMeteorData)
export class TeamNode extends Component {
    constructor(props){
        super(props);
    }
    getMeteorData(){
        const users = Meteor.subscribe("users");
        const data = {};
        if(users.ready()){
            data.team = this.props.team;
            data.users = Meteor.users.find({"profile.teams": this.props.team._id}).fetch();
        }

        return data;
    }
    render () {
        let offset = { top:0,left:0};
        if (this.props.canvas)
            offset = this.props.canvas.getBoundingClientRect();
        return (
            <g>
            <circle className="team-circle" cx={this.props.cx} cy={this.props.cy} r={this.props.r} />
            <text className="team-title" x={this.props.text.x} y={this.props.text.y} textAnchor="middle">
                {this.props.team.name}
            </text>
            {this.data.users ?
                <UserNodes users={this.data.users} tasks={this.props.tasks} offset={offset} team={this.props.team} x={this.props.cx} y={this.props.cy} r={this.props.r} angle={this.props.angle} adjust={this.props.adjust} />
                :
                null
            }
            </g>
        );
    }
}

export class TeamJoinForm extends Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e){
        e.preventDefault();
        Meteor.call("joinTeam", this.props.teamId, (err, res) => {
            if(res) {
                toastr.success('Joined Team.');
            }
            if(err) {
                toastr.error('Error: Team not joined.');
            }
        });
    }
    render () {
        return (
            <button className="btn btn-support join-team" onClick={this.handleClick}>Join Team</button>
        )
    }
}

export class TeamForm extends Component {
    constructor(props){
        super(props);
        this.createTeam = this.createTeam.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    createTeam(e) {
        e.preventDefault();
        Meteor.call("createTeam", this.refs.teamName.value, this.props.orgId, (err, res) => {
            if(res) {
                toastr.success('Team created.');
                this.props.toggleTeamForm(false);
            }
            if(err) {
                toastr.error('Error: Team not created.');
            }
        });
    }
    cancel(e){
        e.preventDefault();
        this.props.toggleTeamForm(false);
    }
    render () {
        return (
            <form id="create-team-form" onSubmit={this.createTeam}>
                <div className="input-group col-sm-4">
                    <input type="text" className="form-control big-input" ref="teamName" id="teamName" placeholder="Team Name" />
                    <span className="input-group-btn">
                        <button type="submit" className="hidden"></button>
                    </span>
                    <span className="input-group-btn">
                        <button className="btn cancel-x" onClick={this.cancel}>&times;</button>
                    </span>
                </div>
            </form>
        );
    }
}
