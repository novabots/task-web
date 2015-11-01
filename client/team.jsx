Team = React.createClass({
    setInitialState() {
        return {teamMember: function() {
            let user = Meteor.user();
            return user.teams.indexOf(this.props._id) != -1;
        }};
    },
    renderTeamMembers() {

    },
    render () {
        return (
            <div id="team" className="panel panel-default">
                <div className="panel-heading">
                    <h3>{this.props.team.name}</h3>
                </div>
                <div className="panel-body">
                    {this.renderTeamMembers}
                </div>
                <div className="panel-footer">
                    {this.state.teamMember ?
                        <UserForm teamId={this.props._id} />
                        :
                        <div></div>
                    }
                </div>
            </div>
        );
    }
});

TeamForm = React.createClass({
    createTeam(e) {
        e.preventDefault();
        Meteor.call("createTeam", this.refs.teamName.value, this.props.orgId, function(err, res) {
            if(res) {
                toastr.success('Team created.');
                this.props.toggleTeamForm(false);
            }
            if(err) {
                toastr.error('Error: Team not created.');
            }
        });
    },
    render () {
        return (
            <form id="create-team-form" onSubmit={this.createTeam}>
                <div className="form-group col-sm-4">
                    <input type="text" className="form-control big-input" ref="teamName" id="teamName" placeholder="Team Name" />
                </div>
            </form>
        );
    }
});
