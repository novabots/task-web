import { Component } from 'react';
import Autosuggest from 'react-autosuggest';

export default class PersonAutosuggest extends Component {
    constructor(props) {
        super(props);
        this.onSelected = this.onSelected.bind(this);
        this.state = {
            name: props.value
        }
    }

    render() {
        const personInputAttributes = {
            className: 'form-control',
            placeholder: 'Search People',
            type: 'search',
            onChange: (val) => {
                this.setState({name: val});
            }
        };
        return(
            <Autosuggest
                value={this.state.name}
                className="form-control"
                suggestions={this.getPersonSuggestions.bind(this)}
                suggestionRenderer={this.renderPersonSuggestion.bind(this)}
                suggestionValue={this.renderPersonSuggestionValue.bind(this)}
                onSuggestionSelected={this.onSelected.bind(this)}
                inputAttributes={personInputAttributes} />
        );
    }

    getPersonSuggestions(input, cb) {
        const regex = new RegExp(input, 'i');
        const persons = this.props.data.filter(person => regex.test(person.firstname + " " + person.lastname));
        cb(null, persons);
    }

    renderPersonSuggestion(suggestion, input) {
        return (
            suggestion.firstname + " " + suggestion.lastname
        );
    }

    renderPersonSuggestionValue(suggestionObj) {
        return suggestionObj.firstname + " " + suggestionObj.lastname;
    }

    onSelected(suggestion, event) {
        this.props.selected(suggestion, event);
    }
}
