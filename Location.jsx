import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { default as Nationalities } from '../../../../util/jsonFiles/Nationalities.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx';
import { countries } from '../Employer/common';



export class Address extends React.Component {
    constructor(props) {
        super(props)
        const address = props.addressData
        this.state = {
            showEditSection: false,
            newAddress: address
        }
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)

    }

    openEdit() {
        const details = Object.assign({}, this.props.addressData)
        this.setState({
            showEditSection: true,
            newAddress: details
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    saveContact() {
        const data = Object.assign({}, this.state.newAddress)
        this.props.saveProfileData(data)
        this.closeEdit()
    }

    handleChange(event) {
        const address = Object.assign({}, this.state.newAddress.address)
        address[event.target.name] = event.target.value
        this.props.updateProfileData(address)
        this.setState({
            newAddress: { address }
        })
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )

    }

    renderEdit() {
        const countriesData = Countries;

        const countryOptions = Object.keys(countriesData).map(country => ({
            value: country,
            cities: countriesData[country],
        }));
        var cityOptions = this.state.newAddress.address.country === "" ? [{ city: { value: "" } }]: Object.keys(countryOptions.find(s => s.value === this.state.newAddress.address.country).cities).map(city => ({
            value: countryOptions.find(s => s.value === this.state.newAddress.address.country).cities[city]
        }));

        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="Number"
                    name="number"
                    value={this.state.newAddress.address.number}
                    controlFunc={this.handleChange}
                    maxLength={10}
                    placeholder="number"
                    errorMessage="Please enter a valid address number"
                />
                    <ChildSingleInput
                        inputType="text"
                        label="Street"
                        name="street"
                        value={this.state.newAddress.address.street}
                        controlFunc={this.handleChange}
                        maxLength={100}
                        placeholder="street"
                        errorMessage="Please enter a valid address number"
                    />
                    <ChildSingleInput
                        inputType="text"
                        label="Suburb"
                        name="suburb"
                        value={this.state.newAddress.address.suburb}
                        controlFunc={this.handleChange}
                        maxLength={100}
                        placeholder="suburb"
                        errorMessage="Please enter a valid address number"
                />
                <ChildSingleInput
                    inputType="text"
                    label="Postcode"
                    name="postCode"
                    value={this.state.newAddress.address.postCode == 0 ? "" : this.state.newAddress.address.postCode}
                    controlFunc={this.handleChange}
                    maxLength={100}
                    placeholder="Postcode Postal code"
                    errorMessage="Please enter a valid post code"
                />
                <label><strong>Country</strong></label>
                <Select
                    style = {{marginBottom:"20px"}}
                    name="country"
                    selectedOption={this.state.newAddress.address.country}
                    controlFunc={this.handleChange}
                    options={countryOptions}
                    placeholder="Country"
                />
                <label style={{ marginTop: "20px" }}><strong>City</strong></label>
                <Select
                    style={{ marginBottom: "5px" }}
                    name="city"
                    selectedOption={this.state.newAddress.address.city}
                    controlFunc={this.handleChange}
                    options={cityOptions}
                    placeholder="City"
                />
                <button type="button" className="ui teal button" onClick={this.saveContact} style={{ marginTop: "20px" }}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit} style={{ marginTop: "3px" }}>Cancel</button>
            </div>
        )
    }

   renderDisplay() {

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address: {this.props.addressData.address.number} {this.props.addressData.address.street} {this.props.addressData.address.suburb} {this.props.addressData.address.postCode === 0 ? "" : this.props.addressData.address.postCode}</p>
                        <p>City: {this.props.addressData.address.city}</p>
                        <p>Country: {this.props.addressData.address.country}</p>
                    </React.Fragment>
                    <button className="ui right floated teal button ml-auto" style={{ color: "white", margin: "3px" }} onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)
        const nationality = props.nationalityData

        console.log("from location page");
        console.log(props.nationalityData);
        console.log(nationality);
       

        console.log(nationality);
        this.state = {
            newNationality: nationality,
        }
        
        this.handleChange = this.handleChange.bind(this)

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.nationalityData !== this.props.nationalityData) {
            this.setState({ newNationality: nextProps.nationalityData });
        }
        console.log(nextProps.nationalityData)
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newNationality)
        data[event.target.name] = event.target.value
        console.log(data)
        this.props.saveProfileData(data)
        this.setState({
            newNationality: data
        })
        console.log(this.state.newNationality)
    }


    render() {
        //const nationalityData = Nationalities
        //const nationalityOptions = Object.keys(nationalityData).map(nationality => ({
        //    value: nationalityData[nationality],
        //}));
        const countriesData = Countries;

        const countryOptions = Object.keys(countriesData).map(country => ({
            value: country,
            cities: countriesData[country],
        }));
        return (
            this.props.isLoading ?
                <em>loading..</em> : 
                (<div className='ui sixteen wide column'>
                <label><strong>Nationality</strong></label>
                <Select
                    style={{ marginBottom: "20px" }}
                    name="nationality"
                        selectedOption={this.state.newNationality.nationality != null ? this.state.newNationality.nationality:""}
                    controlFunc={this.handleChange}
                    options={countryOptions}
                    placeholder="Select your Nationality"
                />
            </div>)
        )
    }
}