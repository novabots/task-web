Auth = React.createClass({
    getInitialState() {
        return { showModal: true, loginMode: true, loginClass: 'btn btn-primary', createClass: 'btn btn-default' };
    },
    close() {
        this.setState({ showModal: false });
    },
    open() {
        this.setState({ showModal: true });
    },
    register(event) {
        event.preventDefault();
        Accounts.createUser({
            username: ReactDOM.findDOMNode(this.refs.usernameRegister).value.trim(),
            password: ReactDOM.findDOMNode(this.refs.passwordRegister).value.trim(),
            emails: [
                { address: ReactDOM.findDOMNode(this.refs.emailAddress).value.trim(), verified: false }]
        }, function(error) {
            if (! error) {

            } else {
                toastr.warning('Failed to create account. Reason: '+ error.reason);
            }
        });
    },
    login(event) {
        event.preventDefault();
        Meteor.loginWithPassword(
            ReactDOM.findDOMNode(this.refs.usernameLogin).value.trim(),
            ReactDOM.findDOMNode(this.refs.passwordLogin).value.trim(),
            function(error) {
                if (! error) {
                    Session.set("modal", false);
                } else {
                    toastr.warning("There was a problem logging in. Try again.");
                }
            }
        );
    },
    googleLogin() {
        Meteor.loginWithGoogle(function(error){
            if(! error){

            } else {
                toastr.warning('Failed to authenticate. Reason: '+ error.reason);
            }

        });
    },
    loginMode() {
        this.setState({loginMode: true, loginClass: 'btn btn-primary', createClass: 'btn btn-default'});
    },
    createMode() {
        this.setState({loginMode: false, loginClass: 'btn btn-default', createClass: 'btn btn-primary'});
    },
    render() {
        let loginClass = this.state.loginClass;
        let createClass = this.state.createClass;
        return (
            <div>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Login or Create Account</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="btn-group btn-group-justified">
                            <div className="btn-group">
                                <button type="button" id="loginToggle" onClick={this.loginMode} className={loginClass}>Login</button>
                            </div>
                            <div className="btn-group">
                                <button type="button" id="createToggle" onClick={this.createMode} className={createClass}>Create Account</button>
                            </div>
                        </div>
                        { this.state.loginMode ?
                            <div>
                                <hr className="divider" />
                                <div className="service-buttons">
                                    <button className="google-login btn" onClick={this.googleLogin}><i className="fa fa-google-plus"></i> &nbsp;Login with Google</button>
                                </div>
                                <hr className="divider" />
                                <form id="login-form" onSubmit={this.login}>
                                    <div className="form-group">
                                    <label htmlFor="usernameLogin">Username</label>
                                    <input type="text" className="form-control" ref="usernameLogin" placeholder="Username" />
                                    </div>
                                    <div className="form-group">
                                    <label htmlFor="passwordLogin">Password</label>
                                    <input type="password" className="form-control" ref="passwordLogin" placeholder="Password" />
                                    </div>

                                    <button type="submit" className="btn btn-primary">Log In</button>
                                </form>
                            </div>
                            :
                            <div>
                                <hr className="divider" />
                                <form id="create-account-form" onSubmit={this.register}>
                                    <div className="form-group">
                                        <label htmlFor="usernameRegister">Username</label>
                                        <input type="text" className="form-control" ref="usernameRegister" placeholder="Username" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="passwordRegister">Password</label>
                                        <input type="password" className="form-control" ref="passwordRegister" placeholder="Password" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input type="email" className="form-control" ref="emailAddress" placeholder="name@domain.com" />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Create Account</button>
                                </form>
                            </div>
                        }
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
});
