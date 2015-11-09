import { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import { Auth } from './components/auth';
import { MainLayout } from './mainlayout.jsx';

@ReactMixin.decorate(ReactMeteorData)
export default class App extends Component {
    getMeteorData() {
        return {
            user: Meteor.user(), authenticating: Meteor.loggingIn()
        };
    }
    componentWillMount() {
        require('./style.less');
    }
    state = {
        loggedIn: Meteor.user()
    };
    loggedIn() {
        return this.state.loggedIn();
    }
    setLoggedIn(state) {
        this.setState({loggedIn: state});
    }
    renderAuth(){
        return (
            <div>
                {this.data.authenticating ?
                    <div className="loading-indicator"><i className="fa fa-circle-o-notch fa-spin"></i></div>
                :
                    <Auth setLoggedIn={this.setLoggedIn}/>
                }
            </div>
        );
    }
    render() {
        return (
            <div>
                {this.data.user ?
                    <MainLayout setLoggedIn={this.setLoggedIn} />
                    :
                    this.renderAuth()
                }
            </div>
        );
    }
};