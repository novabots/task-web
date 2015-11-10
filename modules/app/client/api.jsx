import { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';

export class ConnectApi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: true
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.inputApiKey = this.inputApiKey.bind(this);

    }
    close() {
        this.setState({ showModal: false });
    }
    open() {
        this.setState({ showModal: true });
    }
    inputApiKey(event) {
        event.preventDefault();
        let apikey = this.refs.apiKey.value.trim();
        Meteor.call("setAPIKey", apikey, function(err, res) {
            if(res) {
                toastr.success('API Key Saved.');
            }
            if(err) {
                toastr.error('Error: API Key Not Saved.');
            }
        });
    }
    render() {
        return (
            <div>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Input API Key</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <form id="api-key-form" onSubmit={this.inputApiKey}>
                        <div className="form-group">
                            <label for="api-key">Retrieve API Key from MyIntervals Account</label>
                            <input type="text" id="api-key" className="form-control" ref="apiKey" placeholder="API Key" />
                        </div>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

function handleApiResponse(err, res, collection) {
    if (res.data.status === "OK") {
        toastr.success(`${collection} updated!`);
    } else {
        toastr.warning(err);
        console.log(err);
    }
}

export class RefreshData extends Component{
    constructor(props) {
        super(props);
        this.refreshData = this.refreshData.bind(this);
    }
    render() {
        return (
            <li><a className="btn btn-default" onClick={this.refreshData}>refresh</a></li>
        );
    }
    refreshData() {
        try {
            Meteor.call("getClients", function (err, res) {
                handleApiResponse(err, res, "Clients");
            });
            Meteor.call("getProjects", function (err, res) {
                handleApiResponse(err, res, "Projects");
            });
            Meteor.call("getProjectModules", function (err, res) {
                handleApiResponse(err, res, "Modules");
            });
            Meteor.call("getProjectWorkTypes", function (err, res) {
                handleApiResponse(err, res, "Work Types");
            });
            Meteor.call("getPersons", function (err, res) {
                handleApiResponse(err, res, "People");
            });
        } catch(e) {
            toastr.error(e);
        }
    }
}