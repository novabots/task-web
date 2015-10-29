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
    getInitialState() {
        return { "creatingOrg" : false };
    },
    render () {
        return (
            <div>
            { this.state.creatingOrg ?
            <form id="create-org-form" onSubmit={this.handleSubmit}>
                <div className="form-group col-sm-4">
                    <input type="text" className="form-control big-input" ref="orgName" id="orgName" placeholder="Organization Name" />
                    <button type="button" className="btn btn-primary" ref="cancel" onClick={this.handleCancel}>Cancel <i className="fa fa-close"></i></button>
                </div>
            </form> : <div className="btn-group btn-group-lg">
                        <button className="btn btn-primary" id="create-org-button" onClick={this.handleClick}>Create Organisation <i className="fa fa-plus"></i></button>

                    </div>
            }
            </div>
        );
    },
    handleClick() {
        this.setState({ "creatingOrg" : true });
    },
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
    },
    handleCancel(evt) {
        this.setState({"creatingOrg": false});
    }
});
