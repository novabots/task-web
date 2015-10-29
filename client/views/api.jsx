ConnectApi = React.createClass({
    getInitialState() {
        return { showModal: true };
    },
    close() {
        this.setState({ showModal: false });
    },
    open() {
        this.setState({ showModal: true });
    },
    inputApiKey(event) {
        event.preventDefault();
        Meteor.call("setAPIKey", ReactDOM.findDOMNode(this.refs.apiKey).value.trim(), function(err, res) {
            if(res) {
                toastr.success('API Key Saved.');
            }
            if(err) {
                toastr.error('Error: API Key Not Saved.');
            }
        });
    },
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
});