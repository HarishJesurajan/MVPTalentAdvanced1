import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            newStatus: {
                jobSeekingStatus: {
                    jobSeekingStatus: { status: "Actively looking for a job" }
                },
                jobSeekingStatus: props.status
                }
            }

        this.handleChange = this.handleChange.bind(this)

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.status !== this.props.status) {
            this.setState({
                newStatus: {
                    jobSeekingStatus: nextProps.status
                }
            });
        }
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newStatus.jobSeekingStatus)
        data[event.target.name] = event.target.value
        this.props.saveProfileData({ jobSeekingStatus: data })
        this.setState({
            newStatus: {
                jobSeekingStatus: data
            }
        })
    }


    render() {
        try {
            if (this.props.status.jobSeekingStatus.status == null) {
                var status = "Actively looking for a job";
            }
            else if (this.props.status.jobSeekingStatus.status != null) {
                var status = this.props.status.jobSeekingStatus.status
            }
        } catch (error) {
            // Code to handle the exception
            console.error("Caught an error:", error.message);
        }

        return (
           
            <div className='ui sixteen wide column'>
              <label><strong>Current Status</strong></label><br></br>
                  <label>
                    <input
                            id="status"
                            type="radio"
                            name="status"
                            value="Actively looking for a job"
                        checked={status === "Actively looking for a job"? true : false}
                        onChange={this.handleChange}
                        errorMessage="please select valid status"
                        style={{ marginRight: "10x" }}
                    />
                     Actively looking for a job
                </label><br></br>
                  <label>
                    <input
                        id="status"
                            type="radio"
                            name="status"
                            value="Not looking for a job at the moment"
                        checked={status === "Not looking for a job at the moment" ? true : false}
                        onChange={this.handleChange}
                        errorMessage="please select valid status"
                        style={{ marginRight: "10x" }}
                    />
                     Not looking for a job at the moment
                </label><br></br>
                  <label>
                    <input
                        id="status"
                            type="radio"
                            name="status"
                            value="Currently employed but open to offers"
                        checked={status === "Currently employed but open to offers" ? true : false}
                        onChange={this.handleChange}
                        errorMessage="please select valid status"
                        style={{ marginRight: "10x" }}
                    />
                    Currently employed but open to offers
                </label><br></br>
                  <label>
                    <input
                        id="status"
                        type="radio"
                        name="status"
                        value="Will be available on later date"
                        checked={status === "Will be available on later date" ? true : false}
                        onChange={this.handleChange}
                        errorMessage="please select valid status"
                        style={{marginRight:"10x"} }
                    />
                     Will be available on later date
                  </label>
              </div>
        )
    }
}