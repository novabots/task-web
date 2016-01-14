import { Component } from 'react';
import Autosuggest from 'react-autosuggest';

export default class ClientAutosuggest extends Component {
    constructor(props) {
        super(props);
        this.onSelected = this.onSelected.bind(this);
        this.state = {
            name: props.value
        }
    }

    render() {
        const clientInputAttributes = {
            className: 'form-control',
            placeholder: 'Search Clients',
            type: 'search',
            onChange: (val) => {
                this.setState({name: val});
            }
        };
        return(
            <div className="form-group">
                {this.props.label ?
                    <label className="control-label"><span>{this.props.label}</span></label>
                    :
                    null
                }
                <Autosuggest
                    value={this.state.name}
                    className="form-control"
                    suggestions={this.getClientSuggestions.bind(this)}
                    suggestionRenderer={this.renderClientSuggestion.bind(this)}
                    suggestionValue={this.renderClientSuggestionValue.bind(this)}
                    onSuggestionSelected={this.onSelected.bind(this)}
                    inputAttributes={clientInputAttributes} />
            </div>
        );
    }

    getClientSuggestions(input, cb) {
        const regex = new RegExp(input, 'i');
        const clients = this.props.data.filter(client => regex.test(client.name));
        cb(null, clients);
    }

    renderClientSuggestion(suggestion, input) {
        return (
            suggestion.name
        );
    }

    renderClientSuggestionValue(suggestionObj) {
        return suggestionObj.name;
    }

    onSelected(suggestion, event) {
        if (this.props.selected)
            this.props.selected(suggestion, event);
    }
}
