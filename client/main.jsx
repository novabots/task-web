Meteor.startup(() => {
    Session.set("creatingOrg", false);
    Session.set("creatingTeam", false);
    ReactDOM.render(<App />, document.getElementById('render-element'));
});
