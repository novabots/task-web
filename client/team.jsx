Team = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData(){
        const teams = Meteor.subscribe("teams");
        const users = Meteor.subscribe("users");
        const user = Meteor.user();
        const data = {};
        if(teams.ready() && users.ready()){
            data.team = Teams.find({_id: this.props.team._id}).fetch();
            data.users = Meteor.users.find({"profile.teams": this.props.team._id}).fetch();
            if(user){
                data.teamMember = ! (user.profile.teams.indexOf(this.props.team._id) !== -1);
            }
        }

        return data;
    },
    setInitialState() {
        return {teamMember: function() {

        }};
    },
    renderTeamMembers() {
        return (
            <div>
                {this.data.users.map(user => {
                    return <User key={user._id} user={user}/>
                    })
                }
            </div>
            )
    },
    render () {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3>{this.props.team.name}</h3>
                </div>
                <div className="panel-body">
                    {this.data.users ?
                        this.renderTeamMembers()
                    :
                        null
                    }
                </div>
                <div className="panel-footer">
                    {this.data.teamMember ?
                        <UserForm teamId={this.props.team._id} />
                        :
                        null
                    }
                </div>
            </div>
        );
    }
});

TeamForm = React.createClass({
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
    },
    cancel(e){
        e.preventDefault();
        this.props.toggleTeamForm(false);
    },
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
});
