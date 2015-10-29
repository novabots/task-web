TeamList = React.createClass({
    render () {
        return (
            <div id="org" class="well well-lg">
                <h1>{{name}}</h1>
                { this.state.teamsExist === _id ?
                    <div><TeamList />
                    <TeamForm /></div>
                    :
                    <TeamForm />
                }
            </div>
        );
    }
});

Team = React.createClass({
    render () {
        return (
            <div></div>
        );
    }
});

TeamForm = React.createClass({
    render () {
        return (
            <div></div>
        );
    }
});
