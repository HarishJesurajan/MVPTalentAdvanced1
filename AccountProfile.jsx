import React from 'react';
import Cookies from 'js-cookie';
import SocialMediaLinkedAccount from './SocialMediaLinkedAccount.jsx';
import { IndividualDetailSection } from './ContactDetail.jsx';
import FormItemWrapper from '../Form/FormItemWrapper.jsx';
import { Address, Nationality } from './Location.jsx';
import Language from './Language.jsx';
import Skill from './Skill.jsx';
import Education from './Education.jsx';
import Certificate from './Certificate.jsx';
import VisaStatus from './VisaStatus.jsx'
import PhotoUpload from './PhotoUpload.jsx';
import VideoUpload from './VideoUpload.jsx';
import CVUpload from './CVUpload.jsx';
import SelfIntroduction from './SelfIntroduction.jsx';
import Experience from './Experience.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';
import { LoggedInNavigation } from '../Layout/LoggedInNavigation.jsx';
import TalentStatus from './TalentStatus.jsx';
import { Description } from './Description.jsx';

export default class AccountProfile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            profileData: {
                address: {
                    number: "",
                    street: "",
                    suburb:"",
                    postCode:0,
                    city:"",
                    country:"",
                },
                nationality: '',
                summary: "",
                description: "",
                education: [],
                languages: [{
                    id: 0,
                    language: "",
                    languagelevel: ""
                }],
                deleteLanguageId:"",
                skills: [{
                    id: 0,
                    skill: "",
                    experiencelevel: ""
                }],
                deleteSkillId: "",
                experience: [{
                    id: "0",
                    company: "",
                    position: "",
                    responsibilities: "",
                    start: "",
                    end:""
                }],
                deleteExperienceId:"",
                certifications: [],
                visaStatus: '',
                visaExpiryDate: '',
                profilePhoto: '',
                linkedAccounts: {
                    linkedIn: "",
                    github: ""
                },
                jobSeekingStatus: {

                    status: "Actively looking for a job",
                    availableDate: ""
                }
            },
            isLoading: true,
            loaderData: loaderData,

        }

        this.updateWithoutSave = this.updateWithoutSave.bind(this)
        this.updateAndSaveData = this.updateAndSaveData.bind(this)
        this.updateForComponentId = this.updateForComponentId.bind(this)
        this.saveProfile = this.saveProfile.bind(this)
        this.loadData = this.loadData.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.init = this.init.bind(this);
    };

    init() {
        let loaderData = this.state.loaderData;
        loaderData.allowedUsers.push("Talent");
        loaderData.isLoading = false;
        this.setState({ loaderData, })
    }

    componentDidMount() {
        this.loadData();
        console.log("test2")
        this.setState({
            isLoading: false
        })
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://talentservicesprofileadvanced1.azurewebsites.net/profile/profile/getTalentProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                let newProfile = Object.assign({}, this.state.profileData, res.data)
                this.setState({
                    profileData: newProfile
                }) 
                console.log(res.data)
                
            }.bind(this)
        })
        console.log(this.state.profileData)
        this.init()
    }
    //updates component's state without saving data
    updateWithoutSave(newValues) {
        let newProfile = Object.assign({}, this.state.profileData, newValues)
        this.setState({
            profileData: newProfile
        })
        console.log("test3")
    }

    //updates component's state and saves data
    updateAndSaveData(newValues) {
        let newProfile = Object.assign({}, this.state.profileData, newValues)
        this.setState({
            profileData: newProfile
        }, this.saveProfile)

    }

    updateForComponentId(componentId, newValues) {
        this.updateAndSaveData(newValues)
    }

    saveProfile() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://talentservicesprofileadvanced1.azurewebsites.net/profile/profile/updateTalentProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.state.profileData),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show("Profile updated sucessfully", "success", null, null)
                    this.setState({
                        profileData: res.data
                    })
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
        return (this.state.isLoading ? <div><em>loading</em></div>:this.renderDisplay())
    }
    renderDisplay() {
        const profile = {
            firstName: this.state.profileData.firstName,
            lastName: this.state.profileData.lastName,
            email: this.state.profileData.email,
            phone: this.state.profileData.phone
        }
        

        const LinkedAccounts = {
                linkedIn: this.state.profileData.linkedAccounts.linkedIn,
                github: this.state.profileData.linkedAccounts.github
        }
        const address = {
            address:{
                number: this.state.profileData.address.number,
                street: this.state.profileData.address.street,
                suburb: this.state.profileData.address.suburb,
                postCode: this.state.profileData.address.postCode,
                city: this.state.profileData.address.city,
                country: this.state.profileData.address.country,
            }
        }
        const nationality = {
            nationality: this.state.profileData.nationality
        }
        const visa = {
            visaStatus: this.state.profileData.visaStatus,
            visaExpiryDate:this.state.profileData.visaExpiryDate
        }
        const jobStatus = {
            jobSeekingStatus: this.state.profileData.jobSeekingStatus
        }
        return (
            this.state.isLoading?<em>Loading...</em>:
            <BodyWrapper reload={this.loadData} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui container">
                            <div className="profile">
                                <form className="ui form">
                                    <div className="ui grid">
                                        <FormItemWrapper
                                            title='Linked Accounts'
                                            tooltip='Linking to online social networks adds credibility to your profile'
                                        >
                                            <SocialMediaLinkedAccount
                                                linkedAccount={LinkedAccounts}
                                                updateProfileData={this.updateWithoutSave}
                                                saveProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='User Details'
                                            tooltip='Enter your contact details'
                                        >
                                            <IndividualDetailSection
                                                controlFunc={this.updateForComponentId}
                                                details={profile}
                                                componentId='contactDetails'
                                            />
                                            </FormItemWrapper>
                                        <FormItemWrapper
                                                title='Description'
                                                tooltip='Enter your Description'>
                                                <Description
                                                    summary={this.state.profileData.summary}
                                                    description={this.state.profileData.description}
                                                    updateStateData={this.updateAndSaveData}
                                                />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Address'
                                            tooltip='Enter your current address'>
                                            <Address
                                                addressData={address}
                                                updateProfileData={this.updateWithoutSave}
                                                saveProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Nationality'
                                            tooltip='Select your nationality'
                                        >
                                            <Nationality
                                                    nationalityData={nationality}
                                                    saveProfileData={this.updateAndSaveData}
                                                    isLoading={this.state.isLoading}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Languages'
                                            tooltip='Select languages that you speak'
                                        >
                                            <Language
                                                    languageData={this.state.profileData.languages}
                                                    updateProfileData={this.updateAndSaveData}
                                                    updateWithoutSave={this.updateWithoutSave}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Skills'
                                            tooltip='List your skills'
                                        >
                                            <Skill
                                                skillData={this.state.profileData.skills}
                                                updateProfileData={this.updateAndSaveData}
                                                updateWithoutSave={this.updateWithoutSave}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Work experience'
                                            tooltip='Add your work experience'
                                        >
                                            <Experience
                                                    experienceData={this.state.profileData.experience}
                                                    updateProfileData={this.updateAndSaveData}
                                                    updateWithoutSave={this.updateWithoutSave}
                                            />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Visa Status'
                                            tooltip='What is your current Visa/Citizenship status?'
                                        >
                                            <VisaStatus
                                                VisaData={visa}
                                                updateProfileData={this.updateWithoutSave}
                                                saveProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Status'
                                            tooltip='What is your current status in jobseeking?'
                                        >
                                            <TalentStatus
                                                status={jobStatus}
                                                updateProfileData={this.updateWithoutSave}
                                                saveProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Profile Photo'
                                            tooltip='Please upload your profile photo'
                                            hideSegment={true}
                                        >
                                                <PhotoUpload
                                                imageId={this.state.profileData.profilePhoto}
                                                updateProfileData={this.updateWithoutSave}
                                                saveProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Profile Video'
                                            tooltip='Upload a brief self-introduction video'
                                            hideSegment={true}
                                        >
                                            <VideoUpload
                                                videoName={this.state.profileData.videoName}
                                                updateProfileData={this.updateWithoutSave}
                                                saveVideoUrl={'https://talentservicesprofileadvanced1.azurewebsites.net/profile/profile/updateTalentVideo'}
                                            />
                                        </FormItemWrapper>
                                       
                                    </div>
                                </form>
                            </div >
                        </div>
                    </div>
                </section>
            </BodyWrapper>
        )
    }
}
