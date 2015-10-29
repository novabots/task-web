Meteor.startup(() => {
    Session.set("creatingOrg", false);
    Session.set("creatingTeam", false);
    let user = Meteor.user();
    if ( user ) {
        if ( user.profile.apikey === "" ) {
            React.render(<AppModal component={ConnectApi} />, document.getElementById('render-element'));
        } else {
            React.render(<App />, document.getElementById('render-element'));
        }
        React.render(<App />, document.getElementById('render-element'));
    } else {
        React.render(<AppModal component={Auth} />, document.getElementById('render-element'));
    }
});

var ConnectApi = React.createClass({
    render() {
        return (
            <div>
                <div className="mask"> </div>
                <div className="modal fade in wide-modal" id="apiDialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Input API Key</h3>
                            </div>
                            <div className="modal-body">
                                <form id="api-key-form">
                                    <div className="form-group">
                                        <label for="api-key">Retrieve API Key from MyIntervals Account</label>
                                        <input type="text" id="api-key" className="form-control" placeholder="API Key" />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Save</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

Template.sidebar.helpers({
    statusClass: () => Session.get("sidebarOpen") ? "sidebar-open" : "sidebar-closed"
});
