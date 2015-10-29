var Modal = React.createClass({
    getInitialState() {
        return { showModal: false };
    },
    close() {
        this.setState({ showModal: false });
    },
    open() {
        this.setState({ showModal: true });
    },
    activeModal() {
        return Session.get("modal")
    },
    render() {

        return (
            <div>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <ModalContent component={this.activeModal} />
                </Modal>
            </div>
        );
    }
});

var ModalContent = React.createClass({
    render: function() {
        return <this.props.component>
        </this.props.component>;
    }
});