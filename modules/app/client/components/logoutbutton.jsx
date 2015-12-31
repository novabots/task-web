import { Component } from 'react';

export default class LogoutButton extends Component {
    constructor(props){
        super(props);
        this.logoutUser = this.logoutUser.bind(this);
    }

    logoutUser() {
        this.props.setLoggedIn(false);
        Meteor.logout();
    }

    render() {
        return (
            <li><a className="btn btn-default" onClick={this.logoutUser}>Logout <i className="fa fa-sign-out"></i></a></li>
        );
    }
};
