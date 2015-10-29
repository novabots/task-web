AppModal = React.createClass({
    getInitialState() {
        return { showModal: true };
    },
    close() {
        this.setState({ showModal: false });
    },
    open() {
        this.setState({ showModal: true });
    },
    renderModalContent: function() {
        return <this.props.component>
        </this.props.component>;
    },
    render() {
        return (
            <div>
                <Modal show={this.state.showModal} onHide={this.close}>
                    {this.renderModalContent}
                </Modal>
            </div>
        );
    }
});