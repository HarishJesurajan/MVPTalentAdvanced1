/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

import { Popup } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditSection: false,
            newContact: props.linkedAccount
        }
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.redirectToPage = this.redirectToPage.bind(this)
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        nextProps.linkedAccount !== this.props.linkedAccount
        this.setState({ newContact: nextProps.linkedAccount });
    }
    redirectToPage(accountUrl) {
        if (accountUrl === "") {
            TalentUtil.notification.show("Please add your profile", "fail", null, null)
        }
        else {
            window.location.href = accountUrl
        }
        
    }
    //loadData() {
    //    this.setState({
    //        newContact: this.props.linkedAccounts
    //    })
    //}

    openEdit() {
        const details = Object.assign({}, this.state.newContact)
        this.setState({
            showEditSection: true,
            newContact: details
        })
        console.log(this.state.newContact.linkedIn)
        console.log(this.state.newContact.github)
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    saveContact() {
        const data = Object.assign({}, { linkedAccounts: this.state.newContact })
        this.props.saveProfileData(data)
        this.closeEdit()
    }
    //handleChange(event) {
    //    const data = Object.assign({}, this.state.newContact.linkedAccounts)
    //    data[event.target.name] = event.target.value
    //    this.props.updateProfileData({ linkedAccounts: data })
    //    this.setState({
    //        newContact: {
    //            linkedAccounts: data
    //        }
    //    })
    //}
    handleChange(event) {
        const data = Object.assign({}, this.state.newContact)
        data[event.target.name] = event.target.value
        this.props.updateProfileData({ linkedAccounts:data})
        this.setState({
            newContact: data
        })
    }

render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )

    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="Linkedin"
                    name="linkedIn"
                    value={this.state.newContact.linkedIn}
                    controlFunc={this.handleChange}
                    maxLength={100}
                    placeholder="Enter your Linkedin Url"
                    errorMessage="Please enter a valid Linkedin Url"
                />
                <ChildSingleInput
                    inputType="text"
                    label="Github"
                    name="github"
                    value={this.state.newContact.github}
                    controlFunc={this.handleChange}
                    maxLength={100}
                    placeholder="Enter your GitHub Url"
                    errorMessage="Please enter a valid GitHub Url"
                />
                <button type="button" className="ui teal button" onClick={this.saveContact}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {
        let LinkedIn = this.state.newContact.linkedIn
        let Github = this.state.newContact.github
        
     return (
         <div className='row'>
            <div className="ui sixteen wide column">
             <React.Fragment>
                     <button type="button" className="ui left floated blue button" style={{ width: "200px", color:"white", margin :"3px", marginLeft:"6px" } } onClick={() => this.redirectToPage(LinkedIn)}>Linkedin</button>
                     <button type="button" className="ui left floated black button" style={{ width: "200px", color: "white", margin: "3px" }} onClick={() => this.redirectToPage(Github)}>GitHub</button>
             </React.Fragment>
             <button className="ui right floated teal button ml-auto" style={{ color: "white", margin: "3px" }} onClick={this.openEdit}>Edit</button>
             </div>
         </div>
        )
    }
}