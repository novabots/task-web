import { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import ReactMixin from 'react-mixin';
import ProjectWorkTypes from 'app/collections/ProjectWorkTypes';

@ReactMixin.decorate(ReactMeteorData)
export default class ProjectWorkTypeAutosuggest extends Component {
    constructor(props) {
        super(props);
        this.onSelected = this.onSelected.bind(this);
        this.state = {
            name: props.value
        }
    }

    getMeteorData() {
        const projectworktypes = Meteor.subscribe("projectworktypes", this.props.project);

        const data = {};

        if(projectworktypes.ready()) {
            data.projectworktypes = ProjectWorkTypes.find().fetch();
        }
        return data;
    }

    render() {
        const projectWorkTypeInputAttributes = {
            className: 'form-control',
            placeholder: 'Search Work Types',
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
                    defaultValue={this.props.task ? this.props.task.projectWorkTypeName : null}
                    className="form-control"
                    suggestions={this.getProjectWorkTypeSuggestions.bind(this)}
                    suggestionRenderer={this.renderProjectWorkTypeSuggestion.bind(this)}
                    suggestionValue={this.renderProjectWorkTypeSuggestionValue.bind(this)}
                    onSuggestionSelected={this.onSelected.bind(this)}
                    inputAttributes={projectWorkTypeInputAttributes} />
            </div>
        );
    }

    getProjectWorkTypeSuggestions(input, cb) {
        const regex = new RegExp(input, 'i');
        const projectworktypes = this.data.projectworktypes.filter(projectWorkType => projectWorkType.projectid === this.props.project ).filter(projectworktype => regex.test(projectworktype.worktype));
        cb(null, projectworktypes);
    }

    renderProjectWorkTypeSuggestion(suggestion, input) {
        return (
            suggestion.worktype
        );
    }

    renderProjectWorkTypeSuggestionValue(suggestionObj) {
        return suggestionObj.worktype;
    }

    onSelected(suggestion, event) {
        this.props.selected(suggestion, event);
    }
}
