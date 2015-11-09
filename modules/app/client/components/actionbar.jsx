import { Component } from 'react';
import UserButton from './userbutton';
import LogoutButton from './logoutbutton';
import { RefreshData } from '../api';

export class ActionBar extends Component {
    render() {
        return (
            <div id="header">
                <ul className="nav nav-pills pull-right">
                    <UserButton toggleSidebar={this.props.toggleSidebar} />
                    <RefreshData />
                    <LogoutButton setLoggedIn={this.props.setLoggedIn}/>
                </ul>
            </div>
        );
    }
};