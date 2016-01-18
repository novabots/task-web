import { Component, PropTypes } from 'react';
import Organizations from 'app/collections/Organizations';
import Teams from 'app/collections/Teams';
import { Team, TeamForm, TeamNode } from './team';
import { UserNode } from './user';
import { findPoint, nextAngle } from 'app/client/lib/graph';

export class OrganizationList extends Component{
    constructor(props){
        super(props);
    }

    renderUsersWithNoTeam() {
        let noTeams = [];
        _.each(this.props.users, function(user){
            if(_.isEmpty(user.profile.teams)){
                noTeams.push(user);
            }
        });
        return noTeams.map((user) => {
            return <User key={user._id} user={user} tasks={this.props.tasks} />
        });
    }

    renderOrganizations() {
        if (this.props.organizations.length > 0) {
            return this.props.organizations.map((organization) => {
                let teams = this.props.teams.filter((val) => {
                    if (val.orgId === organization._id) {
                        return val;
                    }
                });
                return <OrganizationGraph key={organization._id} organization={organization} user={this.props.user} teams={teams} tasks={this.props.tasks} />;

            });
        } else {
            return <OrganizationForm />
        }
    }
    render() {
        return (
            <div>
            {this.props.organizations ?
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

export class Organization extends Component {
    constructor(props){
        super(props);
        this.state = {
            "creatingTeam" : false
        };
        this.creatingTeam = this.creatingTeam.bind(this);
        this.toggleTeamForm = this.toggleTeamForm.bind(this);
    }

    creatingTeam(){
        this.setState({ "creatingTeam" : true })
    }

    toggleTeamForm(state){
        this.setState({ "creatingTeam" : state })
    }

    renderTeams(){
        let user = this.props.user;
        return this.props.teams.map((team) => {
            let teamMember =  ! (user.profile.teams.indexOf(team._id) > -1);
            return <Team key={team._id} team={team} teamMember={teamMember} tasks={this.props.tasks} />;
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
                {this.props.teams ?
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

export class OrganizationGraph extends Component {
    constructor(props){
        super(props);
        this.state = {
            creatingTeam : false,
            zoom : 1,
            width : 0,
            height: 0,
            transMatrix: [1,0,0,1,0,0],
            scale: 1.0,
            scaleInc: 0.1,
            lastZoom: null
        };
        this.creatingTeam = this.creatingTeam.bind(this);
        this.toggleTeamForm = this.toggleTeamForm.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.updateDimensions = _.debounce(this.updateDimensions,1000);
        this.handleScroll = this.handleScroll.bind(this);
        this.zoom = this.zoom.bind(this);
    }
    creatingTeam(){
        this.setState({ "creatingTeam" : true })
    }
    toggleTeamForm(state){
        this.setState({ "creatingTeam" : state })
    }
    componentWillMount(){
        this.updateDimensions();
    }
    componentWillUnmount(){
        window.removeEventListener("resize", this.updateDimensions);
    }
    componentDidMount(){
        window.addEventListener("resize", this.updateDimensions);
    }
    updateDimensions() {
        this.setState({ width: window.innerWidth , height: window.innerHeight });
    }
    renderTeams(zoom){
        let user = this.props.user;
        let teamsCount = this.props.teams.length;
        let baseRadius = 70;
        let angle = 0;
        let offset = 0;
        if(teamsCount > 1) {
            angle = Math.ceil(360 / teamsCount);
            offset = baseRadius * zoom * 4;
        }
        let positions = [];
        let angles = [];
        let angleInc = angle;
        let startX = this.state.width / 2;
        let startY = this.state.height / 2;
        let start = {x: startX, y: startY};
        for(var i = 0; i < teamsCount; i++) {
            let pos = findPoint(nextAngle(angleInc, teamsCount), offset, start);
            positions.push(pos);
            angles.push(angleInc);
            angleInc = angleInc + angle;
        }
        let counter = 0;
        let tasks = this.props.tasks;
        return this.props.teams.map((team) => {
            let teamMember = ! (user.profile.teams.indexOf(team._id) > -1);
            let text = positions[counter];
            let pos = positions[counter];
            let r = baseRadius * zoom;
            let startAngle = angles[counter];
            counter++;
            return <TeamNode canvas={this.canvas} key={team._id} team={team} teamMember={teamMember} cx={pos.x} cy={pos.y} r={r} text={text} zoom={zoom} angle={startAngle} tasks={tasks} />;
        });
    }

    handleScroll(e) {
        let scroll = e.deltaY.toFixed(3);
        let zoomDir = (scroll > 0);
        let lastZoom = this.state.lastZoom;
        if(lastZoom == null) {
            lastZoom = !zoomDir;
        }
        this.zoom(zoomDir, lastZoom);
        this.setState({lastZoom: zoomDir});
    }

    zoom(zoom, last){
        let newScale = 0;
        let scale = this.state.scale;
        let inc = this.state.scaleInc;
        let width = this.state.width;
        let height = this.state.height;
        let transMatrix = [1,0,0,1,0,0];
        if(zoom) {
            newScale = scale + inc;
            if(newScale > 2) {
                newScale = 2;
            }
        } else {
            newScale = scale - inc;
            if(newScale < 0.5) {
                newScale = 0.5;
            }
        }
        console.log(transMatrix);
        console.log(newScale);
        if((newScale != scale && zoom == last) || (newScale == scale && zoom != last)) {
            for (var i=0; i<transMatrix.length; i++) {
                transMatrix[i] *= newScale;
            }
            transMatrix[4] += (1-newScale)*width/2;
            transMatrix[5] += (1-newScale)*height/2;
            this.setState({transMatrix: transMatrix, scale: newScale});
        }
    }

    pan(e) {
        console.log(e);
    }

    render() {
        let matrix = this.state.transMatrix.join(" ");
        return (
            <div>
                <div id="org" className="well well-lg">
                    <h1>{this.props.organization.name}</h1>
                    {this.state.creatingTeam ?
                    <TeamForm orgId={this.props.organization._id} toggleTeamForm={this.toggleTeamForm}  />
                        :
                    <div className="btn-group btn-group-lg">
                        <button className="btn btn-support create-team-button" onClick={this.creatingTeam}>Create Team <i className="fa fa-plus"></i></button>
                    </div>
                    }

                </div>
                <div className="org-teams">
                {this.props.teams ?
                    <svg onWheel={this.handleScroll} id="org-graph" width="100%" height={this.state.height} ref={(ref) => this.canvas = ref} viewBox={"0 0 " + this.state.width + " " + this.state.height}>
                        <g id="transform-matrix" transform={"matrix("+matrix+")"}>
                            {this.renderTeams(this.state.zoom)}
                        </g>
                    </svg>
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
