import { Component } from 'react';

export default class UserButton extends Component {
    getInitialState() {
        return { selected: null, user: Meteor.user()}
    }
    selectUser() {
        this.props.toggleSidebar();
        Session.set("userSelected", this.state.selected === this.state.user._id ? this.state.user._id : null );
        if(! Session.get("sidebarOpen")){
            Session.set("sidebarOpen", true);
        } else {
            Session.set("sidebarOpen", false);
        }
        this.setState({selected: this.state.selected === this.state.user._id ? null : this.state.user._id });
    }
    render() {
        const buttonClass = this.state.selected === this.state.user._id ? 'btn btn-primary' : 'btn btn-default';
        const username = this.state.user.username;
        return (
            <li><a className={buttonClass} onClick={this.selectUser}>{username}</a></li>
        )
    }
};