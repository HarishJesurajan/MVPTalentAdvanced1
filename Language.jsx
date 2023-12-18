/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx';
import { Table } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash} from '@fortawesome/free-solid-svg-icons'


export default class Language extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditSection: false,
            editIndex:0,
            showAddSection: false,
            listLanguage: {
                languages: this.props.languageData
            },
            languageData: {
                id:"",
                language: "",
                languagelevel: ""
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
            languageData: {
                id: "",
                language: "",
                languagelevel: ""
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
        const data = Object.assign({},this.state.languageData)
        data[event.target.name] = event.target.value
        this.setState({
            languageData: data,
        }, () => this.setState({
            listLanguage: {
                languages: [{
                    id: "0",
                    name: this.state.languageData.language,
                    level: this.state.languageData.languagelevel
                }]
            }
        }))
    }
    handleChangeEdit(id,name,value) {
        const data = Object.assign({}, this.state.languageData)
        data[name] = value
        data["id"] = id
        this.setState({
            languageData: data,
        }, () => this.setState({
            listLanguage: {
                languages: [{
                    id: this.state.languageData.id,
                    name: this.state.languageData.language,
                    level: this.state.languageData.languagelevel
                }]
            }
        }))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.languageData !== this.props.languageData) {
            this.setState({
                listLanguage: {
                    languages: nextProps.languageData
                }
            });
        }
        console.log(nextProps.nationalityData)
    }
    saveContact(id) {
        this.setState({
            showAddSection:false,
            showEditSection: false,
        })
        const data1 = Object.assign({}, this.state.listLanguage)
        this.props.updateProfileData(data1)
    }
    handleEditData(id, index,language,languagelevel) {
        this.setState({
            editIndex: index,
            showAddSection: false,
            languageData: {
                language: language,
                languagelevel: languagelevel
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
        this.deleteLanguage(id)
    }

    deleteLanguage(id) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://talentservicesprofileadvanced1.azurewebsites.net/profile/profile/DeleteLanguage',
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
                        listLanguage: {
                            languages: res.data.languages
                        }
                    })
                    this.props.updateWithoutSave(this.state.listLanguage)
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
        const languageLevels = ["Basic", "Conversational", "Fluent", "Native / Bilingual"];

        const languagelevel = Object.keys(languageLevels).map(language => ({
            value: languageLevels[language],
        }));
        let addSection = this.state.showAddSection ? <div className="row">
            <div className='six wide column'>
                <ChildSingleInput
                    inputType="text"
                    name="language"
                    value={this.state.languageData.language}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Add Language"
                    errorMessage="Please enter a valid Language"
                />
            </div>
            <div className='six wide column'>
                <Select
                    name="languagelevel"
                    selectedOption={this.state.languageData.languagelevel}
                    controlFunc={this.handleChange}
                    options={languagelevel}
                    placeholder="Language Level"
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
                                    <Table.HeaderCell>Language</Table.HeaderCell>
                                    <Table.HeaderCell>Level</Table.HeaderCell>
                                <Table.HeaderCell><button type="button" className="ui right floated teal button" onClick={this.showAddMenu}><FontAwesomeIcon icon={faPlus} /> Add New</button></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                            {this.props.languageData.map((language, index) =>
                                <Table.Row key={index}>
                                        {(this.state.showEditSection && this.state.editIndex == index) ?
                                        <React.Fragment>
                                            <Table.Cell>
                                                    <ChildSingleInput
                                                    inputType="text"
                                                    name="language"
                                                    value={this.state.languageData.language}
                                                    controlFunc={(event) => this.handleChangeEdit(language.id, event.target.name, event.target.value)}
                                                    maxLength={80}
                                                    placeholder="Add Language"
                                                    errorMessage="Please enter a valid Language"
                                                    />
                                            </Table.Cell>   
                                            <Table.Cell>
                                                    <Select
                                                    name="languagelevel"
                                                    selectedOption={this.state.languageData.languagelevel}
                                                    controlFunc={(event) => this.handleChangeEdit(language.id, event.target.name, event.target.value)}
                                                    options={languagelevel}
                                                    placeholder="Language Level"
                                                    />
                                            </Table.Cell> 
                                            <Table.Cell>
                                                <button  type="button" className="ui right floated button" onClick={this.hideEditMenu}>cancel</button>
                                                <button type="button" className="ui right floated red button" onClick={()=>this.saveContact(language.id)}>Update</button>                                            </Table.Cell>
                                        </React.Fragment >:
                                        <React.Fragment>      
                                               <Table.Cell>{language.name}</Table.Cell>
                                               <Table.Cell>{language.level}</Table.Cell>
                                               <Table.Cell>
                                                <button type="button" className="ui right floated button" onClick={() => this.handleDeleteData(language.id)}><FontAwesomeIcon icon={faTrash} style={{ Color: 'red' }} /></button>
                                                <button type="button" className="ui right floated teal button" onClick={() => this.handleEditData(language.id, index, language.name, language.level)}><FontAwesomeIcon icon={faPenToSquare} style={{ Color: 'black' }} /></button>
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