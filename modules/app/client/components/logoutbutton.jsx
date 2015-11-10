import { Component } from 'react';

export default class LogoutButton extends Component {
    constructor(props){
        super(props);
        this.logoutUser = this.logoutUser.bind(this);
    }
    logoutUser() {
        Meteor.logout();
        this.props.setLoggedIn(false);
    }
    render() {
        return (
            <li><a className="btn btn-default" onClick={this.logoutUser}>Logout <i className="fa fa-sign-out"></i></a></li>
        );
    }
};
