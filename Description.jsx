import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export class Description extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            charactersDescription: 0,
            charactersSummary: 0,
            showEditSection: false,
            profileData: {
                summary: props.summary,
                description: props.description
            }
            
        };
        this.update = this.update.bind(this);
        this.saveData = this.saveData.bind(this)
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.summary !== this.props.summary) {
            this.setState({
                profileData: {
                    summary: nextProps.summary,
                }
            });
        }
        if (nextProps.description !== this.props.description) {
            this.setState({
                profileData: {
                    description: nextProps.description,
                }
            });
        }
        console.log(this.state.profileData.description)
    }
    update(event) {
        const data = Object.assign({}, this.state.profileData)
        data[event.target.name] = event.target.value
        this.setState({
            profileData: data
        })
        console.log(this.state.profileData)
        if (event.target.name === "description") {
            let description = event.target.value;
            this.setState({
                charactersDescription: description.length
            })
        }
        if (event.target.name === "summary") {
            let summary = event.target.value
            this.setState({
                charactersSummary: summary.length
            })
        }
    }
    saveData() {
        this.props.updateStateData(this.state.profileData);
        this.closeEdit()
    }
    openEdit() {
        const details = Object.assign({}, { summary: this.props.summary, description : this.props.description })
        this.setState({
            showEditSection: true,
            profileData: details
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }
    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }
    renderDisplay() {
        const characterLimitDescription = 600;
        const characterLimitSummary = 150
        let charactersDescription = this.props.description ? this.props.description.length : 0;
        let charactersSummary = this.props.summary ? this.props.summary.length : 0;
        return (
            <React.Fragment>
                <div className="four wide column">
                    <h3>Summary</h3>
                    <div className="tooltip">Write a summary of about yourself.</div>
                </div>
                <div className="twelve wide column">
                    <div className="field" >
                        <p>{this.props.summary}</p>
                    </div>
                </div>
                <div className="four wide column">
                    <h3>Description</h3>
                    <div className="tooltip">Write a description of your company.</div>
                </div>
                <div className="twelve wide column">
                    <div className="field" >
                        <p>{this.props.description}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="sixteen wide column">
                        <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    renderEdit() {
        const characterLimitDescription = 600;
        const characterLimitSummary = 150
        let charactersDescription = this.props.description ? this.props.description.length : 0;
        let charactersSummary = this.props.summary ? this.props.summary.length : 0;

        return (
            <React.Fragment>
                <div className="four wide column">
                    <h3>Summary</h3>
                    <div className="tooltip">Write a summary of about yourself.</div>
                </div>
                <div className="twelve wide column">
                    <div className="field" >
                        <textarea maxLength={characterLimitSummary} style={{height:"30px"}} name="summary" placeholder="Write a description of yourself." value={this.state.profileData.summary} onChange={this.update} ></textarea>
                    </div>
                    <p>Characters : {charactersSummary} / {characterLimitSummary}</p>
                </div>
                <div className="four wide column">
                    <h3>Description</h3>
                    <div className="tooltip">Write a description of your company.</div>
                </div>
                <div className="twelve wide column">
                    <div className="field" >
                        <textarea maxLength={characterLimitDescription} name="description" placeholder="Please tell us about any hobbies, additional expertise, or anything else you’d like to add." value={this.state.profileData.description} onChange={this.update} ></textarea>
                    </div>
                    <p>Characters : {charactersDescription} / {characterLimitDescription}</p>
                </div>
                <div className="row">
                    <div className="sixteen wide column">
                        <button type="button" className="ui right floated teal button" onClick={this.saveData}>Save</button>
                        <button type="button" className="ui right floated button" onClick={this.closeEdit}>Cancel</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}