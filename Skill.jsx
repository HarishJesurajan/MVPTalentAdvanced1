/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx';
import { Table } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
export default class Skill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditSection: false,
            editIndex: 0,
            showAddSection: false,
            listSkills: {
                skills: this.props.skillData
            },
            skillData: {
                id: "",
                skill: "",
                experiencelevel: ""
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
    }
    showAddMenu() {
        this.setState({
            skillData: {
                id: "",
                skill: "",
                experiencelevel: ""
            },
            showAddSection: true
        })
    }
    hideAddMenu() {
        this.setState({
            showAddSection: false
        })
    }
    handleChange(event) {
        const data = Object.assign({}, this.state.skillData)
        data[event.target.name] = event.target.value
        this.setState({
            skillData: data,
        }, () => this.setState({
            listSkill: {
                skills: [{
                    id: "0",
                    name: this.state.skillData.skill,
                    level: this.state.skillData.experiencelevel
                }]
            }
        }))
    }
    handleChangeEdit(id, name, value) {
        const data = Object.assign({}, this.state.skillData)
        data[name] = value
        data["id"] = id
        this.setState({
            skillData: data,
        }, () => this.setState({
            listSkill: {
                skills: [{
                    id: this.state.skillData.id,
                    name: this.state.skillData.skill,
                    level: this.state.skillData.experiencelevel
                }]
            }
        }))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.skillData !== this.props.skillData) {
            this.setState({
                listSkill: {
                    skills: nextProps.skillData
                }
            });
        }
    }
    saveContact(id) {
        this.setState({
            showAddSection: false,
            showEditSection: false,
        })
        const data1 = Object.assign({}, this.state.listSkill)
        this.props.updateProfileData(data1)
    }
    handleEditData(id, index, skill, experiencelevel) {
        this.setState({
            editIndex: index,
            showAddSection: false,
            skillData: {
                skill: skill,
                experiencelevel: experiencelevel
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
        this.deleteSkill(id)
    }

    deleteSkill(id) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://talentservicesprofileadvanced1.azurewebsites.net/profile/profile/DeleteSkill',
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
                        listSkill: {
                            skills: res.data.skills
                        }
                    })
                    this.props.updateWithoutSave(this.state.listSkill)
                    console.log(this.state.profileData)
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }

            }.bind(this),
            error: function (res, a, b) {
            }
        })
    }

    render() {
        const skillLevels = ["Beginner", "Intermediate", "Expert"];

        const skilllevel = Object.keys(skillLevels).map(skill => ({
            value: skillLevels[skill],
        }));
        let addSection = this.state.showAddSection ? <div className="row">
            <div className='six wide column'>
                <ChildSingleInput
                    inputType="text"
                    name="skill"
                    value={this.state.skillData.skill}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Add Skill"
                    errorMessage="Please enter a valid Skill"
                />
            </div>
            <div className='six wide column'>
                <Select
                    name="experiencelevel"
                    selectedOption={this.state.skillData.experiencelevel}
                    controlFunc={this.handleChange}
                    options={skilllevel}
                    placeholder="Experience Level"
                />
            </div >
            <div className='four wide column'>
                <button type="button" className="ui right floated button" onClick={this.hideAddMenu}>Cancel</button>
                <button type="button" className="ui right floated teal button" onClick={this.saveContact}>Add</button>
            </div >
        </div > : <div></div>

        return (

            <React.Fragment>
                {addSection}
                <div className='ui sixteen wide column'>
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Skill</Table.HeaderCell>
                                <Table.HeaderCell>Level</Table.HeaderCell>
                                <Table.HeaderCell><button type="button" className="ui right floated teal button" onClick={this.showAddMenu}><FontAwesomeIcon icon={faPlus} /> Add New</button></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.props.skillData.map((skill, index) =>
                                <Table.Row key={index}>
                                    {(this.state.showEditSection && this.state.editIndex == index) ?
                                        <React.Fragment>
                                            <Table.Cell>
                                                <ChildSingleInput
                                                    inputType="text"
                                                    name="skill"
                                                    value={this.state.skillData.skill}
                                                    controlFunc={(event) => this.handleChangeEdit(skill.id, event.target.name, event.target.value)}
                                                    maxLength={80}
                                                    placeholder="Add Skill"
                                                    errorMessage="Please enter a valid Skill"
                                                />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Select
                                                    name="skilllevel"
                                                    selectedOption={this.state.skillData.experiencelevel}
                                                    controlFunc={(event) => this.handleChangeEdit(skill.id, event.target.name, event.target.value)}
                                                    options={skilllevel}
                                                    placeholder="Skill Level"
                                                />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <button type="button" className="ui right floated button" onClick={this.hideEditMenu}>cancel</button>
                                                <button type="button" className="ui right floated red button" onClick={() => this.saveContact(skill.id)}>Update</button>                                            </Table.Cell>
                                        </React.Fragment > :
                                        <React.Fragment>
                                            <Table.Cell>{skill.name}</Table.Cell>
                                            <Table.Cell>{skill.level}</Table.Cell>
                                            <Table.Cell>
                                                <button type="button" className="ui right floated button" onClick={() => this.handleDeleteData(skill.id)}><FontAwesomeIcon icon={faTrash} style={{ Color: 'red' }} /></button>
                                                <button type="button" className="ui right floated teal button" onClick={() => this.handleEditData(skill.id, index, skill.name, skill.level)}><FontAwesomeIcon icon={faPenToSquare} style={{ Color: 'black' }} /></button>
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

