/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx';
import { Table } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export default class Experience extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditSection: false,
            editIndex: 0,
            showAddSection: false,
            listExperience: {
                experience: this.props.experienceData
            },
            experienceData: {
                id: "0",
                company: "",
                position: "",
                responsibilities: "",
                start: "",
                end: ""
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.saveContact = this.saveContact.bind(this)
        this.handleEditData = this.handleEditData.bind(this)
        this.handleDeleteData = this.handleDeleteData.bind(this)
        this.showAddMenu = this.showAddMenu.bind(this)
        this.hideAddMenu = this.hideAddMenu.bind(this)
        this.hideEditMenu = this.hideEditMenu.bind(this)
        this.handleChangeEdit = this.handleChangeEdit.bind(this)
        this.deleteExperience = this.deleteExperience.bind(this)
    }
    showAddMenu() {
        this.setState({
            experienceData: {
                id: "0",
                company: "",
                position: "",
                responsibilities: "",
                start: "",
                end: ""
            },
            showAddSection: true,
            showEditSection: false
        })
    }
    hideAddMenu() {
        this.setState({
            showAddSection: false
        })
    }
    handleChange(event) {
        const data = Object.assign({}, this.state.experienceData)
        data[event.target.name] = event.target.value
        this.setState({
            experienceData: data,
        }, () => this.setState({
            listExperience: {
                experience: [{
                    id: "0",
                    company: this.state.experienceData.company,
                    position: this.state.experienceData.position,
                    responsibilities: this.state.experienceData.responsibilities,
                    start: this.state.experienceData.start,
                    end: this.state.experienceData.end
                }]
            }
        }))
    }
    handleChangeEdit(id, name, value) {
        const data = Object.assign({}, this.state.experienceData)
        data[name] = value
        data["id"] = id
        this.setState({
            experienceData: data,
        }, () => this.setState({
            listExperience: {
                experience: [{
                    id: this.state.experienceData.id,
                    company: this.state.experienceData.company,
                    position: this.state.experienceData.position,
                    responsibilities: this.state.experienceData.responsibilities,
                    start: this.state.experienceData.start,
                    end: this.state.experienceData.end
                }]
            }
        }))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.experienceData !== this.props.experienceData) {
            this.setState({
                listExperience: {
                    experience: nextProps.experienceData
                }
            });
        }
    }
    saveContact(id) {
        this.setState({
            showAddSection: false,
            showEditSection: false,
        })
        const data1 = Object.assign({}, this.state.listExperience)
        this.props.updateProfileData(data1)
    }
    handleEditData(id, index, company, position, responsibilities, start, end) {
        this.setState({
            editIndex: index,
            showAddSection: false,
            experienceData: {
                company: company,
                position: position,
                responsibilities: responsibilities,
                start: start,
                end: end
            },
            showEditSection: true,
        })

    }
    hideEditMenu() {
        this.setState({
            showEditSection: false,
        })
    }
    handleDeleteData(id) {
        this.deleteExperience(id)
    }

    deleteExperience(id) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://talentservicesprofileadvanced1.azurewebsites.net/profile/profile/DeleteExperience',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(id),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show("Profile updated sucessfully", "success", null, null)
                    this.setState({
                        listExperience: {
                            experience: res.data.experience
                        }
                    })
                    this.props.updateWithoutSave(this.state.listExperience)
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }

            }.bind(this),
            error: function (res, a, b) {
            }
        })
    }

    render() {
        let addSection = this.state.showAddSection ?
            <React.Fragment>
            <div className="row">
                <div className='eight wide column'>
                <ChildSingleInput
                    inputType="text"
                    name="company"
                    value={this.state.experienceData.company}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Company"
                    errorMessage="Please enter a valid Company name"
                />
                </div>
                <div className='eight wide column'>
                        <ChildSingleInput
                            inputType="text"
                            name="position"
                            value={this.state.experienceData.position}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Position"
                            errorMessage="Please enter a valid position"
                        />
                </div>
                </div >
                <div className="row">
                    <div className='eight wide column'>
                        <ChildSingleInput
                            inputType="date"
                            name="start"
                            value={this.state.experienceData.start}
                            controlFunc={this.handleChange}
                            placeholder="Start Date"
                            errorMessage="Please enter a valid date"
                        />
                    </div>
                    <div className='eight wide column'>
                        <ChildSingleInput
                            inputType="date"
                            name="end"
                            value={this.state.experienceData.end}
                            controlFunc={this.handleChange}
                            placeholder="End date"
                            errorMessage="Please enter a valid date"
                        />
                    </div>
                </div >
                <div className="row">
                    <div className='sixteen wide column'>
                        <ChildSingleInput
                            inputType="text"
                            name="responsibilities"
                            value={this.state.experienceData.responsibilities}
                            controlFunc={this.handleChange}
                            placeholder="Responsibilities"
                            errorMessage="Please enter valid responsibilities"
                        />
                    </div>
                </div >
            <div className='four wide column'>
                <button type="button" className="ui right floated button" onClick={this.hideAddMenu}>Cancel</button>
                <button type="button" className="ui right floated teal button" onClick={this.saveContact}>Add</button>
            </div >
            </React.Fragment>
                : <div></div>

        return (

            <React.Fragment>
                {addSection}
                <div className='ui sixteen wide column'>
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Company</Table.HeaderCell>
                                <Table.HeaderCell>Position</Table.HeaderCell>
                                <Table.HeaderCell>Responsibilities</Table.HeaderCell>
                                <Table.HeaderCell>Start</Table.HeaderCell>
                                <Table.HeaderCell>End</Table.HeaderCell>
                                <Table.HeaderCell><button type="button" className="ui right floated teal button" onClick={this.showAddMenu}><FontAwesomeIcon icon={faPlus} /> Add New</button></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.props.experienceData.map((experience, index) =>
                                <Table.Row key={index}>
                                    {(this.state.showEditSection && this.state.editIndex == index) ?
                                        <React.Fragment>
                                            <Table.Cell>
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        name="company"
                                                        value={this.state.experienceData.company}
                                                        controlFunc={(event) => this.handleChangeEdit(experience.id, event.target.name, event.target.value)}
                                                        maxLength={80}
                                                        placeholder="Company"
                                                        errorMessage="Please enter a valid Company name"
                                                    />                            
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        name="position"
                                                        value={this.state.experienceData.position}
                                                        controlFunc={(event) => this.handleChangeEdit(experience.id, event.target.name, event.target.value)}
                                                        maxLength={80}
                                                        placeholder="Position"
                                                        errorMessage="Please enter a valid position"
                                                    />
                                            </Table.Cell>
                                            <Table.Cell>
                                                    <ChildSingleInput
                                                        inputType="date"
                                                        name="start"
                                                        value={(this.state.experienceData.start == null) ? this.state.experienceData.start: new Date(this.state.experienceData.start).toISOString().split('T')[0]}
                                                        controlFunc={(event) => this.handleChangeEdit(experience.id, event.target.name, event.target.value)}
                                                        placeholder="Start Date"
                                                        errorMessage="Please enter a valid date"
                                                    />
                                                <div className='ui eight wide column'>
                                                    <ChildSingleInput
                                                        inputType="date"
                                                        name="end"
                                                        value={(this.state.experienceData.end == null) ? this.state.experienceData.end : new Date(this.state.experienceData.end).toISOString().split('T')[0]}
                                                        controlFunc={(event) => this.handleChangeEdit(experience.id, event.target.name, event.target.value)}
                                                        placeholder="End date"
                                                        errorMessage="Please enter a valid date"
                                                    />
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell colSpan="2">
                                                <div className='ui sixteen wide column'>
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        name="responsibilities"
                                                        value={this.state.experienceData.responsibilities}
                                                        controlFunc={(event) => this.handleChangeEdit(experience.id, event.target.name, event.target.value)}
                                                        placeholder="Responsibilities"
                                                        errorMessage="Please enter valid responsibilities"
                                                    />
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell colSpan="2">
                                            <div className='ui four wide column'>
                                                <button type="button" className="ui right floated button" onClick={this.hideEditMenu}>cancel</button>
                                                <button type="button" className="ui right floated red button" onClick={() => this.saveContact(experience.id)}>Update</button> 
                                                </div >
                                            </Table.Cell>
                                        </React.Fragment > :
                                        <React.Fragment>
                                            <Table.Cell>{experience.company}</Table.Cell>
                                            <Table.Cell>{experience.position}</Table.Cell>
                                            <Table.Cell>{experience.responsibilities}</Table.Cell>
                                            <Table.Cell>{new Date(experience.start).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}</Table.Cell>
                                            <Table.Cell>{new Date(experience.end).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}</Table.Cell>
                                            <Table.Cell>
                                                <button type="button" className="ui right floated button" onClick={() => this.handleDeleteData(experience.id)}><FontAwesomeIcon icon={faTrash} style={{ Color: 'red' }} /></button>
                                                <button type="button" className="ui right floated teal button" onClick={() => this.handleEditData(experience.id, index, experience.company, experience.position, experience.responsibilities, experience.start, experience.end)}><FontAwesomeIcon icon={faPenToSquare} style={{ Color: 'black' }} /></button>
                                            </Table.Cell>
                                        </React.Fragment >
                                    }
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div >
            </React.Fragment >
        )
    }
}
