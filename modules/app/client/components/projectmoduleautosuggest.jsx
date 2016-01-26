import { Component } from 'react';
import Autosuggest from 'react-autosuggest';

export default class ProjectModuleAutosuggest extends Component {
    constructor(props) {
        super(props);
        this.onSelected = this.onSelected.bind(this);
        this.state = {
            name: props.value
        }
    }

    render() {
        const projectModuleInputAttributes = {
            className: 'form-control',
            placeholder: 'Search Modules',
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
                    suggestions={this.getProjectModuleSuggestions.bind(this)}
                    suggestionRenderer={this.renderProjectModuleSuggestion.bind(this)}
                    suggestionValue={this.renderProjectModuleSuggestionValue.bind(this)}
                    onSuggestionSelected={this.onSelected.bind(this)}
                    inputAttributes={projectModuleInputAttributes} />
            </div>
        );
    }

    getProjectModuleSuggestions(input, cb) {
        const regex = new RegExp(input, 'i');
        const projectmodules = this.props.data.filter(projectmodule => projectmodule.projectid === this.props.project).filter(projectmodule => regex.test(projectmodule.modulename));
        cb(null, projectmodules);
    }

    renderProjectModuleSuggestion(suggestion, input) {
        return (
            suggestion.modulename
        );
    }

    renderProjectModuleSuggestionValue(suggestionObj) {
        return suggestionObj.modulename;
    }

    onSelected(suggestion, event) {
        this.props.selected(suggestion, event);
    }
}
