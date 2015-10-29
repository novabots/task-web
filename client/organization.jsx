OrganizationList = React.createClass({
    mixins: [ReactMeteorData],
    userId: Meteor.userId(),
    getMeteorData() {
        return {
            organizations: Organizations.find().fetch()
        }
    },
    renderOrganizations() {
        return this.data.organizations.map((organization) => {
            return <Organization key={organization._id} organization={organization} />;
        });
    },
    render() {
        return (
            <div id="org" className="well well-lg">{this.renderOrganizations()}</div>
        );
    }
});

Organization = React.createClass({
    render() {
        return (
            <div>{this.props.organization.name}</div>
        );
    }
});

OrganizationForm = React.createClass({
    render () {
        return (
            <div>
            { this.state.creatingOrg ?
            <form id="create-org-form">
                <div class="form-group col-sm-4">
                    <input type="text" class="form-control big-input" id="orgName" placeholder="Organization Name" />
                </div>
            </form> : <div class="btn-group btn-group-lg">
                        <button class="btn btn-primary" id="create-org-button">Create Organisation <i class="fa fa-plus"></i></button>
                    </div>
            }
            </div>
        );
    }
});
