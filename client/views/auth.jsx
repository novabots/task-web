var Auth = React.createClass({
    getInitialState() {
        return { loginMode: true, loginClass: 'btn-primary', createClass: 'btn-default' };
    },
    register() {
        Accounts.createUser({
            username: React.findDOMNode(this.refs.usernameRegister).value.trim(),
            password: React.findDOMNode(this.refs.passwordRegister).value.trim(),
            emails: [
                { address: React.findDOMNode(this.refs.emailAddress).value.trim(), verified: false }]
        }, function(error) {
            if (! error) {

            } else {
                toastr.warning('Failed to create account. Reason: '+ error.reason);
            }
        });
    },
    login() {
        Meteor.loginWithPassword(
            React.findDOMNode(this.refs.usernameLogin).value.trim(),
            React.findDOMNode(this.refs.passwordLogin).value.trim(),
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
        this.setState({loginMode: true, loginClass: 'btn-primary', createClass: 'btn-default'});
    },
    createMode() {
        this.setState({loginMode: false, loginClass: 'btn-default', createClass: 'btn-primary'});
    },
    render() {
        let loginClass = this.state.loginClass;
        let createClass = this.state.createClass;
        return (
            <div>
            <Modal.Header closeButton>
                <Modal.Title>Login or Create Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="btn-group btn-group-justified">
                    <div className="btn-group">
                        <button type="button" id="loginToggle" onClick={this.loginMode} className="btn {loginClass}">Login</button>
                    </div>
                    <div className="btn-group">
                        <button type="button" id="createToggle" onClick={this.createMode} className="btn {createClass}">Create Account</button>
                    </div>
                </div>
                { this.state.loginMode ?
                    <div>
                        <hr class="divider" />
                        <div className="service-buttons">
                            <button className="google-login btn" onClick={this.googleLogin}><i className="fa fa-google-plus"></i> &nbsp;Login with Google</button>
                        </div>
                        <hr class="divider" />
                        <form id="login-form" onSubmit={this.login}>
                            <div class="form-group">
                            <label for="usernameLogin">Username</label>
                            <input type="text" className="form-control" ref="usernameLogin" placeholder="Username" />
                            </div>
                            <div class="form-group">
                            <label for="passwordLogin">Password</label>
                            <input type="password" className="form-control" ref="usernameLogin" placeholder="Password" />
                            </div>

                            <button type="submit" className="btn btn-primary">Log In</button>
                        </form>
                    </div>
                    :
                    <div>
                        <hr class="divider" />
                        <form id="create-account-form" onSubmit={this.register}>
                            <div className="form-group">
                                <label for="usernameRegister">Username</label>
                                <input type="text" className="form-control" ref="usernameRegister" placeholder="Username" />
                            </div>
                            <div class="form-group">
                                <label for="passwordRegister">Password</label>
                                <input type="password" className="form-control" ref="passwordRegister" placeholder="Password" />
                            </div>
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" className="form-control" ref="emailAddress" placeholder="name@domain.com" />
                            </div>
                            <button type="submit" class="btn btn-primary">Create Account</button>
                        </form>
                    </div>
                }
            </Modal.Body>
            </div>
        )
    }
});