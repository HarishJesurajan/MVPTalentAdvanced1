import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { default as Nationalities } from '../../../../util/jsonFiles/Nationalities.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx';
import { countries } from '../Employer/common';

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visa: props.VisaData,
        }
        console.log(this.state.visa)
        this.handleChange = this.handleChange.bind(this)

    }
    componentWillReceiveProps(nextProps) {
        nextProps.VisaData !== this.props.VisaData
        this.setState({ visa: nextProps.VisaData });
        console.log(nextProps.VisaData)
        }

    handleChange(event) {
        const data = Object.assign({}, this.state.visa)
        data[event.target.name] = event.target.value
        this.props.saveProfileData(data)
        this.setState({
           visa: data,
        })
        console.log(this.state.visa)
    }



    render() {
        //const nationalityData = Nationalities
        //const nationalityOptions = Object.keys(nationalityData).map(nationality => ({
        //    value: nationalityData[nationality],
        //}));

        const visaStatus = ["Citizen", "Permanent Resident", "Work Visa", "Student Visa"]
        const visaStatusOptions = Object.keys(visaStatus).map(status => ({
            value: visaStatus[status],
        }));


        return (
            <React.Fragment>
                <div className='ui eight wide column'>
                    <label><strong>Visa status</strong></label>
                    <Select
                        name="visaStatus"
                        selectedOption={this.state.visa.visaStatus != null ? this.state.visa.visaStatus:""}
                        controlFunc={this.handleChange}
                        options={visaStatusOptions}
                        placeholder="Select your Visa Status"
                    />
                </div>
                {(this.state.visa.visaStatus == "Work Visa" || this.state.visa.visaStatus == "Student Visa") ? <div className='ui eight wide column'>
                    <label><strong>Visa expiry date</strong></label>
                    <input
                        type="date"
                        name="visaExpiryDate"
                        value={new Date(this.state.visa.visaExpiryDate).toISOString().split('T')[0]}
                        onChange={this.handleChange}
                        errorMessage="please select valid status"
                    />
                </div>: null }
            </React.Fragment>
        )
    }
}