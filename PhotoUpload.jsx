/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);
/*        this.hiddenFileInput = React.createRef()*/
        this.state = {
            newPhoto: {
                profilePhoto: props.imageId,
                profilePhotoUrl: ""
            }
        }
        this.handleImageSubmit = this.handleImageSubmit.bind(this)
        
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.imageId !== this.props.imageId) {
            this.setState({
                newPhoto: {
                    profilePhoto: nextProps.imageId,
                }
            });
        }
    }

    onChange(e) {
        let files = e.target.files;
        console.log(files);
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);

        reader.onload = e => {
            console.log(e.target.result);
            this.setState({
                newPhoto: {
                    profilePhoto: e.target.result,
                }
            });
            
        }
    }
    //handleClick() {
    //    this.hiddenFileInput.current.click();
    //}
    handleImageSubmit() {
        this.props.saveProfileData(this.state.newPhoto)
    }

    render() {
        return (
            
            
            <React.Fragment>
                    <div className="ui four wide column">
                        <label htmlFor="fileInput">
                            <input
                                id="fileInput"
                                type="file"
                                name="file"
                                onChange={e => this.onChange(e)}
                                accept="image/*"
                                src={this.state.newPhoto.profilePhoto}
                                style={{ display: "none" }}
                            />
                            <img src={this.state.newPhoto.profilePhoto ? this.state.newPhoto.profilePhoto : "https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"} alt="profilepicture" style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
                        </label>
                    </div>
                    <div className="ui four wide column">
                            <button type="button" className="ui right floated teal button" onClick={() => this.handleImageSubmit()}>Upload</button>
                    </div>
            </React.Fragment>
        )
    }

}

