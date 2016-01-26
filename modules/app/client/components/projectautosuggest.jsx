import { Component } from 'react';
import Autosuggest from 'react-autosuggest';

export default class ProjectAutosuggest extends Component {
    constructor(props) {
        super(props);
        this.onSelected = this.onSelected.bind(this);
        this.state = {
            name: props.value
        }
    }

    render() {
        const projectInputAttributes = {
            className: 'form-control',
            placeholder: 'Search Projects',
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
                    cache={false}
                    value={this.state.name}
                    className="form-control"
                    suggestions={this.getProjectSuggestions.bind(this)}
                    suggestionRenderer={this.renderProjectSuggestion.bind(this)}
                    suggestionValue={this.renderProjectSuggestionValue.bind(this)}
                    onSuggestionSelected={this.onSelected.bind(this)}
                    inputAttributes={projectInputAttributes} />
            </div>
        );
    }

    getProjectSuggestions(input, cb) {
        const regex = new RegExp(input, 'i');
        const projects = this.props.data.filter(project => project.clientid === this.props.client).filter(project => regex.test(project.name));
        cb(null, projects);
    }

    renderProjectSuggestion(suggestion, input) {
        return (
            suggestion.name
        );
    }

    renderProjectSuggestionValue(suggestionObj) {
        return suggestionObj.name;
    }

    onSelected(suggestion, event) {
        this.props.selected(suggestion, event);
    }
}
